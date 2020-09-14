const fs = require('fs')
const { Card } = require('./card')

const prompts = fs.readFileSync('data/prompts.txt', 'UTF-8').split('\n')
const words = fs.readFileSync('data/words.txt', 'UTF-8').split('\n')

class Game {
  room
  isGameStarted = false
  storytellerIndex = 0
  isRoundStarted = false
  promptList
  prompt

  constructor(room) {
    this.room = room
    this.promptList = [...prompts]
  }

  start() {
    this.isGameStarted = true
    this.players = this.room.players

    // Shuffle player order.
    this.room.shufflePlayerOrder()

    // Reset the list of prompts.
    this.promptList = [...prompts]

    // Reset the storyteller index.
    this.storytellerIndex = 0

    this.dealCards()
  }

  dealCards() {
    let deck = this.buildDeck()

    // Deal cards to each player, one fewer than the number of players.
    this.room.players.forEach(player => {
      const cards = []
      for (let i = 0; i < this.room.players.length - 1; i++) {
        // Rebuild the deck if it's empty.
        if (!deck.length) {
          deck = this.buildDeck()
        }

        // Choose a random card.
        const cardIndex = Math.floor(Math.random() * deck.length)

        // Remove that card from the deck.
        const [ cardText ] = deck.splice(cardIndex, 1)

        // Create a card and give it to the player.
        cards.push(new Card(cardText))
      }
      player.setCards(cards)
    })
  }

  buildDeck() {
    // Build the desk, start with words.
    const deck = [...words]

    // Add one of each letter.
    for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++){
      deck.push(String.fromCharCode(i))
    }

    // Add 10 wild cards.
    for (let i = 0; i < 10; i++) {
      deck.push(null)
    }

    return deck
  }

  startRound() {
    this.isRoundStarted = true

    // Choose a random prompt.
    const promptIndex = Math.floor(Math.random() * this.promptList.length)

    // Remove that prompt from the list.
    const [ prompt ] = this.promptList.splice(promptIndex, 1)

    console.log({ promptIndex, prompt })

    this.prompt = prompt
  }

  format() {
    return {
      isGameStarted: this.isGameStarted,
      storyteller: this.room.players[this.storytellerIndex].format(),
      isRoundStarted: this.isRoundStarted,
      prompt: this.prompt,
    }
  }
}

module.exports = { Game }