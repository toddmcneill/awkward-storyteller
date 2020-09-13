const { broadcastToNotInRoom } = require('./player')
const { Game } = require('./game')

const rooms = []

class Room {
  code
  owner
  players
  game

  constructor(player) {
    this.code = this.generateCode()
    this.owner = player
    this.players = [player]
    this.game = new Game(this)

    rooms.push(this)

    // Send the updated room list to all players not in a room.
    broadcastToNotInRoom({ event: 'room_list_updated', roomList: formatRooms() })
  }

  addPlayer(player) {
    this.players.push(player)

    // Notify others in this room that this player joined.
    this.broadcast({ event: 'player_list_updated', playerList: this.formatPlayerList() })
  }

  removePlayer(player) {
    this.players.splice(this.players.findIndex(p => p === player), 1)

    // Set a new owner.
    if (this.owner === player && this.players.length > 0) {
      this.owner = this.players[0]
    }

    // Notify others in this room that this player left.
    this.broadcast({ event: 'player_list_updated', playerList: this.formatPlayerList() })

    // Send the player the updated room list.
    player.send({ event: 'room_list_updated', roomList: formatRooms() })
  }

  generateCode() {
    while (true) {
      // Generate a short, random string
      const code = Math.random().toString(36).substring(7)
      if (rooms.find(room => room.code === code)) {
        continue
      }
      return code
    }
  }

  startGame() {
    this.game.start()
    this.broadcast({ event: 'game_state_updated', game: this.game.format() })
  }

  format() {
    return {
      code: this.code,
      players: this.formatPlayerList()
    }
  }

  formatPlayerList() {
    return this.players.map(player => player.format())
  }

  broadcast(message) {
    this.players.forEach(player => player.send(message))
  }
}

function findRoomByCode(code) {
  return rooms.find(room => room.code === code)
}

function formatRooms() {
  return rooms.map(room => room.format())
}

module.exports = { Room, findRoomByCode, formatRooms }
