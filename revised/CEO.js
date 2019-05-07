class CEO {
    constructor(spawn) {
        this.spawn = Game.spawns[spawn];
        this.roomDepartment = new roomDepartment(this.spawn, this);
        this.energyDepartment = new energyDepartment(this.spawn, this);
        this.creepDepartment = new creepDepartment(this.spawn, this);
        this.transportationDepartment = new transportationDepartment(this.spawn, this);
    }

    run() {
        this.roomDepartment.run();
        this.energyDepartment.run();
        this.transportationDepartment.run();
        this.creepDepartment.run(); //creepDepartment is last, since the other department send requests for creepers to creeper manager or change existing creepers' behavior
    }
}