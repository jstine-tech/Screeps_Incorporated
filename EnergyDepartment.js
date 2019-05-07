function EnergyDepartment(spawn, room, energy) {
    this.roomDepartment = room;
    this.room = room.room;
    this.sources = energy;
    this.sourcesHarvested = {}; //id of creep associated with source;
    this.firstTime = true;

    this.requestNewHarvester = function (source) {
        this.roomDepartment.creepDepartment.newCreepRequest('harvester' + (Math.floor(Math.random() * 600000) + 1), [WORK, WORK, CARRY, MOVE], {
            memory: {
                role: 'harvester',
                source: source
            }
        })
    }


    this.run = function () {
        for (let id in this.roomDepartment.creepDepartment.creeps) { //check for new creeps
            let tempCreep = Game.getObjectById(id);
            if (tempCreep.memory.role === 'harvester') {
                this.sourcesHarvested[tempCreep.id] = tempCreep.source;
            }
        }

        if (_.isEmpty(this.sourcesHarvested == false)) { //if not empty
            for (let id in this.sourcesHarvested) { //get rid of any creeps that are now dead
                let creepObj = Game.getObjectById(id);
                if (!creepObj) { //if creep is dead/undefined
                    this.requestNewHarvester(this.sourcesHarvested[id]); //request new harvester
                    delete this.sourcesHarvested[id]; //delete using id as key

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
};