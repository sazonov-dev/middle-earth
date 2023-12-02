import '../assets/styles/main.css';
const startForm = document.querySelector('.gameSettings');
const inputs = Array.from(document.querySelector('.gameSettings').querySelectorAll('.team'));
const loader = document.querySelector('.loader');

let isPlaying = false;
let audioPlayed = false;

const load_screen_phrases = [
    "Генерация мира... Подготовь свое королевство к великим подвигам!",
    "Загрузка ресурсов... Время собрать свою армию и вступить в битву!",
    "Формирование карты... Средиземье оживает под твоим контролем!",
    "Подготовка к битве... Выбери стратегию и покажи свое военное мастерство!",
    "Завершение тренировки... Твои войска готовы к великим подвигам!",
    "Ожидание союзников... Вместе мы сможем завоевать весь мир!"
]

const inputValidator = (input) => {
    if (input.value === '') {
        input.placeholder = 'Пустое поле'
        return true;
    }
}

const formHandler = (event) => {
    event.preventDefault();
    const form = event.target;
    const status = inputs.some((input) => inputValidator(input));

    if (!status) {
        form.style.display = 'none';
        document.body.style.display = 'block';
        loaderHandler();
    }
}

const loaderHandler = () => {
    const span = loader.querySelector('span');
    const phrases = [...load_screen_phrases];
    loader.style.display = 'flex';

    phrases.forEach((phrase, index) => {
        setTimeout(() => {
            span.textContent = phrase;

            if (index === phrases.length - 1) {
                // Если это последняя итерация, то устанавливаем таймаут для скрытия лоадера
                setTimeout(() => {
                    loader.style.display = 'none'; // Или другой способ скрытия лоадера
                }, 2000); // Задержка перед скрытием лоадера после завершения цикла (в данном случае 2000 мс или 2 секунды)
            }
        }, index * 2000); // Задержка в миллисекундах (в данном случае 2000 мс или 2 секунды)
    })
}

const playAudioOnFirstMove = () => {
    if (!audioPlayed) {
        const audio = document.getElementById('music');
        if (audio) {
            audio.play();
            audioPlayed = true;
        }
    }
}

const startApp = () => {
    startForm.addEventListener('submit', formHandler)

    inputs.forEach((input) => input.addEventListener('input', () => playAudioOnFirstMove()));
}

startApp();


