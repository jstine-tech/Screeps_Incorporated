class roomDepartment {
    constructor(spawn) {
        this.spawn = spawn;
        this.room = this.spawn.room;
        this.paths = {}
        this.checkController = function () {
            return this.room.controller;
        };
    }

    createPath(id, pos1, pos2) { //expects string, RoomPosition, and RoomPosition
        this.paths[id] = pos1.findPathTo(pos2);
    }

    getPath(id) {
        return this.paths[id];
    }

    run() {
        this.energyDepartment.run();
        this.transportationDepartment.run();
        //this.transportationDepartment.run();
        this.creepDepartment.run(); //creepDepartment is last, since the other department send requests for creepers to creeper manager or change existing creepers' behavior
    };
};