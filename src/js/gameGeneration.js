export class Team {
    constructor(count) {
        this.name = null;
        this.soldiers = [];
        this.count = count;
    }

    setSoldier(soldier) {
        this.soldiers = [...this.soldiers, soldier];

        return this.soldiers;
    }

    removeSoldier(soldier) {
        this.soldiers = this.soldiers.filter((sol) => sol !== soldier);

        return this.soldiers;
    }
}

export class Soldier {
    constructor(props) {
        this.name = props && props.name ? props.name : null;
        this.id = props && props.id ? props.id : null;
        this.weapon = props && props.weapon ? props.weapon : null;
        this.vehicle = props && props.vehicle ? props.vehicle : null;
        this.hp = props && props.hp ? props.hp : null;
        this.armor = props && props.armor ? props.armor : null;
        this.accuracy = props && props.accuracy ? props.accuracy : null;
        this.speed = props && props.speed ? props.speed : null;
        this.damage = props && props.damage ? props.damage : null;
        this.blacklist = props && props.blacklist ? props.blacklist : null;
    }

    // пешие люди сильнее легкого орка, но медленнее его.
    // тяжелые орки сильнее любого персонажа, но медленнее всех.
    // колдуны не носят броню
    // эльфы метче и быстрее любого воина, но броня их слаба

    // Люди сражаются в пешем строю (на секирах) и на лошадях (всадники на мечах). Самая крепкая броня у пеших воинов, максимальный урон — у всадников.
    // Эльфы предпочитают луки и за счет природной меткости могут убивать попаданием в глаз (за один выстрел), но имеет легкую броню и ограниченное количество стрел.
    // Орки предпочитают пеший бой (на самом деле они такие страшные, что кони убегают от них) и представлены двумя видами: легкие и тяжелые воины. Легкие — быстрее, но имеет более слабую броню, тяжелые — сильнее и лучше защищены, но медленнее.
    // Колдуны — отдельная история, это те же люди, но они могут сражаться за людей и за орков. Оружие колдуна — чары. Чары не наносят урона, как у других воинов, чары переманивают врага на свою сторону. Если колдун нанес удар по одному из персонажей, то персонаж переходит на его сторону.

    getSoldier() {
        return {
            'human': {
                'name': 'человек',
                'weapon': 'секира',
                'vehicle': null,
                'hp': 15,
                'armor': 8,
                'accuracy': 5,
                'speed': 5,
                'damage': 5,
                'blackList': ['orc, orc-high']
            },
            'human-horse': {
                'name': 'всадник',
                'weapon': 'меч',
                'vehicle': 'лошадь',
                'hp': 15,
                'armor': 6,
                'accuracy': 5,
                'speed': 7,
                'damage': 7,
                'blackList': ['orc, orc-high']
            },
            'human-witch': {
                'name': 'колдун',
                'weapon': 'чары',
                'vehicle': null,
                'hp': 6,
                'armor': 0,
                'accuracy': 10,
                'speed': 5,
                'damage': 0,
                'blackList': []
            },
            'orc': {
                'name': 'орк легкий',
                'weapon': 'топор',
                'vehicle': null,
                'hp': 15,
                'armor': 4,
                'accuracy': 5,
                'speed': 7,
                'damage': 8,
                'blackList': ['human', 'human-horse', 'elf']
            },
            'orc-high': {
                'name': 'орк тяжелый',
                'weapon': 'топор',
                'vehicle': null,
                'hp': 20,
                'armor': 10,
                'accuracy': 3,
                'speed': 0,
                'damage': 10,
                'blackList': ['human', 'human-horse', 'elf']
            },
            'elf': {
                'name': 'эльф',
                'weapon': 'лук',
                'vehicle': null,
                'hp': 10,
                'armor': 1,
                'accuracy': 10,
                'speed': 10,
                'damage': 6,
                'blackList': ['orc, orc-high']
            },
        }
    }

    getThisSoldier() {
        return this;
    }

    log(action) {
        return `${this.name} - ${action}`;
    }
}

export const soldier = new Soldier();
