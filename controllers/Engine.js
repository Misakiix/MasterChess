class Engine {
  constructor() {
    if (typeof Worker !== 'undefined') {
      this.stockfish = new Worker(`${process.env.NEXT_PUBLIC_URL}/stockfish.worker.js`);
      this.onMessage = (callback) => {
        this.stockfish.addEventListener("message", (e) => {
          const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];
          callback({ bestMove });
        });
      };
      // Init engine
      this.sendMessage("uci");
      this.sendMessage("isready");
    } else return null
  }

  sendMessage(command) {
    this.stockfish.postMessage(command);
  }

  evaluatePosition(fen, depth) {
    this.sendMessage(`position fen ${fen}`);
    this.sendMessage(`go depth ${depth}`);
  }

  stop() {
    this.sendMessage("stop"); // Run when changing positions
  }

  quit() {
    this.sendMessage("quit"); // Good to run this before unmounting.
  }
}

export default Engine;