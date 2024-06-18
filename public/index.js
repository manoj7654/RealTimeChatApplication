const express=require("express")
const {userJoin, getCurrentUser, leaveUsers}=require("./utils/user")
const {getRoomUser}=require("./utils/user")
const socketio=require("socket.io")
const http=require("http");
const formateMessage = require("./utils/message");
const app=express();
const server=http.createServer(app);
const io=socketio(server);

const boat="Masai Server"
io.on("connection",(socket)=>{
    console.log("one client joined")
     socket.on("joinRoom",({username,room})=>{
        const user=userJoin(socket.id,username,room)
        socket.join(user.room)

        socket.emit("message",formateMessage(boat,"Welcome to the Masai Server"))
         socket.broadcast.to(user.room).emit("message",formateMessage(boat,`${user.username} has join in this chat`))
         io.to(user.room).emit("roomUsers",{room:user.room,users:getRoomUser(user.room)})
        })
    socket.on("Chatmessage",(msg)=>{
        const user=getCurrentUser(socket.id)
        io.to(user.room).emit("message",formateMessage(user.username,msg))
    })
    socket.on("disconnect",()=>{
        const user=leaveUsers(socket.id)
        io.to(user.room).emit("message",formateMessage(boat,`${user.username} has left the chat`))
        io.to(user.room).emit("roomUsers",{room:user.room,users:getRoomUser(user.room)})
        
    })

})

const port=8080;
server.listen(port,()=>console.log(`server is running on port ${port}`),)