const players = []

class Player {
  socket
  id
  name = 'Unknown Player'
  room

  constructor(socket, id) {
    this.socket = socket
    this.id = id
    players.push(this)
  }

  setName(name) {
    this.name = name

    // Send the player the updated name.
    this.send({ event: 'player_updated', player: this.format() })

    // Notify all others in the room of the updated name.
    if (this.room) {
      this.room.broadcast({ event: 'player_list_updated', playerList: this.room.formatPlayerList() })
    }
  }

  joinRoom(room) {
    this.room = room

    // Tell the player the room code they joined.
    this.send({ event: 'room_joined', roomCode: room.code })
    this.send({ event: 'player_list_updated', playerList: this.room.formatPlayerList() })
  }

  leaveRoom() {
    if (!this.room) {
      return
    }
    this.room = null

    // Tell the player they left.
    this.send({ event: 'room_left' })
  }

  isOwner() {
    if (!this.room) {
      return false
    }
    return this.room.owner === this
  }

  format() {
    return {
      id: this.id,
      name: this.name,
      isOwner: this.isOwner()
    }
  }

  send(message) {
    this.socket.send(JSON.stringify(message))
  }
}

function broadcastToNotInRoom(message) {
  players.forEach(player => {
    if (!player.room) {
      player.send(message)
    }
  })
}

module.exports = { Player, broadcastToNotInRoom }
