function CreepFactory(spawn) {
    this.spawn = spawn;
    this.createCreep = function(name, type) {
        switch (role) {
            case 'harvester':
                return new CreepHarvester(true, name, type, this.spawn);
            case 'transporter':
                return new CreepTransporter(true, name, type, this.spawn);
            case 'builder':
                return new CreepBuilder(true, name, type, this.spawn);
        }
    }

    this.createOldCreep = function(creep) {
        switch(creep.memory.role) {
            case 'harvester':
                return new CreepHarvester(false, creep);
            case 'transporter':
                return new CreepTransporter(false, creep);
            case 'builder':
                return new CreepBuilder(false, creep);
        }
    }
}