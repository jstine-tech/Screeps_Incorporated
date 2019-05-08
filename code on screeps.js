class Creeper { //for new creep, expects isNew, spawn, typoe, name, and role
    constructor(creep, ceo) {
        console.log('In Creeper constructor');
        this.creep = creep;
        this.id = Game.getObjectById(creep);
        this.role = this.creep.role;
        this.path = null;
        this.ceo = ceo;
    }

    getHP = function() {
        console.log('In Creeper getHP');
        return this.creep.hits;
    };

    getHPMax = function() {
        console.log('In Creeper getHPMax');
        return this.creep.hitsMax;
    };

    getCurCarry = function(resource) {
        console.log('In Creeper getCurCarry');
        if(resource === 'energy') {
            return this.creep.carry.energy;
        }

    };

    getMaxCarry= function() {
        console.log('In Creeper getMaxCarry');
        return this.creep.carryCapacity;
    }



};

class CreepFactory {
    constructor(spawn) {
        console.log('In creepFactory constructor');
        this.spawn = spawn;
        this.queue = [];
        this.spawning = {};
    }

    addCreepToQueue(name, type, memory) {
        console.log('In creepFactory addCreepToQueue');
        this.queue.push({name: name, type: type, memory: memory});
    };

    spawnCreep(name, type, memory) {
        console.log('In creepFactory spawnCreep');
        let status = this.spawn.spawnCreep(type, name, memory);
        if(status === 0) {
            this.spawning = this.spawn.spawning;
            return true;
        } else {
            return false;
        }
    };

    startSpawningCreep() {
        console.log('In creepFactory startSpawningCreep');
        let creep;
        if(_.isEmpty(this.queue)!== true) { //if queue isn't empty
            creep = this.queue[0]; //attempt to spawn the latest creep (first in queue
        } else {
            return undefined;
        }
        let status = this.spawnCreep(creep.name, creep.type, creep.memory);
        if(status === true) { //if spawning successful, set this.spawning to creeper that is spawning
            this.queue.shift();
            return 'spawning';

        } else { //if creeper spawning unsuccessful, return undefined
            return undefined;
        }
    };

    createCreep(name) { //creates class wrapper for creep
        console.log('In creepFactory createCreep');
        let creep = Game.creeps[name];
        if(creep !== undefined) {
            switch (creep.memory.role) {
                case 'harvester':
                    let newHCreep = new Creeper(creep, this.ceo);
                    newHCreep.source = newHCreep.creep.memory.source;
                    newHCreep.transport = null;
                    newHCreep.requested = false;
                    newHCreep.requestedName = '';
                    newHCreep.run = function() {

                        if(!newHCreep.transport) { //check if transport has died
                            newHCreep.transport = undefined;
                            if(newHCreep.requested !== true) {
                                newHCreep.requestedName = newHCreep.ceo.transportationDepartment.requestNewTransporter(newHCreep.creep);
                                newHCreep.requested = true;
                            } else {
                                for (let id in this.ceo.creepDepartment.creeps) { //check for new creeps
                                    let tempCreep = Game.getObjectById(id);
                                    if (tempCreep.memory.role === 'transporter') {
                                        if(tempCreep.name === newHCreep.requestedName) {
                                            newHCreep.requested = false;
                                            newHCreep.requestedName = '';
                                            newHCreep.transport = tempCreep;
                                        }
                                    }
                                }
                            }

                        }

                        if(newHCreep.creep.harvest(newHCreep.source) === ERR_NOT_IN_RANGE) {
                            newHCreep.creep.moveTo(newHCreep.source);
                        }

                        if(newHCreep.getCurCarry('energy') === newHCreep.getMaxCarry() && newHCreep.transport) { //attempt to transfer energy to transport if not dead
                            newHCreep.creep.transfer(newHCreep.transport);
                        }
                    };
                    return newHCreep;
                case 'transporter':
                    let newTCreep = new Creeper(creep, this.ceo);
                    newTCreep.harvester = creep.memory.harvester;
                    //newTCreep.pathToHarvester = this.pos.findPathTo(newTCreep.harvester);
                    newTCreep.memory.status = 'replenishingStores';
                    newTCreep.requested = false;
                    newTCreep.requestedName = '';
                    newTCreep.run = function() {
                        //check if harvester is dead
                        if(!newTCreep.harvester) { //check if transport has died
                            newTCreep.harvester = undefined;
                            if(newTCreep.requested !== true) {
                                newTCreep.requestedName = newTCreep.ceo.energyDepartment.requestNewHarvester(newTCreep.creep);
                                newTCreep.requested = true;
                            } else {
                                for (let id in this.ceo.creepDepartment.creeps) { //check for new creeps
                                    let tempCreep = Game.getObjectById(id);
                                    if (tempCreep.memory.role === 'harvester') {
                                        if(tempCreep.name === newTCreep.requestedName) {
                                            newTCreep.requested = false;
                                            newTCreep.requestedName = '';
                                            newTCreep.harvester = tempCreep;
                                        }
                                    }
                                }
                            }

                        }

                        //update memory.status
                        if(newTCreep.creep.memory.status === 'replenishingStores' && newTCreep.getCurCarry(RESOURCE_ENERGY) === newTCreep.getMaxCarry()) {
                            newTCreep.creep.memory.status = 'replenished';
                        }

                        //action after memory.status is set
                        if(newTCreep.creep.memory.status === 'replenishingStores' && newTCreep.transport) {
                            newTCreep.creep.moveTo(newTCreep.memory.harvester);
                        }

                        if(newTCreep.creep.memory.status === 'replenished') {
                            if(newTCreep.creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                                newTCreep.creep.moveTo(Game.spawns['Spawn1']);
                            }
                            if(newTCreep.getCurCarry(RESOURCE_ENERGY) === 0) {
                                newTCreep.creep.memory.status = 'replenishingStores';
                            }
                        }
                    };
                    return newTCreep;
                case 'builder':
                    let newBCreep = new Creeper(creep);
                    newBCreep.creep.memory.status = 'replenishingStores';
                    newBCreep.run = function() {
                        //update memory.status
                        if(newRCreep.creep.memory.status === 'replenishingStores' && newTCreep.getCurCarry(RESOURCE_ENERGY) === newRCreep.getMaxCarry()) {
                            newRCreep.creep.memory.status = 'replenished';
                        }

                        //action after memory.status is set
                        if(newRCreep.creep.memory.status === 'replenishingStores') {
                            newRCreep.creep.moveTo(newRCreep.creep.room.find(FIND_SOURCES)[0]);
                        }

                        if(newRCreep.memory.status === 'replenished') {
                            let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                            if(constructionSite) {
                                if(newRCreep.creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                                    newRCreep.creep.moveTo(structure);
                                }
                            }
                            if(newRCreep.getCurCarry(RESOURCE_ENERGY) === 0) {
                                newRCreep.creep.memory.status = 'replenishingStores';
                            }
                        }
                    };
                    return newBCreep;
                case 'repairer':
                    let newRCreep = new Creeper(creep);
                    newrCreep.creep.memory.status = 'replenishingStores';
                    newRCreep.run = function() {
                        //update memory.status
                        if(newRCreep.creep.memory.status === 'replenishingStores' && newRCreep.getCurCarry(RESOURCE_ENERGY) === newRCreep.getMaxCarry()) {
                            newRCreep.creep.memory.status = 'replenished';
                        }

                        //action after memory.status is set
                        if(newRCreep.creep.memory.status === 'replenishingStores') {
                            newRCreep.creep.moveTo(newRCreep.creep.room.find(FIND_SOURCES)[0]);
                        }

                        if(newRCreep.memory.status === 'replenished') {
                            let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
                            });
                            if(newRCreep.creep.repair(structure) === ERR_NOT_IN_RANGE) {
                                newRCreep.creep.moveTo(structure);
                            }
                            if(newRCreep.getCurCarry(RESOURCE_ENERGY) === 0) {
                                newRCreep.creep.memory.status = 'replenishingStores';
                            }
                        }
                    };
                    return newRCreep;
                case 'controller':
                    let newCCreep = new Creeper(creep);
                    let controller = creep.memory.controller;
                    newCCreep.creep.memory.status = 'replenishingStores';
                    newCCreep.run = function() {
                        //update memory.status
                        if(newCCreep.creep.memory.status === 'replenishingStores' && newTCreep.getCurCarry(RESOURCE_ENERGY) === newCCreep.getMaxCarry()) {
                            newCCreep.creep.memory.status = 'replenished';
                        }

                        //action after memory.status is set
                        if(newCCreep.creep.memory.status === 'replenishingStores') {
                            newCCreep.creep.moveTo(newTCreep.creep.room.find(FIND_SOURCES)[0]);
                        }

                        if(newCCreep.memory.status === 'replenished') {
                            if(newCCreep.creep.transfer(newTCreep.creep.room.controller, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                                newCCreep.creep.moveTo(newTCreep.creep.room.controller);
                            }
                            if(newCCreep.getCurCarry(RESOURCE_ENERGY) === 0) {
                                newCCreep.creep.memory.status = 'replenishingStores';
                            }
                        }
                    };
                    return newCCreep;

            }
        } else {
            return undefined;
        }
    };

    run(){
        console.log('In creepFactory run');
        console.log(this.queue);
        if(_.isEmpty(this.spawning) === false) { //if spawning is set, there is a creeper spawning
            if(Game.creeps[this.spawning.name] !== undefined) {
                let creep = createCreep(this.spawning.name);
                this.spawning = {};
                return creep;
            } else {
                return undefined;
            }
        } else { //if spawning is not set
            let result = this.startSpawningCreep();
            //will probably do something with result in a later iteration...
        }
    };
};

class creepDepartment {
    constructor(spawn, factory) {
        console.log('In creepDepartment constructor');
        this.spawn = spawn;
        this.factory = factory;
        this.creeps = {};
        this.firstTime = true;
    }


    newCreepRequest(name, type, memory)
    {
        console.log('In creepDepartment newCreepRequest');
        this.factory.addCreepToQueue(name, type, memory);
    }

    inArray(name) {
        console.log('In creepDepartment inArray');
        for(let id in this.creeps) {
            let classWrapper = this.creeps[id];
            if(classWrapper.creep.name == name) {
                return true; //creep found in this.creeps
            }
        }
        return false; //creep not found in this.creeps
    }

    run() {
        console.log('In creepDepartment run');
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
        } else { //if there are creeps in object, then run them
            for(let id in this.creeps) {
                this.creeps[id].run();

            }
        }
        let result = this.factory.run(); //run factory, which will spawn creeps in queue, if any
        if(result instanceof Creeper) { //factory will return a creeper once it is spawned
            this.creeps[result.id] = result; //add returned creeper to hashmap of creeps
        }
        this.firstTime = false;
    }
}

class transportationDepartment {
    constructor(spawn, roomDepartment, creepDepartment) {
        console.log('In transportDepartment constructor');
        this.spawn = spawn;
        this.transportCreeps = {};
        this.roomDepartment = roomDepartment;
        this.roads = [];
        this.creepDepartment = creepDepartment;
        this.firstTime = true;
    }

    getBody() {
        console.log('In transportDepartment getBody');
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
        console.log('In transportDepartment requestNewTransporter');
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
        console.log('In transportDepartment requestRoad');
        console.log(JSON.stringify(this.roomDepartment.paths));
        let road = this.roomDepartment.paths[id];
        console.log(road);
        for(let i = 0; i < road.length; i++) {
            this.roomDepartment.addToMatrixMap(STRUCTURE_ROAD, road[i].x, road[i].y);
        }
        this.roads.push(id);

    }

    run() {
        console.log('In transportDepartment run');
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
        console.log('In energyDepartment constructor');
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
        console.log('In energyDepartment getBody');
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
        console.log('In energyDepartment requestNewHarvester');
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
        console.log('In energyDepartment run');
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
        console.log('Firsttime: '+this.firstTime);
        if(this.firstTime === true) {

            for(let i = 0; i<this.sources.length; i++) {
                this.requestNewHarvester(this.sources[i]);
            }
        } //done

    }
}

class roomDepartment {
    constructor(spawn) {
        console.log('In roomDepartment constructor');
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
        console.log('In energyDepartment getBody');
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
        console.log('In roomDepartment createPath');
        this.paths[id] = pos1.findPathTo(pos2);
        console.log(this.paths);
        return id;
    }

    getPath(id) {
        console.log('In roomDepartment getPath');
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
        console.log('In roomDepartment addToMatrixMap');
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
        console.log('In roomDepartment run');
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
        console.log('In structureDepartment getBody');
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
        return creepID;
    }

    requestRepairerCreep() {
        let creepID = 'repairer' + (Math.floor(Math.random() * 600000) + 1);
        this.creepDepartment.newCreepRequest(creepID, this.getBody(), {
            memory: {
                role: 'repairer',
            }
        });
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

        if(this.roomDepartment.changed === true) {
            this.createConstructionSites();
        }
        if(this.firstTime === false) {
            if(_.isEmpty(Game.creeps) !== true) { //and creeps are creeps already made in the room
                let numOfBuilders = 0;
                let numOfRepairers = 0;
                for(let name in Game.creeps) {
                    let creep = Game.creeps[name];
                    if(creep.memory.role === 'builder') {
                        numOfBuilders = numOfBuilders + 1;
                    }
                    if(creep.memory.role === 'repairer') {
                        numOfRepairers = nomOfRepairers + 1;
                    }
                }
                if(numOfBuilders === 0) {
                    this.requestBuilderCreep();
                }
                if(numOfRepairers === 0) {
                    this.requestRepairerCreep();
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
        console.log('In CEO run');
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
creepFact.ceo = theGame;
rooms_man.transportationDepartment = transportation;
rooms_man.creepDepartment = creeper;
module.exports.loop = function() {
    theGame.run();
}

