import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import React, { FormEvent, useEffect, useState } from 'react'
import useSignRequest from '../hooks/useSignRequest'

interface ConfirmRequestDialogProps {
  contractId: string
  requestId: number
  open: boolean
  onClose(result?: boolean | Error): void
}

const ConfirmRequestDialog: React.FC<ConfirmRequestDialogProps> = ({ open, onClose, contractId, requestId }) => {
  const [loading, setLoading] = useState(false)
  const [key, setKey] = useState('')
  const sign = useSignRequest(contractId, requestId)

  useEffect(() => {
    if (open) {
      setKey('')
    }
  }, [open])

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Confirm Request</DialogTitle>
          <DialogContent>
            <DialogContentText>To confirm request, please enter Seed Phrase or Private Key</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Seed Phrase or Private Key"
              type="text"
              fullWidth
              variant="standard"
              autoComplete="off"
              onChange={handleKeyChange}
              value={key}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={key.length === 0}>
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )

  function handleKeyChange(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value)
  }

  function handleClose() {
    onClose()
  }

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    setLoading(true)

    try {
      const result = await sign(key)
      onClose(result)
    } catch (error: any) {
      onClose(error)
    } finally {
      setLoading(false)
    }
  }
}

export default ConfirmRequestDialog
