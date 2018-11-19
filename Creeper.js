function Creeper(creep) { //for new creep, expects isNew, spawn, typoe, name, and role

    this.creep = creep;
    this.id = Game.getObjectById(creep);
    this.role = this.creep.role;
    this.path = null;

    this.getHP = function() {
        return this.creep.hits;
    };

    this.getHPMax = function() {
        return this.creep.hitsMax;
    };

    this.getCurCarry = function(resource) {
        if(resource === 'energy') {
            return this.creep.carry.energy;
        }

    };

    this.getMaxCarry= function() {
        return this.creep.carryCapacity;
    }



}