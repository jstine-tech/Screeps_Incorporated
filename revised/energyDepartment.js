class energyDepartment {
    constructor(spawn, ceo) {
        this.ceo = ceo;
        this.spawn = spawn;
        this.roomDepartment = this.ceo.roomDepartment;
        this.sources = this.roomDepartment.room.find(FIND_SOURCES);
        this.sourcesHarvested = {}; //id of creep associated with source;
    }

    getBody() {
        let body = [WORK, CARRY, MOVE];
        let energy = Math.floor(this.roomDepartment.room.energyAvailable*(2/3));
        let parts = Math.floor(energy/200);
        let toReturn = [];
        for(let i=1; i <= parts; i++) {
            toReturn = toReturn.concat(body);
        }
        return toReturn;


    }

    requestNewHarvester(source) {
        let creepID = 'harvester' + (Math.floor(Math.random() * 600000) + 1);
        this.ceo.transportationDepartment.requestRoad(this.roomDepartment.createPath(creepID + 'path', this.spawn.pos, source));
        this.roomDepartment.creepDepartment.newCreepRequest(creepID, this.getBody(), {
            memory: {
                role: 'harvester',
                source: source
            }
        });
        return creepID;
    }


    run() {
        for (let id in this.roomDepartment.creepDepartment.creeps) { //check for new creeps
            let tempCreep = Game.getObjectById(id);
            if (tempCreep.memory.role === 'harvester') {
                this.sourcesHarvested[tempCreep.id] = tempCreep.source;
                this.ceo.firstTime = false;
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

            for(let i = 0; i<this.sources.length; i++) {
                this.requestNewHarvester(this.sources[i]);
            }
        } //done

    }
};