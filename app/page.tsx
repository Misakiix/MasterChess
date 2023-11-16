import { Button } from '@mui/material'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  return (
    <>
    <main>
        <header className="bg-[#202026] text-white text-center py-20">
          <div className="container mx-auto">
            <h1 className="text-4xl font-extrabold mb-4">Bem-vindo ao MasterChess</h1>
            <p className="text-lg">O melhor lugar para jogar xadrez online e aprimorar suas habilidades.</p>
            <Button variant="text" className="mt-6 inline-block bg-white text-gray-800 rounded-full py-2 px-6 font-semibold transition hover:bg-gray-200">
              <Link href={"/match/" + uuidv4()}>Comece a jogar</Link>
            </Button>
          </div>
        </header>

        <section className="p-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-8 text-white">Recursos em Destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg shadow-md bg-[#262632]">
                <h3 className="text-xl font-semibold mb-4">Jogue com Amigos</h3>
                <p className="text-gray-300">Convide seus amigos para partidas emocionantes de xadrez online. Divirta-se e melhore suas habilidades juntos.</p>
              </div>

              <div className="p-6 rounded-lg shadow-md bg-[#262632]">
                <h3 className="text-xl font-semibold mb-4">Treine com Desafios</h3>
                <p className="text-gray-300">Aprimore suas habilidades com uma variedade de desafios e quebra-cabeças de xadrez. Ganhe pontos e suba no ranking.</p>
              </div>

              <div className="p-6 rounded-lg shadow-md bg-[#262632]">
                <h3 className="text-xl font-semibold mb-4">Participe de Torneios</h3>
                <p className="text-gray-300">Envolva-se em torneios emocionantes e prove que você é um mestre do xadrez. Ganhe prêmios e reconhecimento.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#202026] text-white py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">Comece a jogar hoje mesmo!</h2>
            <p className="text-lg mb-6">Junte-se à comunidade de xadrez e experimente a emoção de jogar com jogadores de todo o mundo.</p>
            <Button variant="text" className="inline-block bg-white text-gray-800 rounded-full py-2 px-6 font-semibold transition hover:bg-gray-200">
              <Link href="">Crie sua conta</Link>
            </Button>
          </div>
        </section>
    </main>

    </>
  )
}
