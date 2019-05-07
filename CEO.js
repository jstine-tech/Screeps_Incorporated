function CEO(spawn) {
    //CEO for only one room
    this.spawn = Game.spawns[spawn];
    this.RoomDepartment = new RoomDepartment(this.spawn);

    this.run = function() {
        //clear memory of dead creeps
        for(let name in Memory.creeps) {
            if(Game.creeps[name] === undefined) {
                delete Memory.creeps[name];
            }
        }
        this.RoomDepartment.run();
    };

};

var CEO = new CEO('Spawn1');
CEO.run();


//Following is old code saved just in case
//this.RoomDepartment.creepDepartment = new CreepDepartment(this.spawn, this.RoomDepartment, new CreepFactory(this.spawn));
//this.RoomDepartment.energyDepartment = new EnergyDepartment(this.spawn, this.RoomDepartment);
/*this.RoomDepartment.run = function() {
    this.creepDepartment.run();
}*/
//this.RoomDepartment.
//this.RoomDepartment.creepDepartment.factory.creepDepartment = this.RoomDepartment.creepDepartment;