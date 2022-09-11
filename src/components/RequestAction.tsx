import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon } from '@mui/material'
import React, { useState } from 'react'
import * as nearAPI from 'near-api-js'

interface RequestActionProps {
  action: any
  receiverId: string
}

const RequestAction: React.FC<RequestActionProps> = ({ action }) => {
  const [open, setOpen] = useState(false)
  let label = action.type

  if (action.type === 'Transfer') {
    label = `${action.type}: ${nearAPI.utils.format.formatNearAmount(action.amount, 2)}NEAR`
  }

  return (
    <>
      <Chip icon={<Icon>info</Icon>} label={label} onClick={handleClick} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle>{'Action Details'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{JSON.stringify(action)}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )

  function handleClick() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }
}

export default RequestAction
