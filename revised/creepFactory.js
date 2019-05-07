class CreepFactory {
    constructor(spawn) {
        this.spawn = spawn;
        this.queue = [];
        this.spawning = {};
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
                    newHCreep.run = function () {

                        if(!this.transport) { //check if transport has died
                            this.transport = null;
                        }

                        if(this.creep.harvest(this.source) === ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(this.source);
                        }

                        if(this.getCurCarry('energy') === this.getMaxCarry() && this.transport) { //attempt to transfer energy to transport if not dead
                            this.creep.transfer(this.transport);
                        }
                    };
                    return newHCreep;
                case 'transporter':
                    let newTCreep = new Creeper(creep);
                    newTCreep.harvester = creep.memory.harvester;
                    this.pathToHarvester = this.pos.findPathTo(newTCreep.harvester, {ignoreCreeps: true});
                    this.memory.status = 'replenishingStores';
                    newTCreep.run = function () {
                        //update memory.status
                        if(this.memory.status === 'replenishingStores' && this.getCurCarry(RESOURCE_ENERGY) < this.getMaxCarry()) {
                            this.memory.status = 'replenished';
                        }

                        //action after memory.status is set
                        if(this.memory.status === 'replenishingStores') {
                            this.creep.moveTo(this.harvester);
                        }

                        if(this.memory.status === 'replenished') {
                            if(this.creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                this.creep.moveTo(Game.spawns['Spawn1']);
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