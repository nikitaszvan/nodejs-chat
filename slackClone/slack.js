const express = require('express');
const app = express();
const socketio = require('socket.io');
const Room = require('./classes/Room');
const path = require('path');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('./models/User');

const namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const expressServer = app.listen(9000);
const io = socketio(expressServer)

app.set('io', io);

 // Import your User model

// app.post("/login", async function (req, res) {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email: email });

//   if (user) {
//     const checkPassword = await bcrypt.compare(password, user.password);

//     if (checkPassword) {
//       const token = jwt.sign(
//         { email: email, password: password, name: user.name },
//         "shhhhh"
//       );

//       // Redirect to a secure page upon successful login
//       return res.redirect('/slack.html');
//     }

//     // Redirect back to the login page if password check fails
//     return res.redirect('/login.html');
//   }

//   // Redirect back to the login page if user not found
//   res.redirect('/login.html');
// });

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.post("/login", function (req, res) {
    const { email, password } = req.body;
    
    // Hardcoded check for username and password
    if (email === "Rob" && password === "x") {
    //   const token = jwt.sign(
    //     { email: email, password: password, name: "Rob" },
    //     "shhhhh"
    //   );
  
      // Redirect to a secure page upon successful login
      return res.redirect('/slack.html');
    }
  
    // Redirect back to the login page if username or password is incorrect
    return res.redirect('/login.html');
  });

// app.get("/auth", function (req, res) {
//   const token = req.headers["x-auth-token"];

//   if (token) {
//     const decoded = jwt.verify(token, "shhhhh");

//     return res
//       .status(200)
//       .json({ user: { email: decoded.email, name: decoded.name } });
//   }

//   // Redirect to login page if no token is present
//   res.redirect('/login.html');
// });

//manufactured way to change an ns (without building a huge UI)
app.get('/change-ns',(req, res)=>{
    //update namespaces array
    namespaces[0].addRoom(new Room(0,'Deleted Articles',0))
    //let everyone know in THIS namespace, that it changed
    io.of(namespaces[0].endpoint).emit('nsChange',namespaces[0]);
    res.json(namespaces[0]);
})

io.use((socket,next)=>{
    const jwt = socket.handshake.query.jwt;
    console.log(jwt);
    if(1){
        next()
    }else{
        console.log("Goodbye")
        socket.disconnect()
    }
})

io.on('connection',(socket)=>{

    // console.log('==================')
    // console.log(socket.handshake);

    const userName = socket.handshake.query.userName;
    const jwt = socket.handshake.query.jwt;

    socket.emit('welcome', "Welcome to the server.");
    socket.on('clientConnect', (data) => {
        console.log(socket.id, "has connected")
        socket.emit('nsList', namespaces)
    })
})

namespaces.forEach(namespace=>{
    // const thisNs = io.of(namespace.endpoint)
    io.of(namespace.endpoint).on('connection',(socket)=>{
        // console.log(`${socket.id} has connected to ${namespace.endpoint}`)
        socket.on('joinRoom',async(roomObj,ackCallBack)=>{
            //need to fetch the history
            const thisNs = namespaces[roomObj.namespaceId];
            const thisRoomObj = thisNs.rooms.find(room=>room.roomTitle === roomObj.roomTitle)
            const thisRoomsHistory = thisRoomObj.history;

            //leave all rooms, because the client can only be in one room
            const rooms = socket.rooms;
            // console.log(rooms);
            let i = 0;
            rooms.forEach(room=>{
                //we don't want to leave the socket's personal room which is guaranteed to be first
                if(i!==0){
                    socket.leave(room);
                }
                i++;
            })

            //join the room! 
            // NOTE - roomTitle is coming from the client. Which is NOT safe.
            // Auth to make sure the socket has right to be in that room
            socket.join(roomObj.roomTitle);

            //fetch the number of sockets in this room
            const sockets = await io.of(namespace.endpoint).in(roomObj.roomTitle).fetchSockets()
            // console.log(sockets);
            const socketCount = sockets.length;

            ackCallBack({
                numUsers: socketCount,
                thisRoomsHistory,
            })
        })

        socket.on('newMessageToRoom',messageObj=>{
            console.log(messageObj);
            //broadcast this to all the connected clients... this room only!
            //how can we find out what room THIS socket is in?
            const rooms = socket.rooms;
            const currentRoom = [...rooms][1]; //this is a set!! Not array
            //send out this messageObj to everyone including the sender
            io.of(namespace.endpoint).in(currentRoom).emit('messageToRoom',messageObj)
            //add this message to this room's history
            const thisNs = namespaces[messageObj.selectedNsId];
            const thisRoom = thisNs.rooms.find(room=>room.roomTitle === currentRoom);
            console.log(thisRoom)
            thisRoom.addMessage(messageObj);
        })

    })
})


