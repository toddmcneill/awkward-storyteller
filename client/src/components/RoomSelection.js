import React, { useContext } from 'react'
import { SendMessageContext, Commands } from '../webSocket'
import { AppContext } from "../App";
import Button from './Button'
import styles from './RoomSelection.module.css'

export default function RoomSelection() {
  const appState = useContext(AppContext)

  const sendMessage = useContext(SendMessageContext)

  function handleJoinRoom(code) {
    sendMessage(Commands.JOIN_ROOM, { roomCode: code })
  }

  return <div>
    <ul>
      {appState.roomList.map((room, i) => {
        return <li key={room.code} className={styles.item}>
          <Button onClick={() => handleJoinRoom(room.code)}>Join {room.code}</Button>
        </li>
      })}
    </ul>
  </div>
}
