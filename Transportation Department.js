var TransportationDepartment = function(spawn, roomDepartment) {
    this.spawn = spawn;
    this.roomDepartment = roomDepartment;
    this.room = roomDepartment.room;
    this.transportCreeps = {};

    this.requestNewTransporter = function (harvester) {
        this.roomDepartment.creepDepartment.newCreepRequest('transporter' + (Math.floor(Math.random() * 600000) + 1), [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], {
            memory: {
                role: 'transporter',
                harvester: harvester,
                status: 'replenishingStores'
            }
        })
    }

    function run() {

        //following checks for dead creeps
        if (_.isEmpty(this.transportCreeps == false)) { //if not empty
            for (let creep of this.transportCreeps) { //get rid of any creeps that are now dead
                let creepObj = Game.getObjectById(creep[0]);
                if (!creepObj) { //if creep is dead/undefined
                    this.requestNewTransporter(creepObj.harvester); //request new harvester
                    delete this.transportCreeps[creep[0]]; //delete using id as key

                }
            }
        }


        //following checks to see if a transport is assigned to a harvester
        for(let creep of this.roomDepartment.energyDepartment.sourcesHarvested) {
            let creepClassWrapper = this.roomDepartment.creepDepartment.creeps[creep];
            if(creepClassWrapper.transport == null) {

            }
        }
    }
}