import React, { useContext } from 'react'
import { SendMessageContext, Commands } from '../webSocket'
import Button from './Button'

export default function OwnerControls({ isRoundStarted }) {
  const sendMessage = useContext(SendMessageContext)

  function handleStartRound() {
    sendMessage(Commands.START_ROUND)
  }

  return <div>
    { !isRoundStarted && <Button onClick={handleStartRound}>Start Round</Button> }
  </div>
}