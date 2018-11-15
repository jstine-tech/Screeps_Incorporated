function RoomDepartment(spawn) {
    this.spawn = spawn;
    this.room = this.spawn.room;
    this.checkController = function() {
        return this.room.controller;
    }

    this.run = function() {
        //do stuff
    }
}