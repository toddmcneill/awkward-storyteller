const players = []

class Player {
  socket
  name = 'Unknown Player'
  room

  constructor(socket) {
    this.socket = socket
    players.push(this)
  }

  setName(name) {
    this.name = name
  }

  setRoom(room) {
    this.room = room
  }

  format() {
    return {
      name: this.name
    }
  }

  send(message) {
    this.socket.send(JSON.stringify(message))
  }
}

function broadcastToAll(message) {
  players.forEach(player => player.send(message))
}

module.exports = { Player, broadcastToAll }
