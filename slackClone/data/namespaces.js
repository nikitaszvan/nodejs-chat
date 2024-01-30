const Namespace = require('../classes/Namespace');
const Room = require('../classes/Room');
//returns HTML that will look good in the DOM for messages
const retrieveTableInfo = require('./getroomHistory.js'); // Replace with the actual filename
let test;

async function main(tableName) {
    let data; // Declare data outside the try block
  
    try {
      data = await retrieveTableInfo(tableName);
      // Do something with the exported data
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
    } 
  
     // Return data outside the finally block
  }

  

// Map through each item and log individual data
    


const directMessagesNs = new Namespace(0, 'DM', '', '/direct-message-ns');
const Ns1 = new Namespace(1, 'Namespace1', './img/charizard.png', '/namespace-1')
const Ns2 = new Namespace(2, 'Namespace2', './img/pikachu.png', '/namespace-2')
const Ns3 = new Namespace(3, 'Namespace3', './img/squirtle.png', '/namespace-3')

// {namespace: Ns1, selectedNsId: 1, tableName: 'public."room3 chat history"', roomId: 2, roomName: '#room-3'},
// {namespace: Ns2, selectedNsId: 2, tableName: 'public."room4 chat history"', roomId: 0, roomName: '#room-4'},
// {namespace: Ns2, selectedNsId: 2, tableName: 'public."room5 chat history"', roomId: 1, roomName: '#room-5'},
// {namespace: Ns2, selectedNsId: 2, tableName: 'public."room6 chat history"', roomId: 2, roomName: '#room-6'},
// {namespace: Ns2, selectedNsId: 2, tableName: 'public."room7 chat history"', roomId: 3, roomName: '#room-7'},
// {namespace: Ns2, selectedNsId: 2, tableName: 'public."room8 chat history"', roomId: 0, roomName: '#room-8'},
// {namespace: Ns3, selectedNsId: 3, tableName: 'public."room9 chat history"', roomId: 1, roomName: '#room-9'},
// {namespace: Ns3, selectedNsId: 3, tableName: 'public."room10 chat history"', roomId: 2, roomName: '#room-10'},
// {namespace: Ns3, selectedNsId: 3, tableName: 'public."room11 chat history"', roomId: 3, roomName: '#room-11'}

const tableNames = [{namespace: Ns1, selectedNsId: 1, tableName: 'public."room1 chat history"', roomId: 0, roomName: '#room-1'},
                    {namespace: Ns1, selectedNsId: 1, tableName: 'public."room2 chat history"', roomId: 1, roomName: '#room-2'},
                    {namespace: Ns1, selectedNsId: 1, tableName: 'public."room3 chat history"', roomId: 2, roomName: '#room-3'},
                    {namespace: Ns2, selectedNsId: 2, tableName: 'public."room4 chat history"', roomId: 0, roomName: '#room-4'},
                  ];

async function getData(table) {
  try {
    (table.namespace).addRoom(new Room(table.roomId, table.roomName, table.selectedNsId, await main(table.tableName)));
  }
  catch (error) {
    console.error(error);
  }
};


tableNames.map(item => {
  getData(item);
});


directMessagesNs.addRoom(new Room(0, 'Emily Smith', 0));
directMessagesNs.addRoom(new Room(1, 'Joshua Johnson', 0));
directMessagesNs.addRoom(new Room(2, 'Sophia Davis', 0));
directMessagesNs.addRoom(new Room(3, 'Michael Brown', 0));
directMessagesNs.addRoom(new Room(4, 'George Blake', 0));


// Ns1.addRoom(new Room(0, '#room-1', 1, main(tableNames[0])));
// Ns1.addRoom(new Room(1, '#room-2', 1));
// Ns1.addRoom(new Room(2, '#room-3', 1));

// Ns2.addRoom(new Room(0, '#room-4', 2));
// Ns2.addRoom(new Room(1, '#room-5', 2));
// Ns2.addRoom(new Room(2, '#room-6', 2));
// Ns2.addRoom(new Room(3, '#room-7', 2));

// Ns3.addRoom(new Room(0, '#room-8', 3))
// Ns3.addRoom(new Room(1, '#room-9', 3))
// Ns3.addRoom(new Room(2, '#room-10', 3))
// Ns3.addRoom(new Room(3, '#room-11', 3))

const namespaces = [directMessagesNs, Ns1, Ns2, Ns3];

module.exports = namespaces;