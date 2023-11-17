import Link from "next/link"

export default function Header() {
    return (
        <nav className="bg-masterchess-dark text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">MasterChess</Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-gray-300">Início</Link>
            <Link href="#" className="hover:text-gray-300">Sobre</Link>
            <Link href="#" className="hover:text-gray-300">Jogar</Link>
            <Link href="#" className="hover:text-gray-300">Contato</Link>
          </div>
        </div>
      </nav>
    )
}