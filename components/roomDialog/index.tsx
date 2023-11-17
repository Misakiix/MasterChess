'use client'

import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

interface Dialog {
    open: boolean,
    title: string,
    contentText: string,
    handleContinue: (r: any) => void
}

export default function RoomDialog({ open, title, contentText, handleContinue }: Dialog) {

    const [roomInput, setRoomInput] = useState(''); // input state
    const [roomError, setRoomError] = useState('');

  return (
    <Dialog open={open}>
      <DialogTitle>{title ? title : "Fim de Jogo! Brancas ganham"}</DialogTitle>
      <DialogContent className="text-white">
        <DialogContentText className="text-white">
          {contentText ? contentText : "Fim de Jogo! Brancas ganham"}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="room"
          label="Room ID"
          name="room"
          value={roomInput}
          required
          onChange={(e) => setRoomInput(e.target.value)}
          type="text"
          fullWidth
          variant="standard"
          error={Boolean(roomError)}
          helperText={!roomError ? 'Enter a room ID' : `Invalid room ID: ${roomError}` }
          className="text-white"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { handleContinue(roomInput) }} className="inline-block bg-[#202026] text-white rounded-md py-2 px-6 font-semibold transition hover:bg-[#141416]">Continuar</Button>
      </DialogActions>
    </Dialog>
  );
}