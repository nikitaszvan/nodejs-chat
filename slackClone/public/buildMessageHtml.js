


const buildMessageHtml = (messageObj) =>`
    <li>
        <div class="user-image">
            <img class="user-avatar" src="${messageObj.avatar}" />
        </div>
        <div class="user-message">
            <div class="message-user">${messageObj.user}</div>
            <div class="message-text" onclick="toggleMessageTime(this)">${messageObj.message}</div>
            <div class="message-time" style="display: none;">${messageObj.date}</div>
        </div>
    </li>    
`

function toggleMessageTime(element) {
    const timeSpan = element.nextElementSibling;
    if (timeSpan) {
        timeSpan.style.display = (timeSpan.style.display === 'none') ? 'block' : 'none';
    }
}