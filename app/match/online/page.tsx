'use client'

import ChessGame from "@/controllers/Chess";
import { useEffect, useState, useCallback } from 'react'
import socket from '@/controllers/Socket'
import { getCsrfToken, useSession, signIn } from 'next-auth/react'

export default function OnlineMatch() {

  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState<any>([]);
  const { data: session, status } = useSession()

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers("");
  }, []);

  useEffect(() => {
    // const username = prompt("Username");
    // setUsername(username);
    // socket.emit("username", username);

    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData)
      setPlayers(roomData.players);
    });
  }, []);


  return (
    <>
      <div id="root">
        <ChessGame 
          room={room}
          orientation={orientation}
          username={session?.user?.name}
          players={players}
          // the cleanup function will be used by Game to reset the state when a game is over
          cleanup={cleanup}
          difficulty={0}
          computer={false}
        />
      </div>
    </>
  )
}
