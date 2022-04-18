const { Business } = require("../Business");

class Clothes extends Business {
    constructor(name, cost) {
        super("clothes", cost);
        this.name = name;
        this.businessType = "clothes";
        this.cost = cost;
    }
}

module.exports = { Clothes };
