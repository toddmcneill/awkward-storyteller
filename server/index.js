const ws = require('ws')

const port = 8080

const server = new ws.Server({port})
console.log(`server listening on port ${server.options.port}`)

server.on('connection', (socket) => {
  console.log('connection established')

  socket.send('hi from the server')

  socket.on('message', (message) => {
    console.log('message received: ', message)
  })
})