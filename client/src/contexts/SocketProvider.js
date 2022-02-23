import React, { useContext, useEffect, useState } from 'react'
import * as io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}
export function SocketProvider({ id, children }) {
  const [socket, setSocket] = useState()
  
  useEffect(() => {
    const newSocket = io('https://lumidev.ddns.net:5000', { secure: true,  //used to be http://lumidev.ddns.net:5000
        path: '/mysockets/',
        withCredentials: true,
        extraHeaders: {
        "my-custom-header": "abcd"
      },
      query: { id } }
    )
    setSocket(newSocket)

    return () => newSocket.close()
  }, [id])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}