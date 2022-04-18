class Business {
    constructor(businessType, cost) {
        this.businessType = businessType;
        this.cost = cost;
        this.type = "business";
    }

    getPay() {
        if(this.businessType === "cafe") {
            return (this.cost * 3) / 100;
        }
        if(this.businessType === "cars") {
            return (this.cost * 8) / 100;
        }
        if(this.businessType === "clothes") {
            return (this.cost * 5) / 100;
        }
        if(this.businessType === "electronics") {
            return (this.cost * 6) / 100;
        }
        if(this.businessType === "foods") {
            return (this.cost * 5) / 100;
        }
        if(this.businessType === "hotels") {
            return (this.cost * 6) / 100;
        }
        if(this.businessType === "restaurants") {
            return (this.cost * 4) / 100;
        }
        if(this.businessType === "workshops") {
            return (this.cost * 5) / 100;
        }
    }
}

module.exports = { Business };
