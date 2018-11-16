function CreepFactory(spawn) {
    this.spawn = spawn;
    this.queue = [];
    this.spawning={};
    this.spawnCreep = function(name, type, role) {
        let status = this.spawn.spawnCreep(type, name, {memory: {role: role}});
        if(status == 0) {
            this.spawning = this.spawn.spawning;
            return true;
        } else {
            return false;
        }
    }

    this.addCreepToQueue = function(name, type, role) {
        this.queue.push({name: name, type: type, role: role});
    }

    this.startSpawningCreep = function() { //expects an array, string, and string
        var creep;
        if(_.isEmpty(this.queue)!= true) { //if queue isn't empty
            creep = this.queue.shift(); //attempt to spawn the latest creep
        } else {
            return undefined;
        }
        let status = this.spawnCreep(creep.name, creep.type, creep.role);
        if(status == true) { //if spawning successful, set this.spawning to creeper that is spawning
            return 'spawning';

        } else { //if creeper spawning unsuccessful, add requested creeper back to queue
            //if(this.queue.find((c) => c.name == name) != true) {
            this.queue.unshift(creep);
            return undefined;
            //}
        }
    };

    this.createCreep = function(name) { //creates class wrapper for creep
        let creep = Game.creeps[name];
        switch (creep.memory.role) {
            case 'harvester':
                let newHCreep = new Creeper(creep);
                newHCreep.run = function() {
                    //do harvester stuff
                }
                return newHCreep;
            case 'transporter':
                let newTCreep = new Creeper(creep);
                newTCreep.run = function() {
                    //do transporter stuff
                }
                return newTCreep;
            case 'builder':
                let newBCreep = new Creeper(creep);
                newBCreep.run = function() {
                    //do builder stuff
                }
                return newBCreep;
        }
    }

    this.run = function(){
        if(_.isEmpty(this.spawning) == false) { //if spawning is set, there is a creeper spawning
            if(Game.creeps[this.spawning.name] != undefined) {
                return createCreep(this.spawning.name);
            } else {
                return undefined;
            }
        } else { //if spawning is not set
            let result = this.startSpawningCreep();
            //will probably do something with result in a later iteration...
        }
    }

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