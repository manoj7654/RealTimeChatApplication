const chatForm=document.getElementById("chat-form")
const Chatmessage=document.querySelector(".chat-message");
const userRoom=document.getElementById("room-name");
const userList=document.getElementById("users")


const urlParams=new URLSearchParams(window.location.search);

const username=urlParams.get("username");
const room=urlParams.get("room")

console.log(username,room)

const socket=io("http://localhost:8080/",{transports:["websocket"]})

socket.emit("joinRoom",{username,room})

socket.on("message",(message)=>{
    
    outpMessage(message)
})

socket.on("roomUsers",({room,users})=>{
    outputRoomName(room)
    outputUsersRoom(users)
})

chatForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    let msg=e.target.elements.msg.value;
    msg=msg.trim()
    if(!msg){
        return false;
    }
    socket.emit("Chatmessage",msg)
    e.target.elements.msg.value=""
    e.target.elements.msg.focus();

})

//for message
function outpMessage(message){
    const div=document.createElement("div");
     div.classList.add("message");
     const p=document.createElement("p");
     p.classList.add("meta")
     p.innerText=message.username
     p.innerHTML =`<span> ${message.time}</span>`
     div.appendChild(p);

     const para=document.createElement("p");
     para.classList.add("text")
     para.innerText=message.text;
     div.appendChild(para)

    document.querySelector(".chat-messages").appendChild(div)
}

function outputRoomName(room){
    userRoom.innerText=room
}

function outputUsersRoom(users){
    userList.innerHTML=""
    users.forEach(element => {
        const li=document.createElement("li")
        li.innerText=element.username
        userList.appendChild(li)
    });
}
document.getElementById("leave-btn").addEventListener("click",(e)=>{
    const leave=confirm("Are you sure you want to leave the chat room")
    if(leave){
        window.location.href="./index.html"
    }
})