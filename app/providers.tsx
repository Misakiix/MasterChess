'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useEffect } from 'react'
import Footer from "@/components/footer"
import Header from "@/components/header"
import { SessionProvider } from "next-auth/react"

const Providers = ({ children, session }: any) => {

  useEffect(() => {
    const stockfish = new Worker(`${process.env.NEXT_PUBLIC_URL}/stockfish.js`);
    const DEPTH = 8; // number of halfmoves the engine looks ahead
    const FEN_POSITION =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    stockfish.postMessage("uci");
    stockfish.postMessage(`position fen ${FEN_POSITION}`);
    stockfish.postMessage(`go depth ${DEPTH}`);

    stockfish.onmessage = (e) => {
      console.log(e.data); // in the console output you will see `bestmove e2e4` message
    };
  }, []);


  return (
    <>
      <SessionProvider session={session}>
        <Header />
        {children}
        <Footer />
        <ProgressBar
          height="4px"
          color="#7C3AED"
          options={{ showSpinner: true }}
          shallowRouting
        />
      </SessionProvider>
    </>
  );
};

export default Providers;