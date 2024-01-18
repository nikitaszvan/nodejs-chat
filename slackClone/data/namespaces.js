const Namespace = require('../classes/Namespace');
const Room = require('../classes/Room');

const directMessagesNs = new Namespace(0,'DM','','/direct-message-ns');
const Ns1 = new Namespace(1,'Namespace1','','/namespace-1')
const Ns2 = new Namespace(2,'Namespace2','','/namespace-2')
const Ns3 = new Namespace(3,'Namespace2','','/namespace-2')

directMessagesNs.addRoom(new Room(0,'Emily Smith',0));
directMessagesNs.addRoom(new Room(1,'Joshua Johnson',0));
directMessagesNs.addRoom(new Room(2,'Sophia Davis',0));
directMessagesNs.addRoom(new Room(3,'Michael Brown',0));

Ns1.addRoom(new Room(0,'#room-1',1,true));
Ns1.addRoom(new Room(1,'#room-2',1));
Ns1.addRoom(new Room(2,'#room-3',1));

Ns2.addRoom(new Room(0,'#room-4',2));
Ns2.addRoom(new Room(1,'#room-5',2));
Ns2.addRoom(new Room(2,'#room-6',2));
Ns2.addRoom(new Room(3,'#room-7',2));

Ns3.addRoom(new Room(0,'#room-8',3))
Ns3.addRoom(new Room(1,'#room-9',3))
Ns3.addRoom(new Room(2,'#room-10',3))
Ns3.addRoom(new Room(3,'#room-11',3))

const namespaces = [directMessagesNs, Ns1,Ns2,Ns3];

module.exports = namespaces;