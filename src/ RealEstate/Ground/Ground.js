const { RealEstate } = require("../RealEstate");

class Ground extends RealEstate {
    constructor(cost, name) {
        super(cost);
        this.name = name;
    }
}

module.exports = { Ground };
