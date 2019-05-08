class transportationDepartment {
    constructor(spawn, ceo) {
        this.spawn = spawn;
        this.ceo = ceo;
        this.transportCreeps = {};
        this.roomDepartment = this.ceo.roomDepartment;
        this.roads = [];
    }

    getBody() {
        let body = [CARRY, MOVE];
        let energy = Math.floor(this.roomDepartment.room.energyAvailable*(1/3));
        let parts = Math.floor(energy/100);
        let toReturn = [];
        for(let i=1; i <= parts; i++) {
            toReturn = toReturn.concat(body);
        }
        return toReturn;


    }

    requestNewTransporter(harvester) {
        let name = 'transporter' + (Math.floor(Math.random() * 600000) + 1);
        this.ceo.creepDepartment.newCreepRequest(name, this.getBody(), {
            memory: {
                role: 'transporter',
                harvester: harvester,
                status: 'replenishingStores',
            }
        });
        return name;
    }

    requestRoad(id) {
        let road = this.roomDepartment.getPath(id);
        for(let i = 0; i < road.length; i++) {
            this.roomDepartment.addToMatrixMap('road', road[i].x, road[i].y);
        }
        this.roads.append(id);

    }

    run() {

        //following checks for dead creeps
        if (_.isEmpty(this.transportCreeps == false)) { //if not empty
            for (let id in this.transportCreeps) { //get rid of any creeps that are now dead
                let creepObj = Game.getObjectById(id);
                if (!creepObj) { //if creep is dead/undefined
                    //this.requestNewTransporter(creepObj.transporter); //request new harvester
                    delete this.transportCreeps[id]; //delete using id as key

                }
            }
        }
        for (let id in this.roomDepartment.creepDepartment.creeps) { //check for new creeps
            let tempCreep = Game.getObjectById(id);
            if (tempCreep.memory.role === 'transporter') {
                this.transportCreeps[tempCreep.id] = tempCreep;
                this.ceo.firstTime = false;
            }
        }

        //following checks to see if a transport is assigned to a harvester
        for(let id in this.ceo.energyDepartment.sourcesHarvested) {
            let creepClassWrapper = this.ceo.creepDepartment.creeps[id];
            if(creepClassWrapper.transport == null) {
                this.requestNewTransporter(Game.getObjectById(id)); //now memory.harvester equals the harvester creep itself.
            }
        }
    }
};