
const socket = io('http://localhost:9000');

socket.on('connect',()=>{
    console.log("Connected!");
    socket.emit('clientConnect');
});

//lisen for the nsList event from the server which gives us the namespaces
socket.on('nsList',(nsData)=>{
    let iconContainer;
    let iconElement;
    const nameSpacesDiv = document.querySelector('.namespaces');
    nsData.forEach(ns=>{
        //update the HTML with each ns
        nameSpacesDiv.innerHTML +=  `<div class="namespace" ns="${ns.endpoint}"></div>`
    })

    Array.from(document.getElementsByClassName('namespace')).forEach(element =>{
        element.addEventListener('click', () =>{

            const nsEndpoint = element.getAttribute('ns');

            const clickedNs = nsData.find(row=>row.endpoint === nsEndpoint);
            const rooms = clickedNs.rooms;

            //get the room-list div
            let roomList = document.querySelector('.room-list');
            //clear it out
            roomList.innerHTML = "";
            //loop through each room, and add it to the DOM
            rooms.forEach(room=>{
                roomList.innerHTML += `<li room-title="${room.roomTitle}"><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`
            })
        })
    })

})