import React, { useContext } from 'react'
import { AppContext } from "../App";
import { SendMessageContext, Commands } from "../webSocket";
import styles from './RoomInfo.module.css'
import Button from './Button'

export default function RoomInfo() {
  const appState = useContext(AppContext)
  const sendMessage = useContext(SendMessageContext)

  function handleCreateRoom() {
    sendMessage({
      command: Commands.CREATE_ROOM
    })
  }

  function handleLeaveRoom() {
    sendMessage({
      command: Commands.LEAVE_ROOM
    })
  }

  if (!appState.roomCode) {
    return <Button onClick={handleCreateRoom}>Create Room</Button>
  }

  return <>
    <div className={styles.header}>
      <div className={styles.roomTitle}>Room <span className={styles.roomCode}>{appState.roomCode}</span></div>
      <Button onClick={handleLeaveRoom}>Leave</Button>
    </div>
    <ul>
      {appState.playerList.map((player, i) => <li key={i}>{player.name}</li>)}
    </ul>
  </>
}
