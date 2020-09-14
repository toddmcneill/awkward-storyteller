import React, { useContext } from 'react'
import { AppContext } from "../App";
import { SendMessageContext, Commands } from "../webSocket";
import styles from './RoomInfo.module.css'
import Button from './Button'

export default function RoomInfo() {
  const appState = useContext(AppContext)
  const sendMessage = useContext(SendMessageContext)

  function handleCreateRoom() {
    sendMessage(Commands.CREATE_ROOM)
  }

  function handleLeaveRoom() {
    sendMessage(Commands.LEAVE_ROOM)
  }

  if (!appState.roomCode) {
    return <Button onClick={handleCreateRoom}>Create Room</Button>
  }

  return <>
    <div className={styles.header}>
      <div className={styles.roomTitle}>Room: <span className={styles.roomCode}>{appState.roomCode}</span></div>
      <Button onClick={handleLeaveRoom}>Leave</Button>
    </div>
    <ul>
      {appState.playerList.map((player, i) => <li
        key={i}
        className={player.id === appState.playerId ? styles.self : undefined}
      >
        {player.name}
        {player.isOwner && '⭐'}
      </li>)}
    </ul>
  </>
}
