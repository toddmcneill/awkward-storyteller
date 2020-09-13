class Game {
  room
  isStarted = false

  constructor(room) {
    this.room = room
  }

  start() {
    this.isStarted = true
  }

  format() {
    return {
      isStarted: this.isStarted
    }
  }
}

module.exports = { Game }