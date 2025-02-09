import express from 'express'
import cors from "cors"
import { Server } from 'socket.io'
import http from "http"
import { mongodbConnet } from './config.js';
import { chatModel } from './chatschema.js';
const app = express();
const port = 3000;

//1 create server using http
const server = http.createServer(app);


//2 creste socket server
//socket server use http server to start the server to start the communciatiob
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})
//3 use soket events
io.on('connection', (socket) => {
    console.log("connection is established");
    socket.on('join', (data => {
        socket.username = data;
        chatModel.find().sort({ timeStamp: 1 }).limit(50)
            .then((messages => {
                socket.emit('loadMsg', messages)
            })).catch((err) => {
                console.log(err);

            })
    }))
    socket.on('new-message', (messages) => {
        //broadcast this msg to all the clients
        let userMsg = {
            username: socket.username,
            messages: messages
        }
        const newChat = new chatModel({
            username: socket.username,
            msg: messages,
            timeStamp: new Date()
        })
        newChat.save();
        socket.broadcast.emit('boardCast-message', userMsg);
    })
    socket.on('disconnect', () => {
        console.log("connection is disconnected")
    })
});
server.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
    mongodbConnet();
})