class transportationDepartment {
    constructor(spawn, roomDepartment) {
        this.spawn = spawn;
        this.roomDepartment = roomDepartment;
        this.room = roomDepartment.room;
        this.transportCreeps = {};
    }

    requestNewTransporter(harvester) {
        this.roomDepartment.creepDepartment.newCreepRequest('transporter' + (Math.floor(Math.random() * 600000) + 1), [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], {
            memory: {
                role: 'transporter',
                harvester: harvester,
                status: 'replenishingStores'
            }
        })
    }

    run() {

        //following checks for dead creeps
        if (_.isEmpty(this.transportCreeps == false)) { //if not empty
            for (let id in this.transportCreeps) { //get rid of any creeps that are now dead
                let creepObj = Game.getObjectById(id);
                if (!creepObj) { //if creep is dead/undefined
                    this.requestNewTransporter(creepObj.harvester); //request new harvester
                    delete this.transportCreeps[id]; //delete using id as key

                }
            }
        }
        //TODO: ADD ROUTINE TO ADD NEWLY SPAWNED TRANSPORTERS TO THIS.TRANSPORTCREEPS

        //following checks to see if a transport is assigned to a harvester
        for(let id in this.roomDepartment.energyDepartment.sourcesHarvested) {
            let creepClassWrapper = this.roomDepartment.creepDepartment.creeps[id];
            if(creepClassWrapper.transport == null) {
                this.requestNewTransporter(Game.getObjectById(id)); //now memory.harvester equals the harvester creep itself.
            }
        }
    }
};