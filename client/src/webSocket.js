import React from 'react'

export const SendMessageContext = React.createContext()

const handlers = {}
let key = 0

export function registerHandler(event, handler) {
  if (!(event in handlers)) {
    handlers[event] = []
  }
  handlers[event].push({
    key: key++,
    callback: handler
  })
  return key
}

export function unregisterHandler(key) {
  for (let event in handlers) {
    const callbacks = handlers[event]
    for (let i = 0; i < callbacks.length; i++) {
      if (callbacks[i].key === key) {
        // Remove the handler from the list.
        callbacks.splice(i, 1)

        // Remove the event if there are no other handlers.
        if (!callbacks.length) {
          delete handlers[event]
        }
      }
    }
  }
}

export function handleEvent(event, data) {
  if (!(event in handlers)) {
    return
  }

  handlers[event].forEach(handler => {
    handler.callback(data)
  })
}

export const Events = {
  ROOM_LIST_UPDATED: 'room_list_updated',
  ROOM_JOINED: 'room_joined',
  ROOM_LEFT: 'room_left',
  PLAYER_UPDATED: 'player_updated',
  PLAYER_LIST_UPDATED: 'player_list_updated',
  GAME_STATE_UPDATED: 'game_state_updated',
}

export const Commands = {
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  SET_PLAYER_NAME: 'set_player_name',
  START_GAME: 'start_game',
}
