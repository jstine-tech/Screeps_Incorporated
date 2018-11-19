function RoomDepartment(spawn) {
    this.spawn = spawn;
    this.room = this.spawn.room;
    this.creepDepartment = new CreepDepartment(this.spawn, this, new CreepFactory(this.spawn)); //new creepDepartment for the room
    this.energyDepartment = new EnergyDepartment(this.spawn, this, this.room.find(FIND_SOURCES)); //new energyDepartment for the room
    this.transportationDepartment = new TransportationDepartment(this.spawn, this); //new transportationDepartment for the room
    this.checkController = function() {
        return this.room.controller;
    }

    this.run = function() {
        //this.transportationDepartment.run();
        this.energyDepartment.run();
        this.transportationDepartment.run();
        this.creepDepartment.run(); //creepDepartment is last, since the other department send requests for creepers to creeper manager or change existing creepers' behavior
    }
}