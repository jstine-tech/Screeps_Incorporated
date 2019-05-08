class CreepDepartment {
    constructor(spawn, ceo, factory) {
        this.spawn = spawn;
        this.ceo = ceo;
        this.factory = factory;
    }


    newCreepRequest(name, type, memory)
    {
        this.factory.addCreepToQueue(name, type, memory);
    }

    inArray(name) {
        for(let id in this.creeps) {
            let classWrapper = this.creeps[id];
            if(classWrapper.creep.name == name) {
                return true; //creep found in this.creeps
            }
        }
        return false; //creep not found in this.creeps
    }

    run() {
        //ADD ROUTINE TO DELETE CREEPS FROM ARRAY THAT ARE NO LONGER THERE.
        //added down below
        for(let creep in this.creeps) {
            if(Game.getObjectById(creep) == undefined) {
                delete this.creeps[creep];
            }
        }

        //end old creep routine

        if(_.isEmpty(this.creeps) == true) { //if creeps is empty
            if(_.isEmpty(Game.creeps) !== true) { //and creeps are creeps already made in the room
                for(let name in Game.creeps) {
                    let creep = Game.creeps[name];
                    let inArray = this.inArray(name);
                    if(inArray == false && creep != null) {
                        let newCreep = this.factory.createCreep(name);
                        this.creeps[newCreep.id] = newCreep;
                    }
                }
            } else {

            }
        } else { //if there are creeps in hashmap, then run them
            for(let id in this.creeps) {
                this.creeps[id].run();
                //TODO: ADD CUSTOM EXCEPTION FOR COLLISION (collisionException) THEN HANDLE IT
            }
        }
        let result = this.factory.run(); //run factory, which will spawn creeps in queue, if any
        if(result instanceof Creeper) { //factory will return a creeper once it is spawned
            this.creeps[result.id] = result; //add returned creeper to hashmap of creeps
        }
        this.ceo.firstTime = false;
    }
}