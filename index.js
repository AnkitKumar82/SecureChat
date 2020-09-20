const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var cors = require('cors');
const path = require('path');
const cookieParser = require("cookie-parser");
let ConnectService = require("./Service/Connect.js");
let DataTranferService = require("./Service/Data.js");
app.use(cookieParser());
app.use(cors());
io.origins('*:*');
app.use(express.urlencoded());

app.use(express.json());

//Serve static files in production mode
if(process.env.NODE_ENV === "production"){
	app.use(express.static('client/build'));
	app.get('*',(req,res)=>{
		res.sendFile(path.resolve(__dirname,'client','build','index.html'));
	});
}
io.on("connection",(socket)=>{
  	socket.on("connect_request",(body)=>{
    	ConnectService.connectRequest(body,socket,io);
  	});
  	socket.on("connect_request_accept",(body)=>{
   		ConnectService.connectRequestAccept(body,socket,io);
  	});
  	socket.on("connect_request_reject",(body)=>{
    	ConnectService.connectRequestReject(body,socket,io);
  	});
  	socket.on("connect_terminate",(body)=>{
    	ConnectService.connectTerminate(body,socket,io);
  	});
  	socket.on("data_send",(body)=>{
    	DataTranferService.dataTransfer(body,socket,io);
  	});
});
server.listen(process.env.PORT || 5000,()=>{
  	console.log("Server is listening on",process.env.PORT || 5000);
});