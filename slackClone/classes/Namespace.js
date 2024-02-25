class Namespace{

    constructor(id,name,classes,endpoint){
        this.id = id;
        this.name = name;
        this.classes = classes;
        this.endpoint = endpoint;
        this.rooms = [];
    }

    addRoom(roomObj){
        this.rooms.push(roomObj);
    }

}

module.exports = Namespace;