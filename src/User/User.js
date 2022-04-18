class User {
    constructor(username, userId) {
        this.username = username;
        this.user = userId;
        this.money = 10000;
        this.business = [];
        this.realEstate = [];
    }

    buyBusiness(business) {
        
        if(this.money < business.cost) {
            return false;
        }
        this.money -= business.cost;
        this.business.push(business);

        return true;
    }
    buyRealEstate(realEstate) {
        
        if(this.money < realEstate.cost) {
            return false;
        }
        this.money -= realEstate.cost;
        this.realEstate.push(realEstate);

        return true;
    }

    getBusiness() {
        let cost = 0;
        let str = `Ви маєте такі бізнеси: `;

        this.business.forEach((el) => {
            str += `Назва: ${el.name}. Ціна: ${el.cost}`;
            cost += el.cost;
        });

        return {
            str, cost
        }
    }

    getRealEstate() {
        let cost = 0;
        let str = `Ви маєте таку нерухомість: `;

        this.realEstate.forEach((el) => {
            str += `Назва: ${el.name}. Ціна: ${el.cost}`;
            cost += el.cost;
        });

        return {
            str, cost
        }
    }

    getPay() {
        let pay = 0;
        this.business.forEach((el) => {
            pay += el.getPay();
            this.money += el.getPay();
        });

        this.realEstate.forEach((el) => {
            pay += el.getPay();
            this.money += el.getPay();
        });

        return pay;
    }

    get allValue() {
        const valueBusiness = this.getBusiness().cost;
        const valueRealEstate = this.getRealEstate().cost;

        return {
            allValue: valueBusiness + valueRealEstate + this.money,
            username: this.username
        }; 
    }
}

module.exports = { User };
