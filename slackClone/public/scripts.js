
const logins = [
    {
        name: 'Emily Smith',
        email: 'emilysmith@outmail.com',
        avatar: './img/worker1_profile_pic.jpg',
        password: 'password',
    },
    {
        name: 'Joshua Johnson',
        email: 'joshuajohnson@outmail.com',
        avatar: './img/worker2_profile_pic.jpg',
        password: 'password',
    },
    {
        name: 'Sophia Davis',
        email: 'sophiadavis@outmail.com',
        avatar: './img/worker3_profile_pic.jpg',
        password: 'password',
    },
    {
        name: 'Michael Brown',
        email: 'michaelbrown@outmail.com',
        avatar: './img/worker4_profile_pic.jpg',
        password: 'password',
    },
    {
        name: 'George Blake',
        email: 'georgeblake@outmail.com',
        avatar: './img/worker5_profile_pic.jpg',
        password: 'password',
    },

];


const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('i');
console.log(userId);
let userDetails = localStorage.getItem(`user_email_${userId}`) || localStorage.getItem(`test_${userId}`);
console.log(userDetails);
localStorage.removeItem(`user_email_${userId}`);
localStorage.setItem(`test_${userId}`, userDetails);
const loginname = logins.find(user => user.email == userDetails);
document.getElementsByClassName('rooms')[0].insertAdjacentHTML('afterbegin',  `<div class="profile-container" style="margin-bottom: 20px;"><img class="main-pf" src=${loginname.avatar} alt= "Profile image of ${loginname.name}"/><h2 id='username-header'>${loginname.name}</h2></div>`);



//always join the main namespace, because that's where the client gets the other namespaces from
// const socket = io('http://localhost:9000', clientOptions);

const socket = io('http://localhost:9000');
//sockets will be put into this array, in the index of their ns.id
const nameSpaceSockets = [];
const listeners = {
    nsChange: [],
    messageToRoom: [],
}

//a global variable we can update when the user clicks on a namespace
//we will use it to broadcast across the app (redux would be great here...)
let selectedNsId = 0;
const date = new Date()

//add a submit handler for our form
document.querySelector('#message-form').addEventListener('submit', (e)=>{
    //keep the browser from submitting
    e.preventDefault();
    //grab the value from the input box
    const newMessage = document.querySelector('#user-message').value;
    nameSpaceSockets[selectedNsId].emit('newMessageToRoom',{
        message: newMessage,
        date: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours() % 12 || 12).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} ${date.getHours() < 12 ? 'a.m.' : 'p.m.'}`,
        avatar: loginname.avatar,
        user: loginname.name,
        selectedNsId,
    })
    document.querySelector('#user-message').value = "";
});

document.querySelector('#logout-form').addEventListener('submit', (e)=> {
    e.preventDefault();
    localStorage.removeItem(`test_${userId}`);
    userDetails='';
    e.target.submit();
});

//addListeners job is to manage all listeners added to all namespaces.
//this prevents listeneres being added multiples times and makes life
//better for us as developers.
const addListeners = (nsId)=>{
    // nameSpaceSockets[ns.id] = thisNs;
    if(!listeners.nsChange[nsId]){
        nameSpaceSockets[nsId].on('nsChange',(data)=>{
            console.log("Namespace Changed!");
            console.log(data);
        })
        listeners.nsChange[nsId] = true;
    }
    if(!listeners.messageToRoom[nsId]){
        //add the nsId listener to this namespace!
        nameSpaceSockets[nsId].on('messageToRoom', (messageObj) =>{
            document.querySelector('#messages').innerHTML += buildMessageHtml(messageObj);
        })
        listeners.messageToRoom[nsId] = true;
    }
}

socket.on('connect',()=>{
    console.log("Socket connected!");
    socket.emit('clientConnect');
})

//lisen for the nsList event from the server which gives us the namespaces
socket.on('nsList',(nsData)=>{
    const lastNs = localStorage.getItem('lastNs');
    const nameSpacesDiv = document.querySelector('.namespaces');
    nameSpacesDiv.innerHTML = "";
    nsData.forEach(ns =>{
        //update the HTML with each ns
        if (ns.id !== 0) { 
        nameSpacesDiv.innerHTML +=  `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`

        //initialize thisNs as its index in nameSpaceSockets.
        //If the connection is new, this will be null
        //If the connection has already been established, it will reconnect and remain in its spot
        // let thisNs = nameSpaceSockets[ns.id];
        
        
    }
    else {
        const dmRooms = document.querySelector('.dm-room-list');
        dmRooms.innerHTML = "";
        ns.rooms.forEach(room => {
            if (room.roomTitle != loginname.name) {
                dmRooms.innerHTML += `<li class="glyphicon glyphicon-globe room" namespaceId="0">${room.roomTitle}</li>`
            }
        })

    }
    if(!nameSpaceSockets[ns.id]){
        //There is no socket at this nsId. So make a new connection!
        //join this namespace with io()
        nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
    }
    addListeners(ns.id);
    })
    


    Array.from(document.getElementsByClassName('namespace')).forEach(element=>{
        element.addEventListener('click',e=>{
            joinNs(element,nsData);
        })
    })
    

    //if lastNs is set, grab that element instead of 0.
    joinNs(document.getElementsByClassName('namespace')[0],nsData)

});
