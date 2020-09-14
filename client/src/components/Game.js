import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../App'
import { SendMessageContext, Events, Commands, registerHandler, unregisterHandler } from '../webSocket'
import Button from './Button'
import OwnerControls from './OwnerControls'
import Prompt from './Prompt'
import CardList from './CardList'
import styles from './Game.module.css'

export default function Game() {
  const [ isGameStarted, setIsGameStarted ] = useState(false)
  const [ isRoundStarted, setIsRoundStarted ] = useState(false)
  const [ storyteller, setStoryteller ] = useState(null)
  const [ cards, setCards ] = useState([])
  const [ prompt, setPrompt ] = useState('')

  const appState = useContext(AppContext)
  const sendMessage = useContext(SendMessageContext)

  useEffect(() => {
    const keys = [
      registerHandler(Events.GAME_STATE_UPDATED, ({ game }) => {
        setIsGameStarted(game.isGameStarted)
        setIsRoundStarted(game.isRoundStarted)
        setStoryteller(game.storyteller)
        setPrompt(game.prompt)
      }),
      registerHandler(Events.CARD_LIST_UPDATED, ({ cards }) => {
        setCards(cards)
      }),
      registerHandler(Events.PLAYER_LIST_UPDATED, ({ playerList }) => {
        if (storyteller) {
          setStoryteller(playerList.find(player => player.id === storyteller.id))
        }
      })
    ]

    return () => {
      keys.map(key => unregisterHandler(key))
    }
  }, [appState.playerList, storyteller])

  function isOwner() {
    const owner = appState.playerList.find(player => player.isOwner)
    if (!owner) {
      return false
    }
    return owner.id === appState.playerId
  }

  function isStoryteller() {
    if (!storyteller) {
      return false
    }

    return storyteller.id === appState.playerId
  }

  function handleStartClick() {
    sendMessage(Commands.START_GAME)
  }

  if (!isGameStarted) {
    if (isOwner()) {
      return <Button onClick={handleStartClick}>Start Game</Button>
    } else {
      return 'Waiting for the owner to start the game'
    }
  } else {
    return <div>
      {isOwner() && <div className={styles.ownerControlsArea}>
        <OwnerControls isRoundStarted={isRoundStarted} />
      </div>}
      {
        storyteller && <div>Storyteller: {
          isStoryteller() ? 'You!' : storyteller.name
        }</div>
      }
      <div className={styles.promptArea}>
        <Prompt prompt={prompt} />
      </div>
      <CardList cards={cards} />
    </div>
  }
}
