import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../App'
import { SendMessageContext, Events, Commands, registerHandler, unregisterHandler } from '../webSocket'
import Button from './Button'

export default function Game() {
  const [ isStarted, setIsStarted ] = useState(false)

  const appState = useContext(AppContext)
  const sendMessage = useContext(SendMessageContext)

  useEffect(() => {
    const keys = [
      registerHandler(Events.GAME_STATE_UPDATED, ({ game }) => {
        setIsStarted(game.isStarted)
      })
    ]

    return () => {
      keys.map(key => unregisterHandler(key))
    }
  }, [])

  function isOwner() {
    const owner = appState.playerList.find(player => player.isOwner)
    if (!owner) {
      return false
    }
    return owner.id === appState.playerId
  }

  function handleStartClick() {
    sendMessage(Commands.START_GAME)
  }

  if (!isStarted) {
    if (isOwner()) {
      return <Button onClick={handleStartClick}>Start Game</Button>
    } else {
      return 'Waiting for the owner to start the game'
    }
  } else {
    return 'game is started'
  }
}
