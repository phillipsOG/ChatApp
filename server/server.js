const https = require('https');
const fs = require('fs');
var express = require('express');
const cors = require("cors");
var app = express()
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/lumidev.ddns.net/privkey.pem'), //ssl key
  cert: fs.readFileSync('/etc/letsencrypt/live/lumidev.ddns.net/fullchain.pem') //ssl certificate
}; 

var port = 5000;
const server = require('https').createServer(options, app).listen(port, function () {
  console.log('CORS-enabled web server listening securely through SSL on port:' + port)
})

const io = require("socket.io")(server, { secure: true,
  path: '/mysockets/',
  cors: {
    origin: "https://lumidev.ddns.net:5000", //used to be http://lumidev.ddns.net:5000
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients, sender: id, text
      })
    })
  })
})

/*
const io = require('socket.io')(5000)

io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients, sender: id, text
      })
    })
  })
})
*/