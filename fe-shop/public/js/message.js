const ws = new WebSocket(`ws://localhost:6001/app/e81326258299847689ba`)
ws.addEventListener('message', event => {
    var data = JSON.parse(event.data)
    if (data.data)
        data = JSON.parse(data.data)
    if (data.socket_id) {
        $.ajax({
            method: "POST",
            url: "/api/broadcast",
            data: {
                "socket_id": data.socket_id
            },
            headers: {'Accept': 'application/json'},

            success: function (data) {
                ws.send(JSON.stringify({
                    "event": "pusher:subscribe",
                    "data": {
                        "auth": data.auth,
                        "channel": "chat." + userId
                    }
                }))
            }
        })
    }
    if (data.message) {
        $('#chat-content').append(renderData(data))
        scrollToBottom();
    }
})

function renderUser(user) {
    let html = ''
    let userChatUrl = userChatUrlTemplate.replace(':id', user.id);
    html += `
        <a href="${userChatUrl}" data-user-id="${user.id}">
            <li class="list-group-item">
                <div class="d-flex align-items-center">
                    <img src="https://via.placeholder.com/40" class="rounded-circle mr-2" alt="User Avatar">
                    <div>
                        <h6 class="mb-0">${user.name}</h6>
                    </div>
                </div>
            </li>
        </a>
    `
    return html;
}


function renderData(message) {
    if (message.user_from === userId) {
        html = `
         <div class="message sender">${message.message}</div>`
    } else {
        html = `<div class="message receiver">${message.message}</div>`
    }
    return html;
}

let currentPage = 1;
let isLoading = false;

function getUserList() {
    $.ajax({
        method: "GET",
        url: "/api/message/filterUserMessage/",
        headers: {'Accept': 'application/json'},
        success: function (data) {
            var listUser = '';
            data.forEach(function (item) {
                listUser += renderUser(item)
            });
            $('#chat-user').html(listUser);
        },
        error: function (error) {
            console.log('Error fetching user list:', error);
        }
    });
}

function getData(userId) {
    if (isLoading) return;
    isLoading = true;

    $.ajax({
        method: "GET",
        url: `/api/message/filterMessage/${userId}?page=${currentPage}`,
        headers: {'Accept': 'application/json'},
        success: function (response) {
            var messages = response.data;
            var htmlContent = '';
            messages.forEach(function (item) {
                htmlContent = renderData(item) + htmlContent;
            });

            if (currentPage === 1) {
                $('#chat-content').html(htmlContent);
                scrollToBottom();
            } else {
                $('#chat-content').prepend(htmlContent);
            }

            currentPage++;
            isLoading = false;

            if (currentPage > response.last_page) {
                $('#load-more').hide();
            } else {
                $('#load-more').show();
            }
        },
        error: function (error) {
            console.log('Error fetching messages:', error);
            isLoading = false;
        }
    });
}

function initializeChat() {
    getUserList();
    if (userTo) {
        getData(userTo);
    }
}

$('form#messageForm').on('submit', function (event) {
    event.preventDefault();
    var message = $("#messageInput").val();
    console.log('Submitting message:', message, 'to user:', userTo);
    if (!message.trim() || !userTo) {
        console.log('Message is empty or userTo is not set');
        return;
    }

    $.ajax({
        method: "POST",
        url: "/api/message/sent",
        data: {
            "message": message,
            "user_to": userTo,
        },
        headers: {'Accept': 'application/json'},
        success: function (data) {
            console.log('Message sent successfully:', data);
            $('#chat-content').append(renderData(data));
            scrollToBottom();
            $("#messageInput").val("");
        },
        error: function (error) {
            console.log('Error sending message:', error);
        }
    });
});

$(document).on('click', '#chat-user a', function(e) {
    e.preventDefault();
    userTo = $(this).data('user-id');
    $('#current-chat-user').text($(this).find('h6').text());
    currentPage = 1;
    getData(userTo);
    
    // Kích hoạt form nhắn tin
    $('#messageInput').prop('disabled', false);
    $('#sendMessageButton').prop('disabled', false);
    
    console.log('Selected user:', userTo);
});

$(document).ready(function() {
    initializeChat();

    $('#load-more').on('click', function() {
        getData(userTo);
    });

    $('#messageBody').on('scroll', function() {
        if ($(this).scrollTop() === 0) {
            getData(userTo);
        }
    });
});

function scrollToBottom() {
    var messageBody = document.getElementById("messageBody");
    messageBody.scrollTop = messageBody.scrollHeight;
}