require('prototype.Creep')();

class CreepFactory {
    constructor(spawn, energy, transportation) {
        ////console.log('In creepFactory constructor');
        this.spawn = spawn;
        this.queue = [];
        this.spawning = {};
    }

    addCreepToQueue(name, type, memory) {
        ////console.log('In creepFactory addCreepToQueue');
        this.queue.push({name: name, type: type, memory: memory});
    };

    spawnCreep(name, type, memory) {
        ////console.log('In creepFactory spawnCreep');
        let status = this.spawn.spawnCreep(type, name, memory);
        if(status === 0) {
            //this.spawning = this.spawn;
            return true;
        } else {
            return false;
        }
    };

    startSpawningCreep() {
        ////console.log('In creepFactory startSpawningCreep');
        let creep;
        if(_.isEmpty(this.queue)!== true) { //if queue isn't empty
            creep = this.queue[0]; //attempt to spawn the latest creep (first in queue
        } else {
            return undefined;
        }
        let status = this.spawnCreep(creep.name, creep.type, creep.memory);
        if(status === true) { //if spawning successful, set this.spawning to creeper that is spawning
            console.log('Status is true');
            this.queue.shift();
            for(let name in Game.creeps) {
                let creep = Game.creeps[name];
                if(creep.spawning === true) {
                    console.log('this.spawning set to creep');
                    this.spawning = creep;
                }
            }
            return 'spawning';

        } else { //if creeper spawning unsuccessful, return undefined
            return undefined;
        }
    };

    createCreep(name) { //creates class wrapper for creep
        ////console.log('In creepFactory createCreep');
        let creep = Game.creeps[name];
        console.log(creep);
        if(creep !== undefined) {
            switch (creep.memory.role) {
                case 'harvester':

                    return 0;
                case 'transporter':
                    //creep.pathToHarvester = this.pos.findPathTo(creep.harvester);

                    return 0;
                case 'builder':


                    return 0;
                case 'repairer':

                    return 0;
                case 'controller':

                    return 0;

            }
        } else {
            return undefined;
        }
    };

    run(){
        //console.log('In creepFactory run');
        //console.log(this.queue);
        //console.log(JSON.stringify(this.queue));
        if(_.isEmpty(this.spawning) === false) { //if spawning is set, there is a creeper spawning
            console.log('First If');
            console.log('In creep creation');
            let creep = this.createCreep(this.spawning.name);
            this.spawning = {};
            return creep;

        } else { //if spawning is not set
            let result = this.startSpawningCreep();
        }
    };
}

class creepDepartment {
    constructor(spawn, factory) {
        ////console.log('In creepDepartment constructor');
        this.spawn = spawn;
        this.factory = factory;
        this.creeps = {};
        this.firstTime = true;
    }


    newCreepRequest(name, type, memory)
    {
        ////console.log('In creepDepartment newCreepRequest');
        this.factory.addCreepToQueue(name, type, memory);
    }

    inArray(name) {
        ////console.log('In creepDepartment inArray');
        for(let id in this.creeps) {
            let classWrapper = this.creeps[id];
            if(classWrapper.creep.name == name) {
                return true; //creep found in this.creeps
            }
        }
        return false; //creep not found in this.creeps
    }

    run() {
        ////console.log('In creepDepartment run');
        //added down below
        for(let creep in this.creeps) {
            if(Game.getObjectById(creep) == undefined) {
                delete this.creeps[creep];
            }
        }

        //end old creep routine

        if(_.isEmpty(this.creeps) == true) { //if creeps is empty
            if(_.isEmpty(Game.creeps) !== true) { //and creeps are creeps already made in the room
                for(let name in Game.creeps) {
                    let creep = Game.creeps[name];
                    let inArray = this.inArray(name);
                    if(inArray == false && creep != null) {
                        let newCreep = this.factory.createCreep(name);
                        this.creeps[newCreep.id] = newCreep;
                    }
                }
            } else {

            }
        } else {

        }
        let result = this.factory.run(); //run factory, which will spawn creeps in queue, if any
        ////console.log('Finished running factory');
        ////console.log(result);
        ////console.log(JSON.stringify(result));
        //console.log(JSON.stringify(this.creeps);

        this.firstTime = false;
        for(let name in Game.creeps) {
            console.log('Running creeps');
            console.log(Game.creeps[name]);
            console.log(JSON.stringify(Game.creeps[name]));
            console.log(Game.creeps[name].run());

        }

    }
}

class transportationDepartment {
    constructor(spawn, roomDepartment, creepDepartment) {
        ////console.log('In transportDepartment constructor');
        this.spawn = spawn;
        this.transportCreeps = {};
        this.roomDepartment = roomDepartment;
        this.roads = [];
        this.creepDepartment = creepDepartment;
        this.firstTime = true;
    }

    getBody() {
        ////console.log('In transportDepartment getBody');
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
        ////console.log('In transportDepartment requestNewTransporter');
        let name = 'transporter' + (Math.floor(Math.random() * 600000) + 1);
        this.creepDepartment.newCreepRequest(name, this.getBody(), {
            memory: {
                role: 'transporter',
                harvester: harvester,
                status: 'replenishingStores',
            }
        });
        return name;
    }

    requestRoad(id) {
        ////console.log('In transportDepartment requestRoad');
        ////console.log(JSON.stringify(this.roomDepartment.paths));
        let road = this.roomDepartment.paths[id];
        ////console.log(road);
        for(let i = 0; i < road.length; i++) {
            this.roomDepartment.addToMatrixMap(STRUCTURE_ROAD, road[i].x, road[i].y);
        }
        this.roads.push(id);

    }

    run() {
        ////console.log('In transportDepartment run');
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
        for (let name in Game.creeps) { //check for new creeps
            let tempCreep = Game.creeps[name];
            if (tempCreep.memory.role === 'transporter') {
                this.transportCreeps[tempCreep.id] = tempCreep;
                this.firstTime = false;
            }
        }


    }
}

class energyDepartment {
    constructor(spawn, roomDepartment, creepDep, transDep) {
        ////console.log('In energyDepartment constructor');
        this.spawn = spawn;
        this.roomDepartment = roomDepartment;
        this.sources = this.roomDepartment.room.find(FIND_SOURCES);
        this.sourcesHarvested = {}; //id of creep associated with source;
        this.firstTime = true;
        this.transportationDepartment = transDep;
        this.creepDepartment = creepDep;
        this.firstTime = true;
    }

    getBody() {
        ////console.log('In energyDepartment getBody');
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
        ////console.log('In energyDepartment requestNewHarvester');
        let creepID = 'harvester' + (Math.floor(Math.random() * 600000) + 1);
        this.transportationDepartment.requestRoad(this.roomDepartment.createPath(creepID + 'path', this.spawn.pos, source));
        this.creepDepartment.newCreepRequest(creepID, this.getBody(), {
            memory: {
                role: 'harvester',
                source: source
            }
        });
        return creepID;
    }


    run() {
        ////console.log('In energyDepartment run');
        for (let name in Game.creeps) { //check for new creeps
            let tempCreep = Game.getObjectById(Game.creeps[name].id);
            if (tempCreep.memory.role === 'harvester') {
                this.sourcesHarvested[tempCreep.id] = tempCreep.source;
                this.firstTime = false;
            }
        }

        if (_.isEmpty(this.sourcesHarvested) === false) { //if not empty
            for (let id in this.sourcesHarvested) { //get rid of any creeps that are now dead
                let creepObj = Game.getObjectById(id);
                if (!creepObj) { //if creep is dead/undefined
                    this.requestNewHarvester(this.sourcesHarvested[id]); //request new harvester
                    delete this.sourcesHarvested[id]; //delete using id as key

                }
            }
        }
        //now request creeps if firstTime
        ////console.log('Firsttime: '+this.firstTime);
        if(this.firstTime === true) {

            for(let i = 0; i<this.sources.length; i++) {
                this.requestNewHarvester(this.sources[i]);
            }
        } //done

    }
}

class roomDepartment {
    constructor(spawn) {
        ////console.log('In roomDepartment constructor');
        this.spawn = spawn;
        this.room = this.spawn.room;
        this.paths = {};
        this.rcl = 0;
        this.changed = false;
        this.checkController = function () {
            return this.room.controller.level;
        };
        this.terrain = this.room.getTerrain();
        this.mapMatrix = new Array(50);
        for(let i = 0; i < 50; i++) {
            this.mapMatrix[i] = new Array(50);
            this.mapMatrix[i].fill('x');
        }
    }

    getBody() {
        ////console.log('In energyDepartment getBody');
        let body = [WORK, CARRY, MOVE];
        let energy = Math.floor(this.room.energyAvailable*(2/3));
        let parts = Math.floor(energy/200);
        let toReturn = [];
        for(let i=1; i <= parts; i++) {
            toReturn = toReturn.concat(body);
        }
        return toReturn;


    }

    createPath(id, pos1, pos2) { //expects string, RoomPosition, and RoomPosition
        ////console.log('In roomDepartment createPath');
        this.paths[id] = pos1.findPathTo(pos2);
        ////console.log(this.paths);
        return id;
    }

    getPath(id) {
        ////console.log('In roomDepartment getPath');
        return this.paths[id];
    }

    requestControllerCreep() {
        let creepID = 'controller' + (Math.floor(Math.random() * 600000) + 1);
        this.transportationDepartment.requestRoad(this.createPath(creepID + 'path', this.spawn.pos, this.room.controller));
        this.creepDepartment.newCreepRequest(creepID, this.getBody(), {
            memory: {
                role: 'controller',
                controller: this.room.controller
            }
        });
        return creepID;
    }

    addToMatrixMap(id, x, y) {
        ////console.log('In roomDepartment addToMatrixMap');
        let isAvailable = this.terrain.get(x, y);
        if(isAvailable === 0 || isAvailable === 1) {
            if(!Number.isInteger(this.mapMatrix[y][x])) {
                this.mapMatrix[y][x] = id;
                return true;
            }
        }
        return false;
    }

    run() {
        ////console.log('In roomDepartment run');
        let oldRCL = this.rcl;
        this.rcl = this.checkController();
        if(this.rcl != oldRCL) {
            this.changed = true;
        } else {
            this.changed = false;
        }
        if(_.isEmpty(Game.creeps) !== true) { //and creeps are creeps already made in the room
            let numOfControllers = 0;
            for(let name in Game.creeps) {
                let creep = Game.creeps[name];
                if(creep.memory.role === 'controller') {
                    numOfControllers = 1;
                }
            }
            if(numOfControllers === 0) {
                this.requestControllerCreep();
            }
        } else {
            this.requestControllerCreep();
        }

        //run towers
        let towers = this.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
        });
        if(towers) {
            for(let i = 0; i<towers.length; i++) {
                let target = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (target) {
                    towers[i].attack(target);
                }
            }
        }
    }


}


class structureDepartment {
    constructor(spawn, room, creepDepartment) {
        this.spawn = spawn;
        this.roomDepartment = room;
        this.controller = this.roomDepartment.checkController();
        this.firstTime = true;
        this.creepDepartment = creepDepartment;
    }

    addStructure(id, x, y) {
        return this.roomDepartment.addToMatrixMap(id, x, y);
    }

    initialEnergyStructure() {
        let spawny = this.spawn.pos.y;
        let spawnx = this.spawn.pos.x;
        let extensions = 20;
        let containers = 5;
        let storage = 1;
        let towers = 1;
        let done = false;
        let i = 6;
        this.builderRequested = false;
        this.repairerRequested = false;

        while (done === false) {
            for(let y = spawny - (i/2); y < spawny + (i/2); y = y+2) {
                for(let x = spawnx - (i/2); x <= spawnx + (i/2); x = x + 2) {
                    if (towers > 0) {
                        if (this.addStructure(STRUCTURE_TOWER, x, y)) {
                            towers--;
                        }
                        continue;
                    }
                    if (storage > 0) {
                        if (this.addStructure(STRUCTURE_STORAGE, x, y)) {
                            storage--;
                        }
                        continue;
                    }
                    if (containers > 0) {
                        if (this.addStructure(STRUCTURE_CONTAINER, x, y)) {
                            containers--;
                        }
                        continue;
                    }
                    if (extensions > 0) {
                        if (this.addStructure(STRUCTURE_EXTENSION, x, y)) {
                            extensions--;
                        }
                        continue;
                    }
                }

                if (extensions < 1) {
                    done = true;
                }
                i = i+2;
            }
        }
    }

    getBody() {
        ////console.log('In structureDepartment getBody');
        let body = [WORK, CARRY, MOVE];
        let energy = Math.floor(this.roomDepartment.room.energyAvailable*(2/3));
        let parts = Math.floor(energy/200);
        let toReturn = [];
        for(let i=1; i <= parts; i++) {
            toReturn = toReturn.concat(body);
        }
        return toReturn;


    }
    requestBuilderCreep() {
        let creepID = 'builder' + (Math.floor(Math.random() * 600000) + 1);
        this.creepDepartment.newCreepRequest(creepID, this.getBody(), {
            memory: {
                role: 'builder',
            }
        });
        this.builderRequested = true;
        return creepID;
    }

    requestRepairerCreep() {
        let creepID = 'repairer' + (Math.floor(Math.random() * 600000) + 1);
        this.creepDepartment.newCreepRequest(creepID, this.getBody(), {
            memory: {
                role: 'repairer',
            }
        });
        this.repairerRequested = true;
        return creepID;
    }

    createConstructionSites() {
        for(let y = 0; y < this.roomDepartment.mapMatrix.length; y++) {
            for(let x = 0; x < this.roomDepartment.mapMatrix[0].length; x++) {
                let result = this.roomDepartment.room.createConstructionSite(x, y, this.roomDepartment.mapMatrix[y][x]);
                if(result === OK) {
                    this.roomDepartment.mapMatrix[y][x] = 'x';
                }
            }
        }
    }

    run() {
        let controllerLevel = this.roomDepartment.checkController();
        if(this.firstTime === true) {
            this.initialEnergyStructure();
            this.requestBuilderCreep();
            this.firstTime = false;
        }

        this.createConstructionSites();

        if(this.firstTime === false) {
            if(_.isEmpty(Game.creeps) !== true) { //and creeps are creeps already made in the room
                let numOfBuilders = 0;
                let numOfRepairers = 0;
                for(let name in Game.creeps) {
                    let creep = Game.creeps[name];
                    if(creep.memory.role === 'builder') {
                        numOfBuilders = numOfBuilders + 1;
                        this.builderRequested = false;
                    }
                    if(creep.memory.role === 'repairer') {
                        numOfRepairers = nomOfRepairers + 1;
                        this.repairerRequested = false;
                    }
                }
                if(numOfBuilders === 0) {
                    if(this.builderRequested === false) {
                        this.requestBuilderCreep();
                        this.builderRequested = true;
                    }
                }
                if(numOfRepairers === 0) {
                    if(this.repairerRequested === false) {
                        this.requestRepairerCreep();
                        this.repairerRequested = true;
                    }
                }
            } else {
                this.requestBuilderCreep();
            }
        }
    }

}

class CEO {
    constructor(spawn, roomDep, energyDep, creepDep, transportationDep, structureDep) {
        this.spawn = Game.spawns[spawn];
        this.roomDepartment = roomDep;
        this.energyDepartment = energyDep;
        this.creepDepartment = creepDep;
        this.transportationDepartment = transportationDep;
        this.structureDepartment = structureDep;
        this.firstTime = true;
    }

    run() {
        ////console.log('In CEO run');
        this.energyDepartment.run();
        this.transportationDepartment.run();
        this.creepDepartment.run();
        this.roomDepartment.run();
        this.structureDepartment.run();
    }
}
var rooms_man = new roomDepartment(Game.spawns['Spawn1']);

var creepFact = new CreepFactory(Game.spawns['Spawn1']);
var creeper = new creepDepartment(Game.spawns['Spawn1'], creepFact);
var transportation = new transportationDepartment(Game.spawns['Spawn1'],rooms_man,creeper);
var energy_man = new energyDepartment(Game.spawns['Spawn1'], rooms_man, creeper, transportation);
var structure = new structureDepartment(Game.spawns['Spawn1'], rooms_man, creeper);
transportation.energyDepartment = energy_man;
var theGame = new CEO('Spawn1', rooms_man, energy_man, creeper, transportation, structure);
creepFact.transportationDepartment = transportation;
creepFact.energyDepartment = energy_man;
rooms_man.transportationDepartment = transportation;
rooms_man.creepDepartment = creeper;

module.exports.loop = function() {

    theGame.run();
}

