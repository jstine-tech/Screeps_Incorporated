function CEO() {
    //CEO for only one room
    this.spawn = Game.spawns['Spawn1'];
    this.RoomDepartment = new RoomDepartment(this.spawn);
    this.RoomDepartment.creepDepartment = new CreepDepartment(this.spawn, this.RoomDepartment, new CreepFactory(this.spawn));
    this.RoomDepartment.
    //this.RoomDepartment.creepDepartment.factory.creepDepartment = this.RoomDepartment.creepDepartment;
    this.run = function() {
        //do stuff
    };

}

var CEO = new CEO();