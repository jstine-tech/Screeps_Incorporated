function CreepHarvester() {
    if(arguments[0] == true) {
        this.id = Game.getObjectById(arguments[1].spawnCreep(arguments[2], arguments[3], {memory: {role: 'harvester'}}));
    } else {
        this.id = Game.getObjectById(arguments[1]);
    }

    this.run = function() {
        //do stuff
    }
}