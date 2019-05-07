class energyDepartment {
    constructor(spawn, ceo) {
        this.ceo = ceo;
        this.spawn = spawn;
        this.roomDepartment = this.ceo.roomDepartment;
        this.sources = this.roomDepartment.room.find(FIND_SOURCES);
        this.sourcesHarvested = {}; //id of creep associated with source;
        this.firstTime = true;
    }

    requestNewHarvester(source) {
        let creepID = 'harvester' + (Math.floor(Math.random() * 600000) + 1);
        this.ceo.transportationDepartment.requestRoad(this.roomDepartment.createPath(creepID + 'path', this.spawn.pos, source);)
        this.roomDepartment.creepDepartment.newCreepRequest(creepID, [WORK, WORK, CARRY, MOVE], {
            memory: {
                role: 'harvester',
                source: source
            }
        })
    }


    run() {
        for (let id in this.roomDepartment.creepDepartment.creeps) { //check for new creeps
            let tempCreep = Game.getObjectById(id);
            if (tempCreep.memory.role === 'harvester') {
                this.sourcesHarvested[tempCreep.id] = tempCreep.source;
                this.firstTime = false;
            }
        }

        if (_.isEmpty(this.sourcesHarvested) == false) { //if not empty
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