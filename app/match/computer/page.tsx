'use client'

import ChessGame from "@/controllers/Chess";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@mui/material";
import { Howl } from "howler";

export default function ComputerMatch() {

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
        

    useEffect(() => {
        gameStart.play()
    }, [])

    const gameStart = new Howl({
        src: [`${process.env.NEXT_PUBLIC_URL}/sounds/game-start.mp3`],
    });

    return (
        <>
            <div id="root" className="flex-col">
                <ChessGame
                    players=""
                    room=""
                    orientation=""
                    cleanup={() => {}}
                    username={""}
                    computer={true}
                />
            </div>
        </>
    )
}
