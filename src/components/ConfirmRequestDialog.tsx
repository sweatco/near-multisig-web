import {
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  TextField,
} from '@mui/material'
import React, { FormEvent, useEffect, useState, useRef } from 'react'
import confirmRequest from '../actions/chain/confirmRequest'
import confirmRequestWithLedger from '../actions/chain/confirmRequestWithLedger'
import { useAppDispatch } from '../hooks/useApp'
import { ledgerManager } from '../utils/LedgerManager'

interface ConfirmRequestDialogProps {
  contractId: string
  requestId: number
  open: boolean
  onClose(result?: boolean | Error): void
}

const ConfirmRequestDialog: React.FC<ConfirmRequestDialogProps> = ({ open, onClose, contractId, requestId }) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [ledgerLoading, setLedgerLoading] = useState(false)
  const [key, setKey] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setKey('')
    }
  }, [open])

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionProps={{
          onEntered: handleDialogEnter,
        }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Confirm Request</DialogTitle>
          <DialogContent>
            <Button variant="contained" color="secondary" onClick={confirmWithLedger}>
              Confirm with Ledger
            </Button>
            <Divider sx={{ marginTop: 3 }} />
            <DialogContentText sx={{ paddingTop: 2 }}>
              Or confirm request by entering Seed Phrase or Private Key
            </DialogContentText>
            <TextField
              inputRef={inputRef}
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
      <Backdrop open={loading || ledgerLoading} sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
        <Stack direction="column" alignItems="center">
          <CircularProgress color="inherit" />
          {ledgerLoading ? (
            <Chip label="Follow Ledger's on-screen instructions" color="primary" sx={{ mt: 4 }} />
          ) : null}
        </Stack>
      </Backdrop>
    </>
  )

  function handleKeyChange(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value)
  }

  function handleClose() {
    onClose()
  }

  function handleDialogEnter() {
    if (inputRef.current != null) {
      inputRef.current.focus()
    }
  }

  async function confirmWithLedger() {
    setLedgerLoading(true)

    try {
      const result = await dispatch(confirmRequestWithLedger({ ledgerManager, contractId, requestId }))
      if (result.type === confirmRequest.rejected.type) {
        throw result.payload
      }
      onClose(typeof result.payload === 'string' ? true : result.payload)
    } catch (error: any) {
      onClose(error)
    } finally {
      ledgerManager.disconnect()
      setLedgerLoading(false)
    }
  }

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    setLoading(true)

    try {
      const result = await dispatch(confirmRequest({ key, contractId, requestId }))
      if (result.type === confirmRequest.rejected.type) {
        throw result.payload
      }
      onClose(typeof result.payload === 'string' ? true : result.payload)
    } catch (error: any) {
      onClose(error)
    } finally {
      setLoading(false)
    }
  }
}

export default ConfirmRequestDialog
