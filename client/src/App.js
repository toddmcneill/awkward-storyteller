import React, { useState, useEffect, useRef } from 'react'
import './App.module.css'
import { handleEvent } from './wsEvents'
import Chrome from './components/Chrome'
import PlayerName from './components/PlayerName'

function App() {
  let ws = useRef()

  let [socketConnected, setSocketConnected] = useState(false)
  let [roomList, setRoomList] = useState([])
  let [playerName, setPlayerName] = useState(null)
  let [roomCode, setRoomCode] = useState(null)
  let [playerList, setPlayerList] = useState([])

  useEffect(() => {
    const protocol = 'ws'
    const host = 'localhost'
    const port = 8080

    if (!ws.current) {
      ws.current = new WebSocket(`${protocol}://${host}:${port}`)

      ws.current.onerror = () => console.log(`Websocket error`)
      ws.current.onopen = () => {
        console.log(`Websocket connection established`)
        setSocketConnected(true)
      }
      ws.current.onclose = () => console.log(`Websocket connection closed`)
      ws.current.onmessage = (event) => {
        let data
        try {
          data = JSON.parse(event.data)
        } catch (err) {
          console.error('event.data is not an object: ', event.data)
          return
        }
        console.log('data received: ', data)

        handleEvent(data.event, data)

        switch (data.event) {
          case 'room_list_updated':
            setRoomList(data.roomList)
            break

          case 'room_joined':
            setRoomCode(data.roomCode)
            break

          case 'room_left':
            setRoomCode(null)
            break

          case 'player_updated':
            setPlayerName(data.player.name)
            break

          case 'player_list_updated':
            setPlayerList(data.playerList)
            break

          default:
            console.error(`unknown event: ${data.event}`)
        }
      }
    }

    return () => {
      ws.close()
    }
  }, [])

  function sendMessage(message, attempt = 0, maxAttempts = 5) {
    if (!socketConnected) {
      if (attempt < maxAttempts) {
        setTimeout(() => {
          sendMessage(message, attempt + 1, maxAttempts)
        }, 10 * attempt * attempt)
        return
      } else {
        throw new Error('socket connection timeout')
      }
    }

    ws.current.send(JSON.stringify(message))
  }

  function handleCreateRoom() {
    sendMessage({
      command: 'create_room'
    })
  }

  function handleJoinRoom(roomCode) {
    sendMessage({
      command: 'join_room',
      roomCode
    })
  }

  function handleLeaveRoom() {
    sendMessage({
      command: 'leave_room'
    })
  }

  function handlePlayerNameSubmit(newPlayerName) {
    sendMessage({
      command: 'set_player_name',
      playerName: newPlayerName
    })
  }

  let content

  if (!roomCode) {
    content = <>
      <button onClick={handleCreateRoom}>Create Room</button>
      <div>Room List:</div>
      <ul>
      {roomList.map((room, i) => {
        return <li key={i}><button onClick={() => handleJoinRoom(room.code)}>Join {room.code}</button></li>
      })}
      </ul>
    </>
  } else {
    content = <>
      <div>Room Code: {roomCode}</div>
      <button onClick={handleLeaveRoom}>Leave Room</button>
      <div>Player List:</div>
      <ul>
        {playerList.map((player, i) => <li key={i}>{player.name}</li>)}
      </ul>
    </>
  }

  return (
    <div>
      <Chrome roomList={roomList} playerName={playerName} roomCode={roomCode} playerList={playerList} />
      <PlayerName playerName={playerName} handleSubmit={handlePlayerNameSubmit} />
      {content}
    </div>
  )
}

export default App
