const { Business } = require("../Business");

class Hotels extends Business {
    constructor(name, cost) {
        super("hotels", cost);
        this.name = name;
        this.businessType = "hotels";
        this.cost = cost;
    }
}

module.exports = { Hotels };  
