import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import React, { FormEvent, useEffect, useRef, useState } from 'react'

interface AddFungibleTokenDialogProps {
  open: boolean
  onClose(result?: string): void
}

const AddFungibleTokenDialog: React.FC<AddFungibleTokenDialogProps> = (props) => {
  const [token, setToken] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props.open) {
      setToken('')
    }
  }, [props.open])

  return (
    <Dialog
      open={props.open}
      onClose={handleCancel}
      TransitionProps={{
        onEntered: handleDialogEnter,
      }}>
      <form onSubmit={handleClose}>
        <DialogTitle>Add Fungible Token</DialogTitle>
        <DialogContent>
          <DialogContentText>To add Fungible Token, please enter its full on-chain address</DialogContentText>
          <TextField
            inputRef={inputRef}
            margin="dense"
            label="Contract Address"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleAddressChange}
            value={token}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit" disabled={token.length === 0}>
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )

  function handleAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setToken(event.target.value)
  }

  function handleCancel() {
    props.onClose()
  }

  function handleDialogEnter() {
    if (inputRef.current != null) {
      inputRef.current.focus()
    }
  }

  function handleClose(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()

    if (token.length === 0) {
      return
    }

    props.onClose(token.length > 0 ? token : undefined)
  }
}

export default AddFungibleTokenDialog
