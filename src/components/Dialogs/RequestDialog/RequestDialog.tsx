import { Box, Dialog, DialogTitle, Tab, Tabs } from '@mui/material'
import React, { SyntheticEvent, useState } from 'react'
import TabPanel from '../../Common/TabPanel'
import TakeOverRequest from './TakeOverRequest'
import TransferRequest from './TransferRequest'

interface RequestDialogProps {
  contractId: string
  open: boolean
  onClose(result?: boolean): void
}

const RequestDialog: React.FC<RequestDialogProps> = ({ contractId, onClose, open }) => {
  const [value, setValue] = useState(0)

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <Box sx={{ bgcolor: 'divider' }}>
        <DialogTitle>New Request</DialogTitle>

        <Tabs value={value} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Transfer" />
          <Tab label="Take Over" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <TransferRequest contractId={contractId} onClose={handleClose} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TakeOverRequest contractId={contractId} onClose={handleClose} />
      </TabPanel>
    </Dialog>
  )

  function handleTabChange(event: SyntheticEvent, newValue: number) {
    setValue(newValue)
  }

  function handleClose() {
    onClose()
  }
}

export default RequestDialog
