import React, { useState } from 'react';

export default function PlayerName({ playerName, handleSubmit }) {
  const [playerNameInput, setPlayerNameInput] = useState('')
  const [showInput, setShowInput] = useState(false)

  function handlePlayerNameInput(e) {
    setPlayerNameInput(e.target.value)
  }

  function handleChangeClick() {
    setShowInput(true)
  }

  function handleNameSubmit() {
    setShowInput(false)
    handleSubmit(playerNameInput)
  }

  if (playerName && !showInput) {
    return <div>
      <div>You are: {playerName}</div>
      <button onClick={handleChangeClick}>Change</button>
    </div>
  } else {
    return (
      <div>
        <span>Enter your name:</span>
        <input type='text' onInput={handlePlayerNameInput} />
        <button onClick={handleNameSubmit}>Submit</button>
      </div>
    )
  }
}
