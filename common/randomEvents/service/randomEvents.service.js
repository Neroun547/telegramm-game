class RandomEvents {
    constructor() {
        this.negativeEvents = [
            { cost: 200, description: `Ви перевищили швидкість, тому ви заплатили штраф у розмірі 200` },
            { cost: 500, description: `Ви попали в аварію на своїй машині, тому ви заплатили за ремонт автомобіля 500` },
            { cost: 50, description: `У вашого знайомого день народження, тому ви заплатили за подарунок 50` }
        ];
        this.positiveEvents = [
            {  cost: 200, description: `Ви продали хлам який був на дачі ! Отримайте 200` },
            {  cost: 50, description: `Ви підвезли попутника ! Отримайте 50` },
            {  cost: 500, description: `Ви виграли олімпіаду з математики ! Отримайте 500` }  
        ];
    }

    getRandomPositiveEvent() {
        const randomIndex = Math.floor(Math.random() * this.positiveEvents.length);

        return this.positiveEvents[randomIndex];
    }

    getRandomNegativeEvent() {
        const randomIndex = Math.floor(Math.random() * this.negativeEvents.length);

        return this.negativeEvents[randomIndex];
    }
}

module.exports = { RandomEvents };
