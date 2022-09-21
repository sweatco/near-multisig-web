import { Dialog } from '@mui/material'
import React from 'react'
import TransferRequest from './TransferRequest'

interface RequestDialogProps {
  contractId: string
  open: boolean
  onClose(result?: boolean): void
}

const RequestDialog: React.FC<RequestDialogProps> = ({ contractId, onClose, open }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      TransitionProps={{
        onEntered: handleDialogEnter,
      }}>
      <TransferRequest contractId={contractId} onClose={handleClose} />
    </Dialog>
  )

  function handleDialogEnter() {
    //
  }

  function handleClose() {
    onClose()
  }
}

export default RequestDialog
