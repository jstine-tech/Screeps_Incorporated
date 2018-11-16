function CreepDepartment(spawn, RoomDepartment, factory) {
    this.spawn = spawn;
    this.RoomDepartment = RoomDepartment;
    this.factory = factory;
    this.creeps = {}; //hashmap of creeps, with the id of the creep (object id) serving as the key


    this.newCreepRequest = function(name, type, role)
    {
        this.factory.addCreepToQueue(name, type, role);
    }

    this.run = function() {
        if(_.isEmpty(creeps) != true) { //if creeps is not empty
            if(_.isEmpty(Game.creeps) != true) { //and creeps are creeps already made in the room
                for(let name in Game.creeps) {
                    let newCreep = this.factory.createCreep(creep);
                    this.creeps.push({newCreep.id: newCreep});
                }
            } else {
                //if there are no creeps in game but creeps is not empty (will this ever happen?
                console.log('In CreepDepartment if there are no creeps in game but this.creeps is not empty. Oops!!!');

                }
            } else { //if there are creeps in array, then run them
                for(let id in this.creeps) {
                    this.creeps[id].run();
                }
        }
        var result = this.factory.run();
        if(result instanceof Creeper) {
            this.creeps.push(result.id, result);
        }
    };
}