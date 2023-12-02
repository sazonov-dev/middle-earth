import '../assets/styles/main.css';
const startForm = document.querySelector('.gameSettings');
const inputs = Array.from(document.querySelector('.gameSettings').querySelectorAll('.team'));
const loader = document.querySelector('.loader');
import {soldier, Team, Soldier} from './gameGeneration';

let isPlaying = false;
let audioPlayed = false;
const teams = {};

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

        inputs.forEach((input) => {
            teams[input.id] = new Team(Number(input.value));
        })

        loaderHandler();
    }
}

const teamBlacklistFilter = (team, soldier) => {
    const soldierBlacklist = soldier.getThisSoldier().blacklist;
    let black = false

    for (let i = 0; i < soldierBlacklist; i ++) {
        if (black === true) {
            break;
        }
        if (team.includes(soldierBlacklist[i])) {
            black = true;
            break;
        } else {
            i++
        }
    }

    return black;
}

const teamGenerate = () => {
    for (let key in teams) {
        while(teams[key].soldiers.length < teams[key].count) {
            if (teams[key].soldiers.length === 0) {
                teams[key].setSoldier(generateSoldiers());
            } else {
                const soldier = generateSoldiers()
                if (!teamBlacklistFilter(teams[key].soldiers, soldier)) {
                    teams[key].setSoldier(soldier);
                } else {
                    return null;
                }
            }
        }
    }
    console.log(teams)
}

const randomSoldier = () => {
    const soldiers = soldier.getSoldier();
    const keys = Object.keys(soldiers);
    return soldiers[keys[Math.floor(Math.random() * keys.length)]]
}

const generateSoldiers = () => {
    const soldier = new Soldier(randomSoldier());
    return soldier.getThisSoldier();
}

const loaderHandler = () => {
    const span = loader.querySelector('span');
    const phrases = [...load_screen_phrases];
    loader.style.display = 'flex';
    teamGenerate();

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

    console.log(soldier.getSoldier());
}

startApp();


