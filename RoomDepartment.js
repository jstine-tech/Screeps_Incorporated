function RoomDepartment(spawn) {
    this.spawn = spawn;
    this.room = this.spawn.room;
    this.creepDepartment = new CreepDepartment(this.spawn, this, new CreepFactory(this.spawn));
    this.energyDepartment = new EnergyDepartment(this.spawn, this, this.room.find(FIND_SOURCES));
    this.transportationDepartment = new TransportationDepartment(this.spawn, this);
    this.checkController = function() {
        return this.room.controller;
    }

    this.run = function() {
        this.creepDepartment.run();
    }
}