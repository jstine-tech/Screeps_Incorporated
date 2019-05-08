class structureDepartment {
    constructor(spawn, room) {
        this.spawn = spawn;
        this.roomDepartment = room;
        this.controller = this.roomDepartment.checkController();
        this.firstTime = true;
    }

    addStructure(id, x, y) {
        return this.roomDepartment.addToMatrixMap(id, x, y);
    }

    initialEnergyStructure() {
        let spawny = this.spawn.pos.y;
        let spawnx = this.spawn.pos.x;
        let extensions = 60;
        let containers = 5;
        let storage = 1;
        let done = false;

        while (done === false) {
            for(let y = spawny - 1; y < spawny + (i - 2); y++)
                for(let x = spawnx - (i - 2); x <= spawnx + (i - 2); x++) {
                    if (storage > 0) {
                        if (this.addStructure('storage', x, y)) {
                            storage--;
                        }
                        continue;
                    }
                    if (containers > 0) {
                        if (this.addStructure('container', x, y)) {
                            containers--;
                        }
                        continue;
                    }
                    if (extensions > 0) {
                        if (this.addStructure('extension', x, y)) {
                            extensions--;
                        }
                        continue;
                    }
                }

            if (extensions < 1) {
                done = true;
            }
        }
    }

    run() {
        if(this.firstTime === true) {
            this.initialEnergyStructure();
            this.firstTime = false;
        }
    }
}


