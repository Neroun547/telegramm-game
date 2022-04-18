const { Business } = require("../Business");

class Restaurants extends Business {
    constructor(name, cost) {
        super("restaurants", cost);
        this.name = name;
        this.businessType = "restaurants";
        this.cost = cost;
    }
}

module.exports = { Restaurants };  
