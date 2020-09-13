import React, { useContext } from 'react'
import { AppContext } from '../App'
import styles from './Chrome.module.css'
import Title from './Title'
import RoomSelection from './RoomSelection'
import PlayerName from "./PlayerName";
import RoomInfo from "./RoomInfo";

export default function Chrome() {
  const appState = useContext(AppContext)

  return <div className={styles.grid}>
    <div className={styles.header}><Title /></div>
    <div className={styles.main}>{
      appState.roomCode ?
        `In room: ${appState.roomCode}` :
        <RoomSelection />
    }</div>
    <div><PlayerName playerName={appState.playerName} /></div>
    <div><RoomInfo /></div>
    <div className={styles.footer}>Footer</div>
  </div>
}
