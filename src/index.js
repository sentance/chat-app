const path = require("path")
const http= require("http")
const express = require("express")
const socketio = require("socket.io")
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, "../public/")


app.use(express.static(publicDirectoryPath))


io.on("connection", (socket)=>{
    //send data to front
    socket.emit("message", "You are welcome")
    //waiting data from front

    //send event to all users
    socket.broadcast.emit("message", "A new user joined")

    socket.on("sendMessage", (message, callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not alowed!!')
        }
        //send triggered data to front
        io.emit("message", message)
        callback()
    })

    socket.on("disconnect", ()=>{
        io.emit("message", "A new user was disconnected")
    })
    socket.on("sendLocation", (coords, callback)=>{
        //send user location data to front
        io.emit("location", `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
})
server.listen(port, ()=>{
    console.log("Server is up")
})