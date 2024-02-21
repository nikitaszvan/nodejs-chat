const joinRoom = async(roomTitle, namespaceId, currentUser, userId = null)=>{
    const ackResp = await nameSpaceSockets[namespaceId].emitWithAck('joinRoom', {roomTitle, namespaceId});
    
    document.querySelectorAll('.room-list').forEach(parentNode => {
        for (const element of parentNode.children) {
        element.classList.remove('room-selected');
    }
});
    document.querySelector(`[room-title="${roomTitle}"]`).classList.add('room-selected');
    
    if (namespaceId == 0) {
        document.querySelector('.curr-room-num-users').innerHTML = '';
    }
    else {
        document.querySelector('.curr-room-num-users').innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-circle" style="color: #00ff11; font-size: 10px; margin-left: 5px;"></span>`;
    }
    document.querySelector('.curr-room-text').innerHTML = roomTitle.replace(currentUser, "").trim();

    //we get back the room history in the acknowledge as well!
    document.querySelector('#messages').innerHTML = "";

    ackResp.thisRoomsHistory.forEach(message=>{
        document.querySelector('#messages').innerHTML += buildMessageHtml(message);
    });
}
