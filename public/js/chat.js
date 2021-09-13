const socket = io()

//Elements 
const $messageForm = document.querySelector('#form')
const $locationButton = document.querySelector('#send-location')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')


//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscrool = ()=>{
    //New message element
    const $newMessage = $messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeight

    //How far have I scrool
    const scroolOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scroolOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        username: message.username,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscrool()
})


socket.on('location', (location) => {
    const html = Mustache.render(locationTemplate, {
        location: location.link,
        username: location.username,
        createdAt: moment(location.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscrool()

})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //Disable form button
    $messageFormButton.setAttribute('disabled', 'disabled')


    let inputs = e.target.elements.message.value
    //send data to back
    socket.emit('sendMessage', inputs, (error)=>{
        //enable form button
        $messageFormButton.removeAttribute('disabled')
        //clear input
        $messageFormInput.value = null
        //focus to input
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
    })
})

document.getElementById('send-location').addEventListener('click', ()=>{
    $locationButton.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation){
        return alert('Geolocation not support')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        //send user location data to server
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },
        ()=>{
            console.log('Location shared!')
            $locationButton.removeAttribute('disabled')
        })

    })


    
})

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        lolcation.href = './'
    }
})