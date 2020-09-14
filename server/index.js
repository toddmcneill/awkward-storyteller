const ws = require('ws')
const { Player } = require('./player')
const { Room, findRoomByCode, formatOpenRooms } = require('./room')

const port = 8080
const server = new ws.Server({port})
console.log(`server listening on port ${server.options.port}`)

let playerId = 0;

server.on('connection', (socket) => {
  const player = new Player(socket, playerId++)

  // Give the player their id and a list of the rooms.
  player.send({ event: 'player_updated', player: player.format() })
  player.send({ event: 'room_list_updated', roomList: formatOpenRooms() })

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

      case 'start_game':
        startGame(player)
        break

      case 'start_round':
        startRound(player)
        break

      default:
        console.error(`unknown command: ${data.command}`)
    }
  })
})

function createRoom(player) {
  const room = new Room(player)
  player.joinRoom(room)
}

function joinRoom(player, code) {
  const room = findRoomByCode(code)
  player.joinRoom(room)
  room.addPlayer(player)
}

function leaveRoom(player) {
  const room = player.room
  room.removePlayer(player)
  player.leaveRoom()
}

function setPlayerName(player, name) {
  if (!name) {
    return
  }
  player.setName(name)
}

function startGame(player) {
  if (player.isOwner()) {
    player.room.startGame()
  }
}

function startRound(player) {
  if (player.isOwner()) {
    player.room.startRound()
  }
}
