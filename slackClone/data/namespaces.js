const Namespace = require('../classes/Namespace');
const Room = require('../classes/Room');
const retrieveTableInfo = require('./getroomHistory.js');
let test;

async function main(tableName) {
    let data;
  
    try {
      data = await retrieveTableInfo(tableName);;
      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
    } 
  ;
  }
  ;
    


const directMessagesNs = new Namespace(0, 'DM', '', '/direct-message-ns');
const Ns1 = new Namespace(1, 'Namespace1', './img/charizard.png', '/namespace-1')
const Ns2 = new Namespace(2, 'Namespace2', './img/pikachu.png', '/namespace-2')
const Ns3 = new Namespace(3, 'Namespace3', './img/squirtle.png', '/namespace-3')

const tableNames = [{namespace: Ns1, selectedNsId: 1, tableName: 'public."room1 chat history"', roomId: 0, roomName: '#casual'},
                    {namespace: Ns1, selectedNsId: 1, tableName: 'public."room2 chat history"', roomId: 1, roomName: '#hangout-plans'},
                    {namespace: Ns1, selectedNsId: 1, tableName: 'public."room3 chat history"', roomId: 2, roomName: '#food-recs'},
                    {namespace: Ns2, selectedNsId: 2, tableName: 'public."room4 chat history"', roomId: 0, roomName: '#sports'},
                    {namespace: Ns2, selectedNsId: 2, tableName: 'public."room5 chat history"', roomId: 1, roomName: '#workout'},
                    {namespace: Ns3, selectedNsId: 3, tableName: 'public."room6 chat history"', roomId: 0, roomName: "#sarah's-bday-surprise"},
                    {namespace: Ns3, selectedNsId: 3, tableName: 'public."room7 chat history"', roomId: 1, roomName: '#workplace'},
                    {namespace: Ns3, selectedNsId: 3, tableName: 'public."room8 chat history"', roomId: 2, roomName: '#world-affairs'},
                    {tableName: 'Emily Smith Joshua Johnson'},
                    {tableName: 'Emily Smith Sophia Davis'},
                    {tableName: 'Emily Smith Michael Brown'},
                    {tableName: 'Emily Smith George Blake'},
                    {tableName: 'Joshua Johnson Sophia Davis'},
                    {tableName: 'Joshua Johnson Michael Brown'},
                    {tableName: 'George Blake Joshua Johnson'},
                    {tableName: 'Michael Brown Sophia Davis'},
                    {tableName: 'George Blake Sophia Davis'},
                    {tableName: 'George Blake Michael Brown'}
                  ];
  
async function getData(table, index) {
  try {
    if (index <= 7) {
    (table.namespace).addRoom(new Room(table.roomId, table.roomName, table.selectedNsId, await main(table.tableName)));
    }
    else {
      directMessagesNs.addRoom(new Room(index-8, table.tableName, 0, await main(`public."${table.tableName}"`)));
    }
  }
  catch (error) {
    console.error(error);
  }
};

tableNames.map((item, index) => {
  getData(item, index);
});

const namespaces = [directMessagesNs, Ns1, Ns2, Ns3];


module.exports = namespaces;