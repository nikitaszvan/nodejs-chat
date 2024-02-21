

const joinNs = (element, nsData, nsId=false, isClicked = false)=>{
console.log(element);
checkNsId = nsId || element.getAttribute('namespaceid');
if (checkNsId != 0) {
    Array.from(document.querySelector('.namespaces').children).forEach(elem => {
        elem.querySelector('img').classList.remove('selected-ns');
    });
}
    if (element) {
        element.querySelector('div > img')?.classList.add('selected-ns');
    }
    else {

        document.querySelector(`div[namespaceid="${nsId}"] > img`) && document.querySelector(`div[namespaceid="${nsId}"] > img`).classList.add('selected-ns');
    }
    
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
        selectedNsId = nsId;
        rooms = clickedNs.rooms;
    }

    if (selectedNsId == 0) {
        lastNs = localStorage.getItem('lastNs') != 0 ? localStorage.getItem('lastNs') : 1;
        element.querySelector('div[namespaceid = "1"]').classList.add('selected-ns');
        clickedNs = nsData.find(row=>row.id == lastNs);
        rooms = clickedNs.rooms;
    }
    let firstRoom;
        let roomList = document.querySelectorAll('.room-list')[0];
        roomList.innerHTML = "";
    rooms.forEach((room,i)=>{

        if(i === 0) {
            firstRoom = room.roomTitle;
            roomList.innerHTML += `<li class="room group" room-title="${room.roomTitle}" namespaceId=${room.namespaceId}>
            <span class="fa-solid"></span>${room.roomTitle}
            </li>`
        }
        else {
            if (room.roomTitle == document.querySelector('.curr-room-text').innerHTML) {
                roomList.innerHTML += `<li class="room group room-selected" room-title="${room.roomTitle}" namespaceId=${room.namespaceId}>
            <span class="fa-solid"></span>${room.roomTitle}
        </li>`
            }

            else {
        roomList.innerHTML += `<li class="room group" room-title="${room.roomTitle}" namespaceId=${room.namespaceId}>
            <span class="fa-solid"></span>${room.roomTitle}
        </li>`
            }
            }
    })

document.querySelectorAll('.room-list').forEach(parentNode => {
    for (const element of parentNode.children) {
    element.addEventListener('click', ()=>{
        localStorage.setItem(`lastRoom-${userId}`, JSON.stringify({ roomTitle: element.getAttribute('room-title'), roomNsId: element.getAttribute('namespaceid')}));
        joinRoom(element.getAttribute('room-title'), element.getAttribute('namespaceid'), loginname.name);
        
    });
};
});


    //init join first room
    if (!localStorage.getItem(`lastRoom-${userId}`)) {
        joinRoom(firstRoom, clickedNs.id, loginname.name, userId);
        console.log('no room detected');
    }
    else if (!isClicked){
        joinRoom(`${JSON.parse(localStorage.getItem(`lastRoom-${userId}`)).roomTitle}`, `${JSON.parse(localStorage.getItem(`lastRoom-${userId}`)).roomNsId}`, loginname.name);
        console.log('from previous room detected');

    }

    localStorage.setItem('lastNs', selectedNsId !== 0 ? selectedNsId : 1);
}