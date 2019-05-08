class Creeper { //for new creep, expects isNew, spawn, typoe, name, and role
    constructor(creep) {
        this.creep = creep;
        this.id = Game.getObjectById(creep);
        this.role = this.creep.role;
        this.path = null;
    }

    getHP = function() {
        return this.creep.hits;
    };

    getHPMax = function() {
        return this.creep.hitsMax;
    };

    getCurCarry = function(resource) {
        if(resource === 'energy') {
            return this.creep.carry.energy;
        }

    };

    getMaxCarry= function() {
        return this.creep.carryCapacity;
    }



};