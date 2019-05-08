class structureDepartment {
    constructor(spawn, ceo) {
        this.spawn = spawn;
        this.ceo = ceo;
    }

    addStructure(id, x, y) {
        return this.ceo.roomDepartment.addToMatrixMap(id, x, y);
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
        if(this.ceo.firstTime === true) {
            this.initialEnergyStructure();
        }
    }
}


