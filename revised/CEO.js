class CEO {
    constructor(spawn) {
        this.spawn = Game.spawns[spawn];
        this.roomDepartment = new roomDepartment(this.spawn, this);
        this.energyDepartment = new energyDepartment(this.spawn, this);
        this.creepDepartment = new creepDepartment(this.spawn, this);
        this.transportationDepartment = new transportationDepartment(this.spawn, this);
        this.firstTime = true;
    }

    run() {

        this.energyDepartment.run();
        this.transportationDepartment.run();
        this.creepDepartment.run();
        this.roomDepartment.run();
    }
}