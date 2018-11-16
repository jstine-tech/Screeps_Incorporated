function Creeper(creep) { //for new creep, expects isNew, spawn, typoe, name, and role

    this.creep = creep;
    this.id = Game.getObjectById(creep);
    this.setPath = function(path) {
        this.path = path;
    }

    this.getHP = function() {
        return this.creep.hits;
    }

    this.getHPMax = function() {
        return this.creep.hitsMax;
    }



}