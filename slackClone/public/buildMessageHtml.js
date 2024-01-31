


const buildMessageHtml = (messageObj) =>`
    <li>
        <div class="user-image">
            <img class="user-avatar" src="${messageObj.avatar}" />
        </div>
        <div class="user-message">
            <div class="message-user">${messageObj.user} <span class="message-time" style="display: none;">${messageObj.date}</span></div>
            <div class="message-text">${messageObj.message}</div>
        </div>
    </li>    
`