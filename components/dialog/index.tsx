import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Dialog {
    open: boolean,
    children: any,
    title: string,
    contentText: string,
    handleContinue: () => void
    handleNewGame: () => void
}

export default function MasterDialog({ open, children, title, contentText, handleContinue, handleNewGame }: Dialog) {
  return (
    <Dialog open={open}>
      <DialogTitle>{title ? title : "Fim de Jogo! Brancas ganham"}</DialogTitle>
      <DialogContent className="text-white">
        <DialogContentText className="text-white">
          {contentText ? contentText : "Fim de Jogo! Brancas ganham"}
        </DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNewGame} className="inline-block bg-[#202026] text-white rounded-md py-2 px-6 font-semibold transition hover:bg-[#141416]">Novo Jogo</Button>
        <Button onClick={handleContinue} className="inline-block bg-[#202026] text-white rounded-md py-2 px-6 font-semibold transition hover:bg-[#141416]">Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}