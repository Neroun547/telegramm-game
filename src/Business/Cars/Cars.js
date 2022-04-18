const { Business } = require("../Business");

class Cars extends Business {
    constructor(name, cost) {
        super("cars", cost);
        this.name = name;
        this.businessType = "cars";
        this.cost = cost;
    }
}

module.exports = { Cars };
