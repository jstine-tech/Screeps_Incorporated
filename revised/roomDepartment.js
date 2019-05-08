class roomDepartment {
    constructor(spawn, ceo) {
        this.ceo = ceo;
        this.spawn = spawn;
        this.room = this.spawn.room;
        this.paths = {};
        this.rcl = 0;
        this.checkController = function () {
            return this.room.controller;
        };
        this.terrain = this.room.getTerrain();
        this.mapMatrix = new Array(50);
        for(let i = 0; i < 50; i++) {
            this.mapMatrix[i] = new Array(50);
            this.mapMatrix[i].fill('x');
        }
    }

    createPath(id, pos1, pos2) { //expects string, RoomPosition, and RoomPosition
        this.paths[id] = pos1.findPathTo(pos2);
        return id;
    }

    getPath(id) {
        return this.paths[id];
    }

    addToMatrixMap(id, x, y) {
        let isAvailable = this.terrain.get(x, y);
        if(isAvailable === 0 || isAvailable === 1) {
            if(this.mapMatrix[y][x] != 'x') {
                this.mapMatrix[y][x] = id;
                return true;
            }
        }
        return false;
    }

    run() {
            this.rcl = this.checkController
    };
}