'use client'

import ChessGame from "@/controllers/Chess";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from "@mui/material";
import { Howl } from "howler";

export default function ComputerMatch() {

    const workerRef = useRef<Worker>()

    useEffect(() => {

        if(!Worker) return

        workerRef.current = new Worker(`${process.env.NEXT_PUBLIC_URL}/stockfish.worker.js`);
        const DEPTH = 8; // number of halfmoves the engine looks ahead
        const FEN_POSITION =
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    
        workerRef.current.postMessage("uci");
        workerRef.current.postMessage(`position fen ${FEN_POSITION}`);
        workerRef.current.postMessage(`go depth ${DEPTH}`);
    
        workerRef.current.onmessage = (e) => {
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
