const { Ground } = require("../../../src/ RealEstate/Ground/Ground");
const { Home } = require("../../../src/ RealEstate/Home/Home"); 
const { Stock } = require("../../../src/ RealEstate/Stock/Stock");  

class RealEstateEvents { 
    constructor() {
        this.realEstate = [
            new Ground(1000, "Ділянка в селі"),
            new Ground(1500, "Ділянка з приватним будинком"),
            new Ground(2000, "Ділянка ділянка з складом"),

            new Home(3000, "Квартира в Черкасах"),
            new Home(4500, "Квартира у Львові"),
            new Home(6000, "Квартира в Києві"),

            new Stock(2000, "Склад у селі"),
            new Stock(3000, "Склад у малому місті"),
            new Stock(4000, "Склад у великому місті")
        ];
    }

    buy(realEstateIndex) {
        this.realEstate.splice(realEstateIndex, 1);
    }

    returnRealEstate(realEstate) {
        this.realEstate.push(realEstate);
    }
    
    getRandomRealEstate() {
        const indexRealEstate = Math.floor(Math.random() * (this.realEstate.length - 1));

        return {
            indexRealEstate: indexRealEstate,
            realEstate: this.realEstate[indexRealEstate]
        };
    }
} 

module.exports = { RealEstateEvents };
