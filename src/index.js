const path = require('path')
const http= require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage} = require('./utils/messages')
const {generateLocation} = require('./utils/generateLocation')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public/')


app.use(express.static(publicDirectoryPath))


io.on('connection', (socket)=>{

    socket.on('join', ({username, room})=>{
        socket.join(room)

        //socket.emit, io.emit, socket.broadcast.emit
        //io.to.emit, socket.broadcast.to.emit

        socket.emit('message', generateMessage('Welcome'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`))
    })

    socket.on('sendMessage', (message, callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not alowed!!')
        }
        //send triggered data to front
        io.to('one').emit('message', generateMessage(message))
        callback()
    })

    socket.on('disconnect', ()=>{
        io.emit('message', 'A new user was disconnected')
    })
    socket.on('sendLocation', (coords, callback)=>{
        //send user location data to front
        io.emit('location', generateLocation(coords.latitude, coords.longitude))
        callback()
    })
})
server.listen(port, ()=>{
    console.log('Server is up')
})