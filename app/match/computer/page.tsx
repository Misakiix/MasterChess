'use client'

import ChessGame from "@/controllers/Chess";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@mui/material";
import { Howl } from "howler";

export default function ComputerMatch() {

    const [difficulty, setDifficulty] = useState<number>(2);

    useEffect(() => {
        gameStart.play()
    }, [])

    const gameStart = new Howl({
        src: [`${process.env.NEXT_PUBLIC_URL}/sounds/game-start.mp3`],
    });

    const handleDifficultyChange = (newDifficulty: number) => {
        setDifficulty(newDifficulty);
    };

    return (
        <>
            <div id="root" className="flex-col">
                <div className="mt-8">
                    <Button variant="text" className={`inline-block text-white ${difficulty === 2 ? 'bg-masterchess-btns' : 'bg-masterchess'} text-gray-800 rounded-full py-2 px-6 font-semibold transition hover:bg-masterchess-hover-btns mr-4`} onClick={() => { handleDifficultyChange(2) }}>
                        <p>Fácil</p>
                    </Button>
                    <Button variant="text" className={`inline-block text-white ${difficulty === 8 ? 'bg-masterchess-btns' : 'bg-masterchess'} text-gray-800 rounded-full py-2 px-6 font-semibold transition hover:bg-masterchess-hover-btns mr-4`} onClick={() => { handleDifficultyChange(8) }}>
                        <p>Médio</p>
                    </Button>
                    <Button variant="text" className={`inline-block text-white ${difficulty === 18 ? 'bg-masterchess-btns' : 'bg-masterchess'} text-gray-800 rounded-full py-2 px-6 font-semibold transition hover:bg-masterchess-hover-btns mr-4`} onClick={() => { handleDifficultyChange(18) }}>
                        <p>Difícil</p>
                    </Button>
                </div>
                <ChessGame
                    players=""
                    room=""
                    orientation=""
                    cleanup={() => {}}
                    username={""}
                    difficulty={difficulty}
                    computer={true}
                />
            </div>
        </>
    )
}
