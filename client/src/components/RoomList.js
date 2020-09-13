import React, { useState, useEffect } from 'react'
import { registerHandler, unregisterHandler, events } from '../wsEvents'
import globalStyles from '../App.module.css'

export default function RoomList() {
  let [roomList, setRoomList] = useState([])

  useEffect(() => {
    const key = registerHandler(events.ROOM_LIST_UPDATED, ({ roomList }) => {
      setRoomList(roomList)
    })

    return () => {
      unregisterHandler(key)
    }
  }, [])

  function handleJoinRoom(code) {
    console.log('yay join room: ', code)
  }

  return <div>
    <div>Room List:</div>
    <ul>
      {roomList.map((room, i) => {
        return <li key={room.code}>
          <div className={globalStyles.button} onClick={() => handleJoinRoom(room.code)}>Join {room.code}</div>
        </li>
      })}
    </ul>
  </div>
}
