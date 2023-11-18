'use client'

import ChessGame from "@/controllers/Chess";
import { useEffect, useState, useCallback } from 'react'
import { getCsrfToken, useSession, signIn } from 'next-auth/react'

export default function OnlineMatch() {

  const { data: session, status } = useSession()

  return (
    <>
      <div id="root">
        <ChessGame 
          room={""}
          orientation={""}
          username={""}
          players={""}
          // the cleanup function will be used by Game to reset the state when a game is over
          cleanup={() => {}}
          difficulty={0}
          computer={false}
        />
      </div>
    </>
  )
}
