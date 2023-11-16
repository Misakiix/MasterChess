'use client'

import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, PieceSymbol, Square } from "chess.js";
import MasterDialog from "@/components/dialog";

interface ChessGameProps {
  player: string;
  room: string;
  orientation: string;
}

interface moveData {
  from: string,
  to: string,
  color: string,
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

export default function ChessGame({ player, room, orientation }: ChessGameProps) {
  const chess = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chess.fen());
  const [over, setOver] = useState("");
  const [playerTime, setPlayerTime] = useState(180)
  const [opponentTime, setOpponentTime] = useState(180)
  const [pausedTimerPlayer, setPausedTimerPlayer] = useState(false)
  const [pausedTimerOpponent, setPausedTimerOpponent] = useState(false)


  // Controle de tempo
  useEffect(() => {
    let timer: any;

    timer = setInterval(() => {
      if (chess.turn() === 'w') {
        setPlayerTime((prevTime) => (prevTime > 0 ? prevTime - 1 : prevTime));
      } else {
        setOpponentTime((prevTime) => (prevTime > 0 ? prevTime - 1 : prevTime));
      }
    }, 1000);


    return () => clearInterval(timer);

  }, [chess, pausedTimerPlayer, pausedTimerOpponent]);

  const onDrop = (sourceSquare: Square, targetSquare: Square, piece: any) => {
    const moveData: moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: piece[1].toLowerCase() ?? "q",
    };

    const move = makeMove(moveData);

    // Movimento Ilegal
    if (move === null) return false;

    return true;
  }

  const makeMove = useCallback(
    (move: moveData) => {
      try {
        console.log(move)
        const result = chess.move(move); // Atualiza a instancia Chess

        if (chess.turn() === "w") {
          setPausedTimerOpponent(false);
          setPausedTimerPlayer(true);
        } else {
          setPausedTimerPlayer(false);
          setPausedTimerOpponent(true);
        }

        setFen(chess.fen()); // Atauliza o estado fen para ter um re-renderer


        if (chess.isGameOver()) { // Verifica se o movimento leva a um game over
          if (chess.isCheckmate()) { // Verifica se a razão para o gaver over é um checkmate
            // Seta a mensagem de checkmate. 
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "Pretos" : "Brancas"} ganham!`
            );
            // O vencedor é determinado vendo quem foi o ultimo a jogar
          } else if (chess.isDraw()) { // Verifica se foi um empate
            setOver("Empate!"); // Seta a mensagem para empate
          } else {
            setOver("Fim de jogo.");
          }
        }

        return result;
      } catch (e) {
        return null;
      } // Null se o movimento for ilegal
    },
    [chess]
  );

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

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white font-sans">
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
      />
    </div>
  );
}
