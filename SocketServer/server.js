const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});

io.on('connection',(socket) => {
    console.log('A user connected');

    // Send the socketId to create a data channel with it
    io.emit('socketId',socket.id);

    //join Specific data channel (Both android an web client)
    socket.on('joinroom',(channelName) =>{
        socket.join(channelName);
        console.log(`${socket.id} is connected to data channel ${channelName}`);
    });

    //Android will sent the data to a specific data channel 
    socket.on('androidMessage',(channelName,data) => {
        //This data will be sent to the web client connected to the data channel
        socket.to(channelName).emit('browserMessage',data);
    });

    socket.on('disconnect',() => {
        console.log('A user disconnected');
    });
});

const port = process.env.port || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));