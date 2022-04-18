const { Business } = require("../Business");

class Foods extends Business {
    constructor(name, cost) {
        super("foods", cost);
        this.name = name;
        this.businessType = "foods";
        this.cost = cost;
    }
}

module.exports = { Foods };
