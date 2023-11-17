'use client'

import { Button } from '@mui/material'
import Link from 'next/link'
import { getCsrfToken, useSession, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import socket from '@/controllers/Socket'
import RoomDialog from '@/components/roomDialog'
import { useRouter } from 'next/navigation' 

export default function Home({ setRoom, setOrientation, setPlayers }: any) {

  const router = useRouter()
  const { data: session, status } = useSession()
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    if (status !== "authenticated") return

    socket.emit("username", session?.user?.name);

  }, [session, status])


  const handleNewOnlineGame = () => {
    socket.emit("createRoom", (r: any) => {
      console.log(r);
      setRoom(r);
      setOrientation("white");
    });
    router.push("/match/online")
  }

  const handleEnterGame = (roomInput: string) => {
    // join a room
    if (!roomInput) return; // if given room input is valid, do nothing.
    socket.emit("joinRoom", { roomId: roomInput }, (r: any) => {
      // r is the response from the server response set roomError to the error message and exit
      console.log("response:", r);
      setRoom(r?.roomId); // set room to the room ID
      setPlayers(r?.players); // set players array to the array of players in the room
      setOrientation("black"); // set orientation as black
    });
  }

  return (
    <>
      <main>
        <header className="bg-masterchess text-white text-center py-40 bg-home-image bg-cover bg-center bg-no-repeat bg-blend-overlay">
          <div className="container mx-auto">
            <h1 className="text-4xl font-extrabold mb-4">Bem-vindo ao MasterChess</h1>
            <p className="text-lg">O melhor lugar para jogar xadrez online e aprimorar suas habilidades.</p>
            <div>
              {status === "authenticated" ? (
                <>
                  <Button variant="text" className="mt-6 inline-block bg-masterchess-btns text-white rounded-full py-2 px-6 font-semibold transition hover:bg-masterchess-hover-btns mr-4" onClick={() => { handleNewOnlineGame() }}>
                    Criar sala
                  </Button>
                  <Button variant="text" className="mt-6 inline-block bg-masterchess-btns text-white rounded-full py-2 px-6 font-semibold transition hover:bg-masterchess-hover-btns mr-4" onClick={() => { setOpenDialog(!openDialog) }}>
                    Entrar em uma sala
                  </Button>
                  <Button variant="text" className="mt-6 inline-block bg-masterchess-btns text-white rounded-full py-2 px-6 font-semibold transition hover:bg-masterchess-hover-btns">
                    <Link href={"/match/computer/"}>Jogar contra o Computador</Link>
                  </Button>
                  <RoomDialog 
                    open={openDialog}
                    title="Entrar em uma sala"
                    contentText=''
                    handleContinue={(r) => { handleEnterGame(r); } }
                  />
                </>
              ) : (
                <>
                  <Button variant="text" className="mt-6 inline-block bg-masterchess-btns text-white rounded-full py-2 px-6 font-semibold transition hover:bg-masterchess-hover-btns mr-4">
                    <Link href={"/auth/login/"}>Login</Link>
                  </Button>
                  <Button variant="text" className="mt-6 inline-block bg-masterchess-btns text-white rounded-full py-2 px-6 font-semibold transition hover:bg-masterchess-hover-btns">
                    <Link href={"/auth/register/"}>Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <section className="p-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-8 text-white">Recursos em Destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg shadow-md bg-masterchess">
                <h3 className="text-xl font-semibold mb-4">Jogue com Amigos</h3>
                <p className="text-gray-300">Convide seus amigos para partidas emocionantes de xadrez online. Divirta-se e melhore suas habilidades juntos.</p>
              </div>

              <div className="p-6 rounded-lg shadow-md bg-masterchess">
                <h3 className="text-xl font-semibold mb-4">Treine com Desafios</h3>
                <p className="text-gray-300">Aprimore suas habilidades com uma variedade de desafios e quebra-cabeças de xadrez. Ganhe pontos e suba no ranking.</p>
              </div>

              <div className="p-6 rounded-lg shadow-md bg-masterchess">
                <h3 className="text-xl font-semibold mb-4">Participe de Torneios</h3>
                <p className="text-gray-300">Envolva-se em torneios emocionantes e prove que você é um mestre do xadrez. Ganhe prêmios e reconhecimento.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-masterchess text-white py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">Comece a jogar hoje mesmo!</h2>
            <p className="text-lg mb-6">Junte-se à comunidade de xadrez e experimente a emoção de jogar com jogadores de todo o mundo.</p>
            <Button variant="text" className="inline-block bg-masterchess-btns text-white rounded-full py-2 px-6 font-semibold transition hover:bg-masterchess-hover-btns">
              <Link href="/auth/register">Crie sua conta</Link>
            </Button>
          </div>
        </section>
      </main>

    </>
  )
}
