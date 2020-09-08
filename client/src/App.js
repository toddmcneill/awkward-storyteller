import React, {useEffect, useState, useRef} from 'react';

function App() {
  let ws = useRef()

  useEffect(() => {
    const protocol = 'ws'
    const host = 'localhost'
    const port = 8080

    if (!ws.current) {
      ws.current = new WebSocket(`${protocol}://${host}:${port}`)

      ws.current.onerror = () => console.log(`Websocket error`)
      ws.current.onopen = () => console.log(`Websocket connection established`)
      ws.current.onclose = () => console.log(`Websocket connection closed`)
      ws.current.onmessage = (event) => console.log('Websocket message received:', event.data)
    }
  })

  const [clicks, setClicks] = useState(0)

  const buttonClick = () => {
    setClicks(clicks + 1)
    ws.current.send(`clicked ${clicks} ${clicks > 1 ? 'times' : 'time'}`)
  }

  return (
    <div>
      <button onClick={buttonClick}>click me</button>
    </div>
  );
}

export default App;
