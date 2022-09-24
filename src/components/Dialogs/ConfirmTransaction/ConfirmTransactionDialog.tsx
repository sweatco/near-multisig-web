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
import { useAppDispatch, useAppSelector } from '../../../hooks/useApp'
import { contractSelectors } from '../../../reducers/contracts'
import { contractsActions } from '../../../reducers/contracts/reducer'
import { ledgerManager } from '../../../utils/LedgerManager'
import { ConfirmTransactionOptions } from './ConfirmTransactionContext'

interface ConfirmTransactionDialogProps extends Partial<ConfirmTransactionOptions> {
  open: boolean
  onResult(result: boolean): void
  onFail(error: string): void
  onClose(): void
}

const ConfirmTransactionDialog: React.FC<ConfirmTransactionDialogProps> = ({
  title,
  open,
  contractId,
  onResult,
  onFail,
  onClose,
  onConfirmWithKey,
  onConfirmWithLedger,
}) => {
  const [loading, setLoading] = useState(false)
  const [ledgerLoading, setLedgerLoading] = useState(false)
  const [key, setKey] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const dispath = useAppDispatch()
  const ledgerPathValue = useAppSelector((state) =>
    contractId ? contractSelectors.getLedgerPath(state, contractId) : undefined
  )
  const [ledgerPath, setLedgerPath] = useState(1)

  useEffect(() => {
    if (open) {
      setKey('')
    }
  }, [open])

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionProps={{
          onEntered: handleDialogEnter,
        }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{title ?? 'Confirm Transaction'}</DialogTitle>
          <DialogContent>
            <Stack direction="row" spacing={2} mt={1} mb={4}>
              <Button variant="contained" color="secondary" onClick={confirmWithLedger}>
                Confirm with Ledger
              </Button>
              <TextField
                value={ledgerPathValue ?? ledgerPath}
                onChange={handleLedgerPathChange}
                label="Path"
                type="number"
                autoComplete="off"
                sx={{ width: '4em' }}
              />
            </Stack>
            <Divider sx={{ marginTop: 3 }} />
            <DialogContentText sx={{ paddingTop: 2 }}>
              Or confirm by entering Seed Phrase or Private Key
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

  function handleLedgerPathChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value)
    if (!isNaN(value)) {
      if (contractId) {
        dispath(contractsActions.setLedgerPath({ contract_id: contractId, path: value }))
      } else {
        setLedgerPath(value)
      }
    }
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
      const result = await onConfirmWithLedger!(ledgerManager, ledgerPathValue ?? ledgerPath)
      onResult(result)
    } catch (error: any) {
      onFail(error)
    } finally {
      ledgerManager.disconnect()
      setLedgerLoading(false)
    }
  }

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    setLoading(true)

    try {
      const result = await onConfirmWithKey!(key)
      onResult(result)
    } catch (error: any) {
      onFail(error)
    } finally {
      setLoading(false)
    }
  }
}

export default ConfirmTransactionDialog
