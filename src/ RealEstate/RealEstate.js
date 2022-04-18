class RealEstate {
    constructor(cost) {
        this.cost = cost;
        this.type = "realEstate";
    }

    getPay() {
        return (this.cost * 1) / 100;
    }

}

module.exports = { RealEstate };  