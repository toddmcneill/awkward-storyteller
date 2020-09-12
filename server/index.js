const ws = require('ws')
const { Player, broadcastToAll } = require('./player')
const { Room, findRoomByCode, formatRooms } = require('./room')

const port = 8080

const server = new ws.Server({port})
console.log(`server listening on port ${server.options.port}`)

server.on('connection', (socket) => {
  const player = new Player(socket)

  player.send({ event: 'room_list_updated', roomList: formatRooms() })

  socket.on('message', (message) => {
    let data
    try {
      data = JSON.parse(message)
    } catch (err) {
      console.error('message is not an object: ', message)
      return
    }
    console.log('data received: ', data)

    switch (data.command) {
      case 'create_room':
        createRoom(player)
        break

      case 'join_room':
        joinRoom(player, data.roomCode)
        break

      case 'leave_room':
        leaveRoom(player)
        break

      case 'set_player_name':
        setPlayerName(player, data.playerName)
        break

      default:
        console.error(`unknown command: ${data.command}`)
    }
  })
})

function createRoom(player) {
  const room = new Room(player)
  player.setRoom(room)
  player.send({ event: 'room_joined', roomCode: room.code })
  player.send({ event: 'player_list_updated', playerList: room.formatPlayerList() })
  broadcastToAll({ event: 'room_list_updated', roomList: formatRooms() })
}

function joinRoom(player, code) {
  const room = findRoomByCode(code)
  if (!room) {
    player.send({ event: 'room_not_found' })
    return
  }
  player.setRoom(room)
  room.addPlayer(player)
  player.send({ event: 'room_joined', roomCode: room.code })
  room.broadcast({ event: 'player_list_updated', playerList: room.formatPlayerList() })
}

function leaveRoom(player) {
  const room = player.room
  room.removePlayer(player)
  player.setRoom(null)
  player.send({ event: 'room_left' })
  room.broadcast({ event: 'player_list_updated', playerList: room.formatPlayerList() })
}

function setPlayerName(player, name) {
  player.setName(name)
  player.send({ event: 'player_updated', player: player.format() })
  if (player.room) {
    player.room.broadcast({ event: 'player_list_updated', playerList: player.room.formatPlayerList() })
  }
}
