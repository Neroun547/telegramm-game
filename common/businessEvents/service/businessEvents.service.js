const { Cafe } = require("../../../src/Business/Cafe/Cafe");
const { Cars } = require("../../../src/Business/Cars/Cars");
const { Clothes } = require("../../../src/Business/Clothes/Clothes");
const { Electronics } = require("../../../src/Business/Electronics/Electronics");
const { Foods } = require("../../../src/Business/Foods/Foods");
const { Hotels } = require("../../../src/Business/Hotels/Hotels");
const { Restaurants } = require("../../../src/Business/Restaurants/Restaurants");
const { Workshops } = require("../../../src/Business/Workshops/Workshops");     

class BusinessEvents {
    constructor() {
        this.business = [
            new Cafe(`Кафе "У бобра"`, 2000),
            new Cafe(`Кафе "Випускний"`, 2200),
            new Cafe(`Кафе "Lviv croissant"`, 2400),

            new Cars(`Автосалон "Mazda"`, 8000),
            new Cars(`Автосалон "Volkswagen"`, 8800),
            new Cars(`Автосалон "BMW"`, 9600),

            new Clothes(`Магазин одягу "Гуси"`, 4000),
            new Clothes(`Магазин одягу "Nike"`, 4400),
            new Clothes(`Магазин одягу "Puma"`, 4800),

            new Electronics(`Магазин електроніки "Nokia"`, 6000),
            new Electronics(`Магазин електроніки "Samsung"`, 6600),
            new Electronics(`Магазин електроніки "Apple"`, 7200),

            new Foods(`Продуктовий магазин "Сільпо"`, 3600),
            new Foods(`Продуктовий магазин "АТБ"`, 4200),
            new Foods(`Продуктовий магазин "Велика кишеня"`, 3900),

            new Hotels(`Готель "Оптима"`, 6000),
            new Hotels(`Готель "Хілтон"`, 6600),
            new Hotels(`Готель "Україна"`, 7200),

            new Restaurants(`Ресторан "У Василя"`, 3000),
            new Restaurants(`Ресторан "Україна"`, 3300),
            new Restaurants(`Ресторан "Черкаський"`, 3600),

            new Workshops(`Майстерня Електроніки`, 4000),
            new Workshops(`СТО`, 4400),
            new Workshops(`Ремот побутової техніки`, 4800)
        ];
    }
    buy(businessIndex) {
        this.business.splice(businessIndex, 1);
    }
    returnBusiness(business) {
        this.business.push(business);
    }
    //Return index business in this.business 
    getRandomBusiness() {
        if(!this.business.length) {
            return false;
        }
        const businessIndex = Math.floor(Math.random() * (this.business.length - 1));

        return { 
            business: this.business[businessIndex],
            businessIndex: businessIndex
        }
    }
}

module.exports = { BusinessEvents };
