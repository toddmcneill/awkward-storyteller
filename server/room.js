const rooms = []

class Room {
  code
  owner
  players

  constructor(player) {
    this.code = this.generateCode()
    this.owner = player
    this.players = [player]

    rooms.push(this)
  }

  addPlayer(player) {
    this.players.push(player)
  }

  removePlayer(player) {
    this.players.splice(this.players.findIndex(p => p === player), 1)

    // Set a new owner
    if (this.owner === player && this.players.length > 0) {
      this.owner = this.players[0]
    }
  }

  generateCode() {
    while (true) {
      // Generate a random 5-character string
      const code = Math.random().toString(36).substring(7)
      if (rooms.find(room => room.code === code)) {
        continue
      }
      return code
    }
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
