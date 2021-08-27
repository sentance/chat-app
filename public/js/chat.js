const socket = io()

//Elements 
const $messageForm = document.querySelector('#form')
const $locationButton = document.querySelector('#send-location')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')
const $locationSharing = document.querySelector('#location-sharing')

//Templates

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})
socket.on('location', (location) => {
    console.log(location)
    const html = Mustache.render(locationTemplate, {
        location
    })
    $locationSharing.insertAdjacentHTML('beforeend', html)

})

function sendData(){
   socket.emit('increment', inputs)
}
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
        console.log('Message delivered')
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