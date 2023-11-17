'use client'

import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import MasterDialog from "@/components/dialog";
import Engine from '@/controllers/Engine';
import { Howl } from "howler";
import socket from "@/controllers/Socket";

interface ChessGameProps {
  players: any;
  room: string;
  username: any;
  orientation: string;
  computer: boolean;
  difficulty: number;
  cleanup: () => void;
}

interface moveData {
  from: any,
  to: any,
  color: any,
  promotion: string
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const pieces = [
  "wP",
  "wN",
  "wB",
  "wR",
  "wQ",
  "wK",
  "bP",
  "bN",
  "bB",
  "bR",
  "bQ",
  "bK",
];

export default function ChessGame({ players, room, username, orientation, computer, difficulty, cleanup }: ChessGameProps) {
  const chess = useMemo(() => new Chess(), []);
  const engine = useMemo(() => new Engine(), []);
  const [fen, setFen] = useState(chess.fen());
  const [over, setOver] = useState("");
  const [playerTime, setPlayerTime] = useState(180)
  const [opponentTime, setOpponentTime] = useState(180)

  // Controle de tempo
  useEffect(() => {
    let timer: any;

    if (playerTime === 0 || opponentTime === 0) {
      
      clearInterval(timer);
      gameEnd.play();
      return setOver(`Fim de jogo! ${chess.turn() === "w" ? "Pretas" : "Brancas"} ganham!`)
    }

    timer = setInterval(() => {

      // Só startar o tempo depois da primeira jogada.
      // if(chess.history().length === 0) return

      if (chess.turn() === 'w') {
        setPlayerTime((prevTime) => (prevTime > 0 ? prevTime - 1 : prevTime));
      } else {
        setOpponentTime((prevTime) => (prevTime > 0 ? prevTime - 1 : prevTime));
      }
    }, 1000);


    return () => clearInterval(timer);

  }, [chess, playerTime, opponentTime]);


  const moveSound = new Howl({
    src: [`${process.env.NEXT_PUBLIC_URL}/sounds/move-self.mp3`],
  });

  const captureSound = new Howl({
    src: [`${process.env.NEXT_PUBLIC_URL}/sounds/capture.mp3`],
  });

  const checkSound = new Howl({
    src: [`${process.env.NEXT_PUBLIC_URL}/sounds/move-check.mp3`],
  });

  const illegalSound = new Howl({
    src: [`${process.env.NEXT_PUBLIC_URL}/sounds/illegal.mp3`],
  });

  const gameEnd = new Howl({
    src: [`${process.env.NEXT_PUBLIC_URL}/sounds/game-end.webm`]
  })

  const updateTime = (newTime: number) => {
    setOpponentTime(newTime);
    setPlayerTime(newTime);
  }


  const findBestMove = () => {

    if (!computer) return

    engine.evaluatePosition(chess.fen(), difficulty);
    engine.onMessage(({ bestMove }: any) => {

      if (!bestMove) return

      const moveData: moveData = {
        from: bestMove.substring(0, 2),
        to: bestMove.substring(2, 4),
        color: chess.turn(),
        promotion: bestMove.substring(4, 5) ?? "q",
      };

      if (bestMove) {
        const move = makeMove(moveData);

        // Movimento Ilegal
        if (move === null) {
          return false
        };

        return true;

      }
    });
  }

  const onDrop = (sourceSquare: Square, targetSquare: Square, piece: any) => {

    if (chess.turn() !== orientation[0] && !computer) return false; 
    if (players.length < 2 && !computer) return false;
    
    const moveData: moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: piece[1].toLowerCase() ?? "q",
    };

    const move = makeMove(moveData);

    // Movimento Ilegal
    if (move === null) {
      illegalSound.play()
      return false
    };

    if(!computer) {
      socket.emit("move", { // <- 3 emit a move event.
        move,
        room,
      }); // this event will be transmitted to the opponent via the server
    }

    if (computer) {
      findBestMove();
    }

    return true;
  }
  

  const makeMove = useCallback(
    (move: moveData) => {
      try {
        console.log(move)
        const result = chess.move(move); // Atualiza a instancia Chess

        setFen(chess.fen()); // Atauliza o estado fen para ter um re-renderer


        if (chess.isGameOver()) { // Verifica se o movimento leva a um game over
          if (chess.isCheckmate()) { // Verifica se a razão para o gaver over é um checkmate
            // Seta a mensagem de checkmate. 
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "Pretas" : "Brancas"} ganham!`
            );
            gameEnd.play();
            // O vencedor é determinado vendo quem foi o ultimo a jogar
          } else if (chess.isDraw()) { // Verifica se foi um empate
            setOver("Empate!"); // Seta a mensagem para empate
            gameEnd.play();
          } else {
            setOver("Fim de jogo.");
            gameEnd.play();
          }
        }

        if(chess.isCheck()) {
          checkSound.play();
        } else if(result?.captured) {
          captureSound.play();
        } else {
          moveSound.play();
        }

        return result;
      } catch (e) {
        return null;
      } // Null se o movimento for ilegal
    },
    [chess]
  );

  useEffect(() => {

    if(computer) return

    socket.on("move", (move) => {
      makeMove(move); //
    });
  }, [makeMove]);

  const customPieces = useMemo(() => {
    const pieceComponents: any = {};
    pieces.forEach((piece: string) => {
      pieceComponents[piece] = ({ squareWidth }: any) => (
        <div
          style={{
            width: "65.875px",
            height: "65.875px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: squareWidth - 15,
              height: squareWidth - 15,
              backgroundImage: `url(/pieces/${piece}.svg)`,
              backgroundSize: "100%",
            }}
          />
        </div>
      );
    });
    return pieceComponents;
  }, []);


  const resetGame = useCallback(() => {
    chess.reset();
    setOver("");
    updateTime(180) // Altera um estado que não é usado para forçar a atualização
  }, [chess]);


  return (
    <div className="bg-masterchess mt-4 min-h-screen flex flex-col items-center justify-center text-white font-sans">
      <div className="board w-full max-w-screen-lg p-4 bg-gray-700 shadow-lg rounded-lg">
        <div className="flex justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">JD</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">John Doe</h2>
              <p className="text-sm text-gray-500">Rating: 1500</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">JD</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Jane Doe</h2>
              <p className="text-sm text-gray-500">Rating: 1600</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="text-lg font-semibold">
            Tempo do Jogador: {formatTime(playerTime)}
          </div>
          <div className="text-lg font-semibold">
            Tempo do Oponente: {formatTime(opponentTime)}
          </div>
        </div>
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          customArrowColor="darkred"
          customDarkSquareStyle={{ backgroundColor: "#b7c0d8" }}
          customLightSquareStyle={{ backgroundColor: "#e8edf9" }}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
          customPieces={customPieces}
          boardWidth={517}
          arePremovesAllowed
          promotionDialogVariant={"vertical"}
        />
      </div>
      <MasterDialog
        open={Boolean(over)}
        title={over}
        children=""
        contentText={over}
        handleContinue={() => {
          setOver("");
        }}
        handleNewGame={() => {
          resetGame();
        }}
      />
    </div>
  );
}
