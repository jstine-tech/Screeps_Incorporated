/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototype.Creep');
 * mod.thing == 'a thing'; // true
 */

module.exports = function() {
    Creep.prototype.run = function() {
        if(this.memory.role === 'harvester') {
            //update memory.status
            if(this.memory.status === 'replenishingStores' && this.carry.energy === this.carry.carryCapacity) {
                this.memory.status = 'replenished';
            }

            //action after memory.status is set
            if(this.memory.status === 'replenishingStores' && this.memory.transport) {
                if(this.harvest(this.source) === ERR_NOT_IN_RANGE) {
                    this.moveTo(this.source);
                }
            }


            if(this.memory.status === 'replenished' && this.carry.energy > 0) {
                let transport = this.pos.findClosestByPath(FIND_MY_CREEPS, {
                    filter: (c) => c.memory.role === 'transporter'
                });
                if(this.transport) { //attempt to transfer energy to transport if not dead
                    this.transfer(this.memory.transport);
                }
            } else {
                this.memory.status = 'replenishingStores';
            }
        }
        if(this.memory.role === 'transporter') {
            //update memory.status
            if(this.memory.status === 'replenishingStores' && this.carry.energy === this.carry.carryCapacity) {
                this.memory.status = 'replenished';
            }

            //action after memory.status is set
            if(this.memory.status === 'replenishingStores' && this.memory.harvester) {
                this.moveTo(this.memory.harvester);
            }

            if(this.memory.status === 'replenished') {
                if(this.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.moveTo(Game.spawns['Spawn1']);
                }
                if(this.carry.energy === 0) {
                    this.memory.status = 'replenishingStores';
                }
            }
        }
        if(this.memory.role === 'controller') {
            if(this.memory.status === 'replenishingStores' && this.carry.energy === this.carryCapacity) {
                this.memory.status = 'replenished';
            }

            //action after memory.status is set
            if(this.memory.status === 'replenishingStores') {
                this.moveTo(this.room.find(FIND_SOURCES)[0]);
            }

            if(this.memory.status === 'replenished') {
                if(this.transfer(this.room.controller, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.moveTo(this.room.controller);
                }
                if(this.carry.energy === 0) {
                    this.memory.status = 'replenishingStores';
                }
            }
        }
        if(this.memory.role === 'builder') {
            if(this.memory.status === 'replenishingStores' && this.carry.energy === this.carryCapacity) {
                this.memory.status = 'replenished';
            }

            //action after memory.status is set
            if(this.memory.status === 'replenishingStores') {
                this.moveTo(this.room.find(FIND_SOURCES)[0]);
            }

            if(this.memory.status === 'replenished') {
                let constructionSite = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(constructionSite) {
                    if(this.build(constructionSite) === ERR_NOT_IN_RANGE) {
                        this.moveTo(structure);
                    }
                }
                if(this.carry.energy === 0) {
                    this.memory.status = 'replenishingStores';
                }
            }
        }
        if(this.memory.role === 'repairer') {
            if(this.memory.status === 'replenishingStores' && this.carry.energy === this.carryCapacity) {
                this.memory.status = 'replenished';
            }

            //action after memory.status is set
            if(this.memory.status === 'replenishingStores') {
                this.moveTo(this.room.find(FIND_SOURCES)[0]);
            }

            if(this.memory.status === 'replenished') {
                let structure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (st) => st.hits < st.hitsMax && st.structureType != STRUCTURE_WALL
                });
                if(this.repair(structure) === ERR_NOT_IN_RANGE) {
                    this.moveTo(structure);
                }
                if(this.carry.energy === 0) {
                    this.memory.status = 'replenishingStores';
                }
            }
        }
    };
};