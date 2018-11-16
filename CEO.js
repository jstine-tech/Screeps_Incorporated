function CEO() {
    //CEO for only one room
    this.spawn = Game.spawns['Spawn1'];
    this.RoomDepartment = new RoomDepartment(this.spawn);
    this.RoomDepartment.creepDepartment = new CreepDepartment(this.spawn, this.RoomDepartment, new CreepFactory(this.spawn));
    this.RoomDepartment.run = function() {
        this.creepDepartment.run();
    }
    //this.RoomDepartment.
    //this.RoomDepartment.creepDepartment.factory.creepDepartment = this.RoomDepartment.creepDepartment;
    this.run = function() {
        this.RoomDepartment.run();
    };

}

var CEO = new CEO();