class Card {
  text = ''
  isPlayed = false
  isWild = false

  constructor(text) {
    if (text) {
      this.text = text
    } else {
      this.isWild = true
    }
  }

  playCard() {
    this.isPlayed = true
  }

  format() {
    return {
      text: this.text,
      isPlayed: this.isPlayed,
      isWild: this.isWild
    }
  }
}

module.exports = { Card }
