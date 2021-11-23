const io = require('socket.io-client');
const { v4: uuidv4 } = require('uuid');
var url = "https://ckotha.com:5281/api/get_roster";
var xhr = new XMLHttpRequest();

const socket = io('http://ckotha.com:4000/');

// take the socket id for channel creation
socket.on('connect',() => {
    let channelName = uuidv4();

    //show the channel name as QR code
    new QRCode(document.getElementById("qrcode"), channelName);

    //create the datachannel using socket id
    socket.emit('joinroom',1,{channel: channelName},(object)=>{console.log(object.status)});
    //socket.emit('androidMessage',1,{channel:'waqar',data:'jahid'},(object) =>{console.log(object.status)});
});

var cnt=0;
//Take the data sent from connected android
socket.on('browserMessage',(data) => {
    sessionStorage.setItem(`data${cnt}`,data);
    cnt++;
    if(sessionStorage.length === 3){
        document.getElementById('msg').innerText = "";
        document.getElementById('msg').innerText += "Press login";
    }
});

document.getElementById("btn").addEventListener('click',()=>{

    xhr.open("POST", url);
    let basicAuth = "Basic "+sessionStorage.getItem('data1');
    xhr.setRequestHeader("Authorization", basicAuth);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            if(xhr.status===200){
                document.getElementById('main').innerHTML = ""; 
                document.getElementById('main').innerHTML += `<h1>Welcome ${userName}, You have logged in </h1>`;
            }
        }
    };
    let userName = sessionStorage.getItem('data0');
    var data = `{
    "user": "${userName}",
    "server":"ckotha.com"
    }`;

    xhr.send(data);
    
})
