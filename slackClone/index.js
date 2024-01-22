const express = require('express');
const app = express();
const socketio = require('socket.io');
const Room = require('./classes/Room');
const path = require('path');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const User = require('./models/User');

const namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
  });

const expressServer = app.listen(9000);
const io = socketio(expressServer)

app.set('io', io);

const logins = [
    {
        email: 'emilysmith@outmail.com',
        password: 'password',
    },
    {
        email: 'davidblake@outmail.com',
        password: 'password',
    },
];

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    //const filteredInfo = logins.filter(login => login.email === req.user.name);
});

let refreshTokens = [];

app.get("/auth", authenticateToken, (req, res) => {
    res.redirect('/index');
})

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    })
});

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    const user = { name: email };
    const filteredLogins = logins.filter(login => login.email === email);
    if (filteredLogins.length === 0) {
        return res.status(401).json({ error: 'Incorrect credentials' });
    }

    const findPassword = filteredLogins.find(login => login.password === password);
    if (findPassword) {
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10m' });
        refreshTokens.push(refreshToken);
        return res.json({ success: true, redirectTo: '/index', accessToken: accessToken, refreshToken: refreshToken });
    }
    else {
        return res.status(401).json({ error: 'Incorrect credentials' });
    }
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

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
    io.of(namespaces[0].endpoint).emit('nsChange', namespaces[0]);
    res.json(namespaces[0]);
})

io.use((socket,next)=>{
    const jwt = socket.handshake.query.jwt;
    if(1){
        next()
    }else{
        console.log("Goodbye")
        socket.disconnect()
    }
})

io.on('connection',(socket)=>{
    socket.emit('welcome', "Welcome to the server.");
    socket.on('clientConnect', () => {
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


