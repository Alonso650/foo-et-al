class FooEtAlParameterization{
    constructor(radius){
        this.radius = radius;
    }

    // Calculation for getting the volume of a sphere
    volumeCalculation(){
        return (4/3) * Math.PI * Math.pow(this.radius, 3);
    }
}

module.exports = FooEtAlParameterization;
