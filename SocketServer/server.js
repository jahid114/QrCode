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

     //join Specific data channel (Both android an web client)
	socket.on("joinroom", (arg1, arg2, callback) => {
		console.log(arg1); // 1
		console.log(arg2); // { name: "updated" }
		socket.join(arg2.channel);
		callback({
			status: "ok"
		});
		});
	
    //Android will sent the data to a specific data channel 
	socket.on("androidMessage", (arg1, arg2, callback) => {
		console.log(arg1);
		console.log(arg2);
        //This data will be sent to the web client connected to the data channel
		socket.to(arg2.channel).emit('browserMessage',arg2.name);
		socket.to(arg2.channel).emit('browserMessage',arg2.pass);
		callback({
			status: "ok"
		});
	});
	
	socket.on('disconnect',() => {
        console.log('A user disconnected');
    });

});

const port = process.env.port || 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));
