import ChessGame from "@/controllers/Chess";

export default function Home() {
  return (
    <>
      <div id="root">
        <ChessGame 
          player=""
          room=""
          orientation=""
        />
      </div>
    </>
  )
}
