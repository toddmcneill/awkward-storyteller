import React, { useState, useContext } from 'react'
import { SendMessageContext, Commands } from '../webSocket'
import styles from './PlayerName.module.css'

export default function PlayerName({ playerName }) {
  const [playerNameInput, setPlayerNameInput] = useState('')
  const [showInput, setShowInput] = useState(false)

  const sendMessage = useContext(SendMessageContext)

  function handlePlayerNameInput(e) {
    setPlayerNameInput(e.target.value)
  }

  function handleChangeClick() {
    setShowInput(true)
  }

  function handleNameSubmit() {
    setShowInput(false)
    sendMessage({
      command: Commands.SET_PLAYER_NAME,
      playerName: playerNameInput
    })
  }

  function handleKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault()
      handleNameSubmit()
    }
  }

  if (playerName && !showInput) {
    return <div>
      <div className={styles.nameDisplay} onClick={handleChangeClick}>Hello, {playerName}!</div>
    </div>
  } else {
    return (
      <div>
        <input
          type='text'
          className={styles.nameInput}
          onInput={handlePlayerNameInput}
          onKeyDown={handleKeyDown}
          onBlur={handleNameSubmit}
          placeholder='Enter your name'
        />
      </div>
    )
  }
}
