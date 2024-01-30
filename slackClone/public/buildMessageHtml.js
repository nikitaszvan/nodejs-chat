


const buildMessageHtml = (messageObj) =>`
    <li>
        <div class="user-image">
            <img class="user-avatar" src="${messageObj.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${messageObj.user} <span>${messageObj.date}</span></div>
            <div class="message-text">${messageObj.message}</div>
        </div>
    </li>    
`