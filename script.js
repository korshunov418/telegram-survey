// Инициализация Telegram WebApp
Telegram.WebApp.ready();
Telegram.WebApp.expand();

// Показываем/скрываем поля оплаты
function togglePaymentFields() {
    const isPaid = document.querySelector('input[name="isPaid"]:checked').value === 'yes';
    document.getElementById('paymentFields').style.display = isPaid ? 'block' : 'none';
}

// Переключаем поля стоимости
function toggleCostFields() {
    const costType = document.querySelector('input[name="costType"]:checked').value;
    document.getElementById('fixedCostField').style.display = 
        costType === 'fixed' ? 'block' : 'none';
    document.getElementById('totalCostField').style.display = 
        costType === 'split' ? 'block' : 'none';
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
                    <label>Выберите месяцы*</label>
                    <div class="checkbox-group">
                        ${['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                           'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
                           .map((month, index) => `
                            <label>
                                <input type="checkbox" name="yearlyMonths" value="${index + 1}">
                                ${month}
                            </label>
                        `).join('')}
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
                        ${['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
                            .map(day => `
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

// Обновляем поля для ежемесячных встре
