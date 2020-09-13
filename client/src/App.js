import React, { useState, useEffect, useRef } from 'react'
import './App.module.css'
import { SendMessageContext, handleEvent, Events, registerHandler, unregisterHandler } from './webSocket'
import Chrome from './components/Chrome'

export const AppContext = React.createContext()

function App() {
  let ws = useRef()

  let [socketConnected, setSocketConnected] = useState(false)
  let [roomList, setRoomList] = useState([])
  let [playerId, setPlayerId] = useState(null)
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
      ws.current.onopen = () => setSocketConnected(true)
      ws.current.onclose = () => console.log(`Websocket connection closed`)
      ws.current.onmessage = (event) => {
        // Parse the event.
        let data
        try {
          data = JSON.parse(event.data)
        } catch (err) {
          console.error('event.data is not an object: ', event.data)
          return
        }

        // Ensure the event is valid.
        if (!Object.values(Events).includes(data.event)) {
          console.error(`unknown event: ${data.event}`)
          return
        }

        // Handle the event.
        console.log('data received: ', data)
        handleEvent(data.event, data)
      }
    }

    return () => {
      ws.close()
    }
  }, [])

  useEffect(() => {
    const keys = [
      registerHandler(Events.ROOM_LIST_UPDATED, ({ roomList }) => {
        setRoomList(roomList)
      }),
      registerHandler(Events.ROOM_JOINED, (data) => {
        setRoomCode(data.roomCode)
      }),
      registerHandler(Events.ROOM_LEFT, () => {
        setRoomCode(null)
        setPlayerList([])
      }),
      registerHandler(Events.PLAYER_UPDATED, (data) => {
        setPlayerId(data.player.id)
        setPlayerName(data.player.name)
      }),
      registerHandler(Events.PLAYER_LIST_UPDATED, (data) => {
        setPlayerList(data.playerList)
      })
    ]

    return () => {
      keys.map(key => unregisterHandler(key))
    }
  }, [])

  function sendMessage(command, message, attempt = 0, maxAttempts = 5) {
    if (!socketConnected) {
      if (attempt < maxAttempts) {
        setTimeout(() => {
          sendMessage(command, message, attempt + 1, maxAttempts)
        }, 10 * attempt * attempt)
        return
      } else {
        throw new Error('socket connection timeout')
      }
    }

    ws.current.send(JSON.stringify({ command, ...message }))
  }

  const appState = {
    playerId,
    playerName,
    roomList,
    roomCode,
    playerList
  }

  return (
    <AppContext.Provider value={appState}>
      <SendMessageContext.Provider value={sendMessage}>
        <Chrome />
      </SendMessageContext.Provider>
    </AppContext.Provider>
  )
}

export default App
