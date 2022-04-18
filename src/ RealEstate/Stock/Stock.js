const { RealEstate } = require("../RealEstate");

class Stock extends RealEstate {
    constructor(cost, name) {
        super(cost);
        this.name = name;
    }
}

module.exports = { Stock };
