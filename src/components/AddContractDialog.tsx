import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import React, { FormEvent, useEffect, useState } from 'react'

interface AddContractDialogProps {
  open: boolean
  onClose(result?: string): void
}

const AddContractDialog: React.FC<AddContractDialogProps> = (props) => {
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (props.open) {
      setAddress('')
    }
  }, [props.open])

  return (
    <Dialog open={props.open} onClose={handleCancel}>
      <form onSubmit={handleClose}>
        <DialogTitle>Add MultiSig Contract</DialogTitle>
        <DialogContent>
          <DialogContentText>To add MultiSig contract, please enter its full on-chain address</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Contract Address"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleAddressChange}
            value={address}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit" disabled={address.length === 0}>
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )

  function handleAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAddress(event.target.value)
  }

  function handleCancel() {
    props.onClose()
  }

  function handleClose(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()

    if (address.length === 0) {
      return
    }

    props.onClose(address.length > 0 ? address : undefined)
  }
}

export default AddContractDialog
