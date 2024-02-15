

const joinNs = (element, nsData, nsId=false)=>{
    const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('i');

    let clickedNs;
    let rooms;
    if (!nsId) {
        const nsEndpoint = element.getAttribute('ns');
        clickedNs = nsData.find(row=>row.endpoint === nsEndpoint);
        //global so we can submit the new message to the right place
        selectedNsId = clickedNs.id;
        rooms = clickedNs.rooms;
    }
    else {
        clickedNs = nsData.find(row=>row.id == nsId);
        console.log(clickedNs);
        selectedNsId = nsId;
        rooms = clickedNs.rooms;
    }
    if (selectedNsId === 0) {
        clickedNs = nsData.find(row=>row.endpoint === localStorage.getItem('lastNs'));
    }
    
    let firstRoom;
    //get the room-list div

        let roomList = document.querySelector('.room-list');
        //clear it out
        


        //init firstRoom var
        

    //loop through each room, and add it to the DOM
    if (selectedNsId!== 0) {
        roomList.innerHTML = "";
        console.log(selectedNsId);
    rooms.forEach((room,i)=>{
        Array.from(document.querySelector('.dm-room-list').children).forEach(dmList => {
            dmList.classList.remove('room-selected');
        })
        if(i === 0) {
            firstRoom = room.roomTitle;
            roomList.innerHTML += `<li class="room group" room-title="${room.roomTitle}" namespaceId=${room.namespaceId}>
            <span class="fa-solid"></span>${room.roomTitle}
            </li>`
        }
        else {
        roomList.innerHTML += `<li class="room group" room-title="${room.roomTitle}" namespaceId=${room.namespaceId}>
            <span class="fa-solid"></span>${room.roomTitle}
        </li>`}
    })
}


    //init join first room
    if (!localStorage.getItem(`lastRoom-${userId}`)) {
        joinRoom(firstRoom, clickedNs.id, loginname.name);
    }
    else {
            joinRoom(`${JSON.parse(localStorage.getItem(`lastRoom-${userId}`)).roomTitle}`, `${JSON.parse(localStorage.getItem(`lastRoom-${userId}`)).roomNsId}`, loginname.name);

    }

    //add click listener to each room so the client can tell the server it wants to join!
    const roomNodes = document.querySelectorAll('.room');
    Array.from(roomNodes).forEach(elem=>{
        elem.addEventListener('click',e=>{
            const namespaceId = elem.getAttribute('namespaceId');
            Array.from(document.querySelectorAll('.room-list')).forEach(element => {
                Array.from(element.children).forEach(roomItem=> {
                    roomItem.classList.remove('room-selected');
                })
            })
            e.target.classList.add('room-selected');
            const joinedRoom = e.target.getAttribute('room-title');
            localStorage.removeItem(`lastRoom-${userId}`);
            localStorage.setItem(`lastRoom-${userId}`, JSON.stringify({roomTitle: e.target.getAttribute('room-title'), roomNsId: e.target.getAttribute('namespaceId')}));
            joinRoom(joinedRoom, namespaceId, loginname.name);

        })
    })

}