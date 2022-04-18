const { RealEstate } = require("../RealEstate");

class Home extends RealEstate {
    constructor(cost, name) {
        super(cost);
        this.name = name;
    }
}

module.exports = { Home };
