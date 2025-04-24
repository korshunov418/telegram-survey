// Инициализация Telegram WebApp
Telegram.WebApp.ready();
Telegram.WebApp.expand();

// Показываем/скрываем поля оплаты
function togglePaymentFields() {
    const isPaid = document.querySelector('input[name="isPaid"]:checked').value === 'yes';
    document.getElementById('paymentFields').style.display = isPaid ? 'block' : 'none';
}

// Обновляем поля в зависимости от типа периодичности
function updateFrequencyFields() {
    const frequency = document.getElementById('frequency').value;
    const container = document.getElementById('frequencyFields');
    
    container.innerHTML = '';
    
    switch(frequency) {
        case 'single':
            container.innerHTML = `
                <div class="form-group">
                    <label for="startDate">Дата начала*</label>
                    <input type="date" id="startDate" required>
                </div>
            `;
            break;
            
        case 'yearly':
            container.innerHTML = `
                <div class="form-group">
                    <label>Выберите даты*</label>
                    <div class="checkbox-group" id="yearlyDates">
                        ${Array.from({length: 12}, (_, i) => {
                            const date = new Date();
                            date.setMonth(i);
                            const monthName = date.toLocaleString('ru', { month: 'long' });
                            return `
                                <label>
                                    <input type="checkbox" name="yearlyDates" value="${i+1}">
                                    ${monthName}
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
            break;
            
        case 'monthly':
            container.innerHTML = `
                <div class="form-group">
                    <label>Тип ежемесячной встречи*</label>
                    <div class="radio-group">
                        <label><input type="radio" name="monthlyType" value="day" checked onclick="updateMonthlyFields()"> По числам</label>
                        <label><input type="radio" name="monthlyType" value="weekday" onclick="updateMonthlyFields()"> По дням недели</label>
                    </div>
                </div>
                <div id="monthlyFields"></div>
            `;
            updateMonthlyFields();
            break;
            
        case 'weekly':
            container.innerHTML = `
                <div class="form-group">
                    <label>Дни недели*</label>
                    <div class="checkbox-group">
                        ${['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'].map(day => `
                            <label>
                                <input type="checkbox" name="weeklyDays" value="${day}">
                                ${day}
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
            break;
    }
}

// Обновляем поля для ежемесячных встреч
function updateMonthlyFields() {
    const type = document.querySelector('input[name="monthlyType"]:checked').value;
    const container = document.getElementById('monthlyFields');
    
    container.innerHTML = type === 'day' ? `
        <div class="form-group">
            <label for="monthlyDay">Число месяца*</label>
            <select id="monthlyDay" required>
                ${Array.from({length: 31}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}
            </select>
        </div>
    ` : `
        <div class="form-group">
            <label>Дни недели*</label>
            <div class="checkbox-group">
                ${['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'].map(day => `
                    <label>
                        <input type="checkbox" name="monthlyWeekdays" value="${day}">
                        ${day}
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

// Обработка выбора продолжительности
document.getElementById('duration').addEventListener('change', function() {
    document.getElementById('customDuration').style.display = 
        this.value === 'custom' ? 'block' : 'none';
});

// Обработка ограничения участников
document.getElementById('maxParticipants').addEventListener('input', function() {
    document.getElementById('reserveGroup').style.display = 
        this.value && parseInt(this.value) > 0 ? 'block' : 'none';
});

// Отправка формы
function submitForm() {
    const formData = {
        // Основные поля
        eventName: document.getElementById('eventName').value,
        frequency: document.getElementById('frequency').value,
        startTime: document.getElementById('startTime').value,
        
        // Поля периодичности
        ...getFrequencyData(),
        
        // Остальные поля
        duration: getDurationValue(),
        pollBefore: getPollBeforeValue(),
        maxParticipants: document.getElementById('maxParticipants').value || null,
        reserve: document.getElementById('maxParticipants').value ? 
            document.querySelector('input[name="reserve"]:checked').value : null,
        pollCloseBefore: getPollCloseBeforeValue(),
        location: document.getElementById('location').value,
        comments: document.getElementById('comments').value,
        isPaid: document.querySelector('input[name="isPaid"]:checked').value === 'yes',
        ...getPaymentData()
    };
    
    // Валидация
    if (!formData.eventName || !formData.frequency || !formData.startTime) {
        alert('Пожалуйста, заполните обязательные поля (помечены *)');
        return;
    }
    
    // Отправляем данные в бота
    Telegram.WebApp.sendData(JSON.stringify(formData));
    Telegram.WebApp.close();
}

// Вспомогательные функции для получения данных
function getFrequencyData() {
    const frequency = document.getElementById('frequency').value;
    
    switch(frequency) {
        case 'single':
            return { startDate: document.getElementById('startDate').value };
        case 'yearly':
            return { 
                yearlyDates: Array.from(document.querySelectorAll('input[name="yearlyDates"]:checked'))
                    .map(el => el.value) 
            };
        case 'monthly':
            const type = document.querySelector('input[name="monthlyType"]:checked').value;
            return type === 'day' ? 
                { monthlyDay: document.getElementById('monthlyDay').value } :
                { 
                    monthlyWeekdays: Array.from(document.querySelectorAll('input[name="monthlyWeekdays"]:checked'))
                        .map(el => el.value) 
                };
        case 'weekly':
            return { 
                weeklyDays: Array.from(document.querySelectorAll('input[name="weeklyDays"]:checked'))
                    .map(el => el.value) 
            };
    }
}

function getDurationValue() {
    const duration = document.getElementById('duration').value;
    return duration === 'custom' ? 
        document.getElementById('customDuration').value :
        duration;
}

function getPollBeforeValue() {
    return {
        value: document.getElementById('pollBeforeValue').value,
        unit: document.getElementById('pollBeforeUnit').value
    };
}

function getPollCloseBeforeValue() {
    return {
        value: document.getElementById('pollCloseBeforeValue').value,
        unit: document.getElementById('pollCloseBeforeUnit').value
    };
}

function getPaymentData() {
    if (document.querySelector('input[name="isPaid"]:checked').value !== 'yes') {
        return {};
    }
    
    return {
        paymentType: document.querySelector('input[name="paymentType"]:checked')?.value,
        costType: document.getElementById('costType').value,
        costAmount: document.getElementById('costAmount').value || null
    };
}
// Показываем/скрываем поля оплаты
function togglePaymentFields() {
    const isPaid = document.querySelector('input[name="isPaid"]:checked').value === 'yes';
    document.getElementById('paymentFields').style.display = isPaid ? 'block' : 'none';
    
    // Сбрасываем валидацию при переключении
    if (!isPaid) {
        document.querySelectorAll('#paymentFields input').forEach(input => {
            input.removeAttribute('required');
        });
    }
}

// Переключаем поля стоимости
function toggleCostFields() {
    const costType = document.querySelector('input[name="costType"]:checked').value;
    document.getElementById('fixedCostField').style.display = 
        costType === 'fixed' ? 'block' : 'none';
    document.getElementById('totalCostField').style.display = 
        costType === 'split' ? 'block' : 'none';
}

// Валидация перед отправкой
function validatePaymentFields() {
    const isPaid = document.querySelector('input[name="isPaid"]:checked').value === 'yes';
    if (!isPaid) return true;

    // Проверяем тип оплаты
    if (!document.querySelector('input[name="paymentType"]:checked')) {
        alert('Укажите тип оплаты (предоплата/постоплата)');
        return false;
    }

    // Проверяем стоимость
    const costType = document.querySelector('input[name="costType"]:checked').value;
    if (costType === 'fixed' && !document.getElementById('fixedAmount').value) {
        alert('Укажите фиксированную сумму');
        return false;
    }
    if (costType === 'split' && !document.getElementById('totalAmount').value) {
        alert('Укажите общую сумму');
        return false;
    }

    return true;
}

// Обновляем функцию submitForm()
function submitForm() {
    // ... существующая валидация ...
    
    if (!validatePaymentFields()) return;
    
    const formData = {
        // ... другие поля ...
        payment: getPaymentData()
    };
    
    Telegram.WebApp.sendData(JSON.stringify(formData));
    Telegram.WebApp.close();
}

// Получаем данные по оплате
function getPaymentData() {
    const isPaid = document.querySelector('input[name="isPaid"]:checked').value === 'yes';
    if (!isPaid) return null;

    return {
        paymentType: document.querySelector('input[name="paymentType"]:checked').value,
        costType: document.querySelector('input[name="costType"]:checked').value,
        amount: document.querySelector('input[name="costType"]:checked').value === 'fixed' 
            ? document.getElementById('fixedAmount').value 
            : document.getElementById('totalAmount').value
    };
}
// Инициализация формы
document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем минимальную дату (сегодня)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate')?.setAttribute('min', today);
    
    // Инициализируем поля
    updateFrequencyFields();
});
