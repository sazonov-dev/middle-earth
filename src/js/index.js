import '../assets/styles/main.css';
const startForm = document.querySelector('.gameSettings');
const inputs = Array.from(document.querySelector('.gameSettings').querySelectorAll('.team'));
const startNewGameButton = document.querySelector('.startNewGame');
const loader = document.querySelector('.loader');
const content = document.querySelector('.content');
const contentTeamInfo = document.querySelector('.content-team-info');
const contentLogs = document.querySelector('.content-logs');
const contentHistory = document.querySelector('.content-history');
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
            teams[input.id] = new Team(Number(input.value), input.id);
            input.value = '';
        })

        loaderHandler();
    }
}

const contentTeamGenerate = (teams) => {
    const container = contentTeamInfo.querySelector('.content-info');

    for (let key in teams) {
        const p = document.createElement('p');
        p.classList.add('content-text');
        let text = '';
        const name = teams[key].name;
        const count = teams[key].count;

        text += `${name} имеет кол-во войск в размере: ${count}<br /><br />`

        teams[key].soldiers.forEach((soldier) => {
            text += `${soldier.name} | ${soldier.id} - hp:[${soldier.hp}] armor:[${soldier.armor}] speed:[${soldier.speed}] damage:[${soldier.damage}]<br /><br />`
        })

        p.innerHTML = text;

        container.appendChild(p);
    }
}

const getRandomSoldier = (team) => {
    const soldiers = team.soldiers;

    return soldiers[Math.floor(Math.random() * soldiers.length)]
}

const personHandler = (defensePerson, attackPerson, teamDefense, teamAttack) => {
    if (attackPerson.type === 'human-witch') {
        teamDefense.removeSoldier(defensePerson);
        return teamAttack.setSoldier(defensePerson);
    }

    if (defensePerson.armor > 0) {
        return defensePerson.soldierAttack('armor', attackPerson.damage);
    }

    if (Number(attackPerson.damage) > 0 && defensePerson.hp > 0 && defensePerson.armor <= 0) {
        return defensePerson.soldierAttack('hp', attackPerson.damage);
    }

    if (defensePerson.hp <= 0) {
        return teamDefense.removeSoldier(defensePerson);
    }
}

const startGame = (team1 = null, team2 = null) => {
    const container = contentLogs.querySelector('.content-info');
    const containerHistory = contentHistory.querySelector('.content-info');

    let teamAttack = team1 === null ? teams['team-one'] : team1;
    let teamDefense = team2 === null ? teams['team-two'] : team2;

    if (teamAttack.soldiers.length === 0) {
        const p = document.createElement('p');
        p.classList.add('content-text');
        p.textContent = `Победила команда ${teamDefense.name} с оставшимся кол-вом войск ${teamDefense.soldiers.length}`;
        containerHistory.appendChild(p);
    }

    if (teamDefense.soldiers.length === 0) {
        const p = document.createElement('p');
        p.classList.add('content-text');
        p.textContent = `Победила команда ${teamAttack.name} с оставшимся кол-вом войск ${teamAttack.soldiers.length}`;;
        containerHistory.appendChild(p);
    }

    const attackPerson = getRandomSoldier(teamAttack);
    const defensePerson = getRandomSoldier(teamDefense);

    if (teamDefense.soldiers.length > 0 && teamAttack.soldiers.length > 0) {
        const p = document.createElement('p');
        p.classList.add('content-text');
        p.innerText = `${attackPerson.name} | ${attackPerson.id} - нанес дамаг ${attackPerson.damage === null ? 'чарами' : attackPerson.damage + ` с помощью ${attackPerson.weapon}`} по игроку ${defensePerson.name} | ${defensePerson.id}`

        container.appendChild(p);

        personHandler(defensePerson, attackPerson, teamDefense, teamAttack);
        console.log(teams);

        setTimeout(() => {
            startGame(teamDefense, teamAttack);
        }, 500)
    }
}

const clearHistory = () => {
    const data = contentTeamInfo.querySelector('.content-info').querySelectorAll('.content-text');
    const dataLogs = contentLogs.querySelector('.content-info').querySelectorAll('.content-text');
    data.forEach((element) => {
        contentTeamInfo.querySelector('.content-info').removeChild(element)
    });
    dataLogs.forEach((element) => {
        contentLogs.querySelector('.content-info').removeChild(element);
    })
    const content = document.querySelector('.content');
    content.classList.remove('active');
    startForm.style.display = 'flex';
}

const startNewGame = () => {
    clearHistory();
}

const teamBlacklistFilter = (team, soldier) => {
    for (let i = 0; i < team.length; i++) {
        return soldier.blacklist.includes(team[i].type);
    }
}

const teamGenerate = () => {
    for (let key in teams) {
        while (teams[key].soldiers.length < teams[key].count) {
            const soldier = generateSoldiers();
            if (!teamBlacklistFilter(teams[key].soldiers, soldier)) {
                teams[key].setSoldier(soldier);
            }
        }
    }

    return true;
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

    phrases.forEach((phrase, index) => {
        setTimeout(() => {
            span.textContent = phrase;
        }, index * 2000); // Задержка в миллисекундах (в данном случае 2000 мс или 2 секунды)
    })

    if (teamGenerate() === true) {
        setTimeout(() => {
            loader.style.display = 'none'; // Или другой способ скрытия лоадера
            content.classList.add('active');
            document.body.style.display = 'flex';
            contentTeamGenerate(teams);
            startGame();
        }, 5000); // Задержка перед скрытием лоадера после завершения цикла (в данном случае 2000 мс или 2 секунды)
    }
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
    startNewGameButton.addEventListener('click', startNewGame);

    console.log(soldier.getSoldier());
}

startApp();


