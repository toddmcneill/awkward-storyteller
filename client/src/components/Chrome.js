import React from 'react'
import styles from './Chrome.module.css'
import Title from './Title'
import RoomList from './RoomList'

export default function Chrome({ roomList, playerName, roomCode, playerList }) {
  return <div className={styles.grid}>
    <div className={styles.header}><Title /></div>
    <div className={styles.roomList}><RoomList /></div>
    <div className={styles.playerName}>Player name</div>
    <div>C</div>
    <div>D</div>
    <div>E</div>
    <div className={styles.footer}>E</div>
  </div>
}
