const { Business } = require("../Business");

class Workshops extends Business {
    constructor(name, cost) {
        super("workshops", cost);
        this.name = name;
        this.businessType = "workshops";
        this.cost = cost;
    }
}

module.exports = { Workshops };
