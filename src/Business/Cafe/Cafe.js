const { Business } = require("../Business");

class Cafe extends Business {
    constructor(name, cost) {
        super("cafe", cost);
        this.name = name;
        this.businessType = "cafe";
        this.cost = cost;
    }
}

module.exports = { Cafe };
