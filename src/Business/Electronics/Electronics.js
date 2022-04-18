const { Business } = require("../Business");

class Electronics extends Business {
    constructor(name, cost) {
        super("electronics", cost);
        this.name = name;
        this.businessType = "electronics";
        this.cost = cost;
    }
}

module.exports = { Electronics };
