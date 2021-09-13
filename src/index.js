const path = require('path')
const http= require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage} = require('./utils/messages')
const {generateLocation} = require('./utils/generateLocation')
const {addUser, getUsersInRoom, getUser, removeUser} = require('./utils/users')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public/')


app.use(express.static(publicDirectoryPath))


io.on('connection', (socket)=>{

    socket.on('join', (options, callback)=>{
        const  {error, user} = addUser({id: socket.id, ...options})

        if(error){
            return callback(error)
        }


        socket.join(user.room)

        //socket.emit, io.emit, socket.broadcast.emit
        //io.to.emit, socket.broadcast.to.emit

        socket.emit('message', generateMessage('Admin', 'Welcome'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        
        callback()
    })

    socket.on('sendMessage', (message, callback)=>{
        const filter = new Filter()
        const  user = getUser(socket.id)
        if(filter.isProfane(message)){
            return callback('Profanity is not alowed!!')
        }
        //send triggered data to front
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('disconnect', ()=>{
        const  user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage(`${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

        
    })
    socket.on('sendLocation', (coords, callback)=>{
        //send user location data to front
        const  user = getUser(socket.id)
        io.to(user.room).emit('location', generateLocation(user.username, coords.latitude, coords.longitude))
        callback()
    })
})
server.listen(port, ()=>{
    console.log('Server is up')
})