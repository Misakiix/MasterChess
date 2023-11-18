'use client'

import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import MasterDialog from "@/components/dialog";
import Engine from '@/controllers/Engine';
import { Howl } from "howler";
import Avatar from '@mui/material/Avatar';
import FlagIcon from '@mui/icons-material/Flag';
import CloseIcon from '@mui/icons-material/Close';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import Button from '@mui/material/Button';

interface ChessGameProps {
  players: any;
  room: string;
  username: any;
  orientation: string;
  computer: boolean;
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

export default function ChessGame({ players, room, username, orientation, computer, cleanup }: ChessGameProps) {
  const chess = useMemo(() => new Chess(), []);
  const engine = useMemo(() => new Engine(), []);
  const [fen, setFen] = useState(chess.fen());
  const [over, setOver] = useState("");
  const [playerTime, setPlayerTime] = useState(180)
  const [opponentTime, setOpponentTime] = useState(180)
  const [difficulty, setDifficulty] = useState(2)

  // Controle de tempo
  useEffect(() => {
    let timer: any;

    if (playerTime === 0 || opponentTime === 0) {

      clearInterval(timer);
      gameEnd.play();
      return setOver(`Fim de jogo! ${chess.turn() === "w" ? "Pretas" : "Brancas"} ganham!`)
    }

    timer = setInterval(() => {

      // Só startar o tempo depois da segunda jogada.
      if(chess.history().length === 1) return

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

    if (!computer) {
      //Handle Online move
    } else {
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

        if (chess.isCheck()) {
          checkSound.play();
        } else if (result?.captured) {
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
    setFen(chess.fen());
    setOver("");
    updateTime(180) // Altera um estado que não é usado para forçar a atualização
  }, [chess]);

  const formatarHistorico = () => {
    const jogadasFormatadas = [];
    let historicoJogadas = chess.history();

    for (let i = 0; i < historicoJogadas.length; i += 2) {
      const jogadaBrancas = historicoJogadas[i];
      const jogadaPretas = historicoJogadas[i + 1];

      const numeroJogada = i / 2 + 1;

      jogadasFormatadas.push(
        <div key={i + 1} className="flex justify-between">
          <span className="text-[#5f5f5f] font-bold text-lg w-3/6">{numeroJogada}.</span>
          <p className="text-white font-bold text-lg w-full text-center bg-[#383635]">{jogadaBrancas}</p>
          {jogadaPretas && <p className="text-white font-bold text-lg w-full text-center bg-[#383635]">{jogadaPretas}</p>}
        </div>
      );
    }



    return jogadasFormatadas.length > 0 ? jogadasFormatadas : <p className="font-bold text-sm">Esperando primeiro lance...</p>;
  };


  console.log(chess.history())

  return (

    <div className="bg-masterchess mt-4 min-h-screen flex items-center justify-center text-white font-sans board w-3/5 max-w-screen-lg p-4 shadow-lg rounded-lg flex-row">
      <div>
        <div className="mb-4">
          <div className="flex items-center space-x-4 justify-between">
            <div className="flex">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <Avatar alt="Misakiix" src="https://cdn.discordapp.com/avatars/465329875792691201/e83b577fe61760fe56d0c5e6cc144cc4.png?size=1024" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">Misakiix</h2>
                <p className="text-sm text-gray-500">Rating: 1500</p>
              </div>
            </div>
            <div className={`${chess.turn() === "b" ? `bg-masterchess-secondary` : `bg-gray-500`} p-1 w-28 text-right rounded-sm`}>
              <p className={`text-white text-lg font-bold`}>{formatTime(opponentTime)}</p>
            </div>
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
          boardWidth={500}
          arePremovesAllowed
          promotionDialogVariant={"vertical"}
        />
        <div className="mt-4">
          <div className="flex items-center space-x-4 justify-between">
            <div className="flex">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <Avatar alt="Ikasim" src="https://i.redd.it/lrvy17zucsm51.jpg" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">Ikasim</h2>
                <p className="text-sm text-gray-500">Rating: 1500</p>
              </div>
            </div>
            <div className={`${chess.turn() === "w" ? `bg-masterchess-secondary` : `bg-gray-500`} p-1 w-28 text-right rounded-sm`}>
              <p className={`text-white text-lg font-bold`}>{formatTime(playerTime)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-masterchess-dark text-white p-4 ml-4 h-full rounded-md">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Lances</h2>
          <div className="overflow-scroll h-[150px] overflow-x-auto max-w-screen-xl mx-auto">
            {formatarHistorico()}
          </div>
        </div>
        {computer && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Dificuldade</h2>
            <div className="flex justify-between items-center">
              <Button variant="text" aria-label="Fácil" className={`${difficulty === 2 ? `bg-masterchess-secondary` : `bg-gray-600`} text-white font-bold`} onClick={() => { setDifficulty(2) }}>
                Fácil
              </Button>
              <Button variant="text" aria-label="Médio" className={`${difficulty === 8 ? `bg-masterchess-secondary` : `bg-gray-600`} text-white font-bold`} onClick={() => { setDifficulty(8) }}>
                Médio
              </Button>
              <Button variant="text" aria-label="Difícil" className={`${difficulty === 18 ? `bg-masterchess-secondary` : `bg-gray-600`} text-white font-bold`} onClick={() => { setDifficulty(18) }}>
                Difícil
              </Button>
            </div>
          </div>
        )}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Opções</h2>
          <div className="flex justify-between items-center">
            <Button variant="text" aria-label="Render-se" className="bg-masterchess-secondary text-white">
              <FlagIcon />
            </Button>
            <Button variant="text" aria-label="Propor Empate" className="bg-masterchess-secondary text-white">
              <StarHalfIcon />
            </Button>
            <Button variant="text" aria-label="Cancelar partida" className="bg-masterchess-secondary text-white">
              <CloseIcon />
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Chat</h2>
          <div className="w-full h-[190px]">

          </div>
          <form>
            <input type="text" placeholder="Digite um comentário" className="rounded-sm indent-2 w-full h-[40px] text-white bg-masterchess-dark outline-none" />
          </form>
        </div>
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
