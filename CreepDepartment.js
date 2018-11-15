function CreepDepartment(spawn, RoomDepartment, factory) {
    this.spawn = spawn;
    this.RoomDepartment = RoomDepartment;
    this.factory = factory;
    this.creeps = {}; //hashmap of creeps, with the id of the creep (object id) serving as the key
    this.createCreep = function(type, name, role) { //expects an array, string, and string
        let newCreep = this.factory.createCreep(type, name, role);
        let id = newCreep.id;
        this.creeps[id] = newCreep;
    };

    this.createOldCreep = function(creep) {
        let newCreep = this.factory.createOldCreep(creep);
        let id = newCreep.id;
        this.creeps[id] = newCreep;
    }

    this.run = function() {
        if(_.isEmpty(creeps) != true) { //if creeps is empty
            if(_.isEmpty(Game.creeps) != true) { //but there are creeps already made in the room
                for(let name in Game.creeps) {
                    this.createOldCreep(Game.creeps[name]);
                }
            } else {
                //if there are no creeps already made, do nothing for now...
            }
        } else { //if there are creeps in array, then run them
            for(let id in this.creeps) {
                this.creeps[id].run();
            }
        }


    };
}