const joinRoom = async(roomTitle, namespaceId)=>{
    
    const ackResp = await nameSpaceSockets[namespaceId].emitWithAck('joinRoom',{roomTitle,namespaceId});
    if (namespaceId == 0) {
        document.querySelector('.curr-room-num-users').innerHTML = '';
    }
    else {
        document.querySelector('.curr-room-num-users').innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-circle" style="color: #00ff11; font-size: 10px; margin-left: 5px;"></span>`;
    }
    document.querySelector('.curr-room-text').innerHTML = roomTitle;

    //we get back the room history in the acknowledge as well!
    document.querySelector('#messages').innerHTML = "";

    ackResp.thisRoomsHistory.forEach(message=>{
        document.querySelector('#messages').innerHTML += buildMessageHtml(message)
    })


    // nameSpaceSockets[namespaceId].emit('joinRoom',roomTitle,(ackResp)=>{
    //     console.log(ackResp);

    //     document.querySelector('.curr-room-num-users').innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`
    //     document.querySelector('.curr-room-text').innerHTML = roomTitle;

    // });


}