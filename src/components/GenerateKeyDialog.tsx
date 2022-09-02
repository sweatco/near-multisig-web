import { Button, Dialog, DialogActions, Icon, Tabs, Tab } from '@mui/material'
import React, { useState } from 'react'
import GenerateSeedPhrase from './GenerateSeedPhrase'
import LedgerPublicKey from './LedgerPublicKey'
import TabPanel from './TabPanel'

interface GenerateKeyDialogProps {
  open: boolean
  onClose(result?: string): void
}

const GenerateKeyDialog: React.FC<GenerateKeyDialogProps> = (props) => {
  const [seedIndex, setSeedIndex] = useState(0)
  const [tab, setTab] = useState(0)

  return (
    <Dialog id="generate-key-dialog" open={props.open} maxWidth="sm" fullWidth={true} onClose={handleCancel}>
      <form>
        <Tabs value={tab} centered onChange={handleTabChange}>
          <Tab label="Seed Phrase" />
          <Tab label="Ledger" />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <GenerateSeedPhrase seedIndex={seedIndex} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <LedgerPublicKey />
        </TabPanel>
        <DialogActions>
          <Button
            color="secondary"
            onClick={handleRefreshSeed}
            startIcon={
              <Icon fontSize="small" className="material-symbols-outlined">
                refresh
              </Icon>
            }>
            Refresh
          </Button>

          <Button onClick={handleCancel}>Close</Button>
        </DialogActions>
      </form>
    </Dialog>
  )

  function handleCancel() {
    props.onClose()
    setTimeout(() => setSeedIndex(seedIndex + 1), 400)
  }

  function handleRefreshSeed() {
    setSeedIndex(seedIndex + 1)
  }

  function handleTabChange(_: any, newValue: number) {
    setTab(newValue)
  }
}

export default GenerateKeyDialog
