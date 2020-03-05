let name = '';
let timeLastTyping = new Date().getTime();

$(function () {
  const socket = io('http://172.16.8.6:3000')
  $('#input').submit(function (e) {
    e.preventDefault()
    if ($('#message').val() !== '') {
      const data = {
        name: name,
        payload: $("#message").val()
      }
      socket.emit('chat-message', data)
      $('#message').val('')
      return
    }
  })
  socket.on('chat-message', function (data) {
    let time = new Date().toLocaleTimeString()
    console.log('received chat message:', data)
    $('#messages').append($('<li>').text(`<${data.name}> (${time}) : ${data.payload} `))
    $(document).scrollTop($(document).height())
  })
  socket.on('get-name', function (data) {
    console.log('got a name prompt')
    $('#messages').append($('<li>').text(data))
    getName();
  })

  socket.on('typing-message', (data) => {
    console.log(`${data} is typing...`)
    $('#status').text(`${data} is typing... `)
    typingTimeout()
  })

  async function getName() {
    name = window.prompt('What is your name?', 'Enter Name')
    const data = {
      name: name,
    }
    $('#messages').append($('<li>').text(`${data.name} has joined your chat!`))
    socket.emit('new-chatter', data)
  }

  $('#input').on('keydown', (e) => {
    let now = new Date().getTime();
    console.log(now);
    if (now > timeLastTyping + 1000 && e.target.value !== '') {
      timeLastTyping = now;
      socket.emit('typing', name)
    }
  })

  async function typingTimeout() {
    setTimeout(() => {
      $("#status").text('')
    }, 1000)
  }
})