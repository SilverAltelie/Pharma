var $ = jQuery.noConflict();
$(document).ready(function() {
    $('.user-login-info').click(function(e) {
        console.log('1');
        $('.profile-dropdown').toggleClass('d-block'); // Toggle visibility of the dropdown
    });
});


// document.addEventListener('DOMContentLoaded', function() {
//     const chatBtn = document.querySelector('.chat-btn');
//     const chatWindow = document.getElementById('chat-window');
//     const closeChatBtn = document.getElementById('close-chat');
//     const userTo = document.getElementById('')
//
//     // Kiểm tra trạng thái của chat window từ LocalStorage
//     if (localStorage.getItem('chatWindowState') === 'open') {
//         chatWindow.style.display = 'block';
//     }
//
//     if (chatBtn) {
//         chatBtn.addEventListener('click', function(event) {
//             event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ a
//             chatWindow.style.display = 'block'; // Hiển thị chat window
//             localStorage.setItem('chatWindowState', 'open'); // Lưu trạng thái vào LocalStorage
//             localStorage.setItem('SellerId', userTo); // Lưu trạng thái vào LocalStorage
//         });
//     }
//
//     if (closeChatBtn) {
//         closeChatBtn.addEventListener('click', function() {
//             chatWindow.style.display = 'none'; // Ẩn chat window
//             localStorage.setItem('chatWindowState', 'closed'); // Lưu trạng thái vào LocalStorage
//         });
//     }
// });


