document.getElementById('surveyForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const question1 = document.getElementById('question1').value;
    const question2 = document.getElementById('question2').value;
    const question3 = document.getElementById('question3').value;

    // Здесь можно отправить данные на сервер или обработать их
    console.log({
        question1,
        question2,
        question3
    });

    alert('Спасибо за ваш ответ!');
});