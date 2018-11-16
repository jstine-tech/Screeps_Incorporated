function EnergyDepartment(spawn, room, energy) {
    this.room = room.room;
    this.sources = energy;
    this.sourcesHarvested = {};
    this.firstTime = true;

    this.requestNewHarvester = function (source) {
        this.room.creepDepartment.newCreepRequest('harvester' + (Math.floor(Math.random() * 600000) + 1), [WORK, WORK, CARRY, MOVE], {
            memory: {
                role: 'harvester',
                source: source
            }
        })
    }


    this.run = function () {
        for (let creep of this.room.creepDepartment.creeps) { //check for new creeps
            if (creep[1].role === 'harvester') {
                this.sourcesHarvested[creep[1].id] = creep[1].source;
            }
        }

        if (_.isEmpty(this.sourcesHarvested == false)) { //if not empty
            for (let creep of this.sourcesHarvested) { //get rid of any creeps that are now dead
                let creepObj = Game.getObjectById(creep[0]);
                if (!creepObj) { //if creep is dead/undefined
                    this.requestNewHarvester(creep[1]); //request new harvester
                    delete this.sourcesHarvested[creep[0]]; //delete using id as key

                }
            }
        }
        //now request creeps if firstTime
        if(this.firstTime == true) {
            this.firstTime = false;
            for(let i = 0; i<this.sources.length; i++) {
                this.requestNewHarvester(this.sources[i]);
            }
        } //done

    }
}