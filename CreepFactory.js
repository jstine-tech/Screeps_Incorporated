function CreepFactory(spawn) {
    this.spawn = spawn;
    this.queue = [];
    this.spawning={};

    this.addCreepToQueue = function(name, type, memory) {
        this.queue.push({name: name, type: type, memory: memory});
    };

    this.spawnCreep = function(name, type, memory) {
        let status = this.spawn.spawnCreep(type, name, memory);
        if(status === 0) {
            this.spawning = this.spawn.spawning;
            return true;
        } else {
            return false;
        }
    };

    this.startSpawningCreep = function() { //expects an array, string, and string
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

    this.createCreep = function(name) { //creates class wrapper for creep
        let creep = Game.creeps[name];
        if(creep !== undefined) {
            switch (creep.memory.role) {
                case 'harvester':
                    let newHCreep = new Creeper(creep);
                    newHCreep.source = newHCreep.creep.memory.source;
                    newHCreep.transport = null;
                    newHCreep.assignTransport = function(transCreep) {
                        this.transport = transCreep;
                    }
                    newHCreep.run = function () {
                        if(this.creep.harvest(this.source) === ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(this.source);
                        }

                        if(this.getCurCarry('energy') == this.getMaxCarry()) {
                            this.creep.transfer(this.transport);
                        }
                    };
                    return newHCreep;
                case 'transporter':
                    let newTCreep = new Creeper(creep);
                    newTCreep.harvester = null;
                    newTCreep.run = function () {
                        //do transporter stuff
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

    this.run = function(){
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
}