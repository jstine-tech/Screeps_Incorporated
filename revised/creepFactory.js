class CreepFactory {
    constructor(spawn, ceo) {
        this.spawn = spawn;
        this.queue = [];
        this.spawning = {};
        this.ceo = ceo;
    }

    addCreepToQueue(name, type, memory) {
        this.queue.push({name: name, type: type, memory: memory});
    };

    spawnCreep(name, type, memory) {
        let status = this.spawn.spawnCreep(type, name, memory);
        if(status === 0) {
            this.spawning = this.spawn.spawning;
            return true;
        } else {
            return false;
        }
    };

    startSpawningCreep() { //expects an array, string, and string
        let creep;
        if(_.isEmpty(this.queue)!== true) { //if queue isn't empty
            creep = this.queue[0]; //attempt to spawn the latest creep (first in queue
        } else {
            return undefined;
        }
        let status = this.spawnCreep(creep.name, creep.type, creep.memory);
        if(status === true) { //if spawning successful, set this.spawning to creeper that is spawning
            this.queue.shift();
            return 'spawning';

        } else { //if creeper spawning unsuccessful, return undefined (will change later when adding error checking
            //if(this.queue.find((c) => c.name == name) != true) {
            return undefined;
            //}
        }
    };

    createCreep(name) { //creates class wrapper for creep
        let creep = Game.creeps[name];
        if(creep !== undefined) {
            switch (creep.memory.role) {
                case 'harvester':
                    let newHCreep = new Creeper(creep);
                    newHCreep.source = newHCreep.creep.memory.source;
                    newHCreep.transport = null;
                    newHCreep.requested = false;
                    newHCreep.requestedName = '';
                    newHCreep.run = function () {

                        if(!newHCreep.transport) { //check if transport has died
                            newHCreep.transport = undefined;
                            if(newHCreep.requested !== true) {
                                newHCreep.requestedName = newHCreep.ceo.transportationDepartment.requestNewTransporter(newHCreep.creep);
                                newHCreep.requested = true;
                            } else {
                                    for (let id in this.roomDepartment.creepDepartment.creeps) { //check for new creeps
                                        let tempCreep = Game.getObjectById(id);
                                        if (tempCreep.memory.role === 'transporter') {
                                            if(tempCreep.name === newHCreep.requestedName) {
                                                newHCreep.requested = false;
                                                newHCreep.requestedName = '';
                                                newHCreep.transport = tempCreep;
                                            }
                                        }
                                    }
                            }

                        }

                        if(newHCreep.creep.harvest(newHCreep.source) === ERR_NOT_IN_RANGE) {
                            newHCreep.creep.moveTo(newHCreep.source);
                        }

                        if(newHCreep.getCurCarry('energy') === newHCreep.getMaxCarry() && newHCreep.transport) { //attempt to transfer energy to transport if not dead
                            newHCreep.creep.transfer(newHCreep.transport);
                        }
                    };
                    return newHCreep;
                case 'transporter':
                    let newTCreep = new Creeper(creep, this.ceo);
                    newTCreep.harvester = creep.memory.harvester;
                    //newTCreep.pathToHarvester = this.pos.findPathTo(newTCreep.harvester);
                    newTCreep.memory.status = 'replenishingStores';
                    newTCreep.requested = false;
                    newTCreep.requestedName = '';
                    newTCreep.run = function () {
                        //check if harvester is dead
                        if(!newTCreep.transport) { //check if transport has died
                            newTCreep.transport = undefined;
                            if(newTCreep.requested !== true) {
                                newTCreep.requestedName = newTCreep.ceo.energyDepartment.requestNewHarvester(newTCreep.creep);
                                newTCreep.requested = true;
                            } else {
                                for (let id in this.roomDepartment.creepDepartment.creeps) { //check for new creeps
                                    let tempCreep = Game.getObjectById(id);
                                    if (tempCreep.memory.role === 'harvester') {
                                        if(tempCreep.name === newTCreep.requestedName) {
                                            newTCreep.requested = false;
                                            newTCreep.requestedName = '';
                                            newTCreep.harvester = tempCreep;
                                        }
                                    }
                                }
                            }

                        }

                        //update memory.status
                        if(newTCreep.memory.status === 'replenishingStores' && newTCreep.getCurCarry(RESOURCE_ENERGY) === newTCreep.getMaxCarry()) {
                            newTCreep.memory.status = 'replenished';
                        }

                        //action after memory.status is set
                        if(newTCreep.memory.status === 'replenishingStores') {
                            newTCreep.creep.moveTo(this.harvester);
                        }

                        if(newTCreep.memory.status === 'replenished') {
                            if(newTCreep.creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                                newTCreep.creep.moveTo(Game.spawns['Spawn1']);
                            }
                        }
                    };
                    return newTCreep;
                case 'builder':
                    let newBCreep = new Creeper(creep);
                    newBCreep.run = function () {
                        //do builder stuff
                    };
                    return newBCreep;
            }
        } else {
            return undefined;
        }
    };

    run(){
        if(_.isEmpty(this.spawning) === false) { //if spawning is set, there is a creeper spawning
            if(Game.creeps[this.spawning.name] !== undefined) {
                let creep = createCreep(this.spawning.name);
                this.spawning = {};
                return creep;
            } else {
                return undefined;
            }
        } else { //if spawning is not set
            let result = this.startSpawningCreep();
            //will probably do something with result in a later iteration...
        }
    };

    /*this.createOldCreep = function(creep) { //creates class wrapper for preexisting creep (runs if code is changed for example)
        switch(creep.memory.role) {
            case 'harvester':
                return new Creeper(creep);
            case 'transporter':
                return new CreepTransporter(creep);
            case 'builder':
                return new CreepBuilder(creep);
        }
    } */
};