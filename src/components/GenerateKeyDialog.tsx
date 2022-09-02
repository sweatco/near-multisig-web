import {
  Button,
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Icon,
  IconButton,
} from '@mui/material'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { generateSeedPhrase } from 'near-seed-phrase'
import ClipboardJS from 'clipboard'

interface GenerateKeyDialogProps {
  open: boolean
  onClose(result?: string): void
}

const GenerateKeyDialog: React.FC<GenerateKeyDialogProps> = (props) => {
  const [seedIndex, setSeedIndex] = useState(0)
  const seed = useMemo(() => generateSeedPhrase(), [seedIndex])

  const seedClipboardRef = useRef<ClipboardJS>()
  const copySeedButtonRef = useCallback(
    (node: HTMLButtonElement) => {
      if (seedClipboardRef.current) {
        seedClipboardRef.current.destroy()
        seedClipboardRef.current = undefined
      }

      if (node !== null) {
        seedClipboardRef.current = new ClipboardJS(node, { text: () => seed.seedPhrase })
      }
    },
    [seed]
  )

  const keyClipboardRef = useRef<ClipboardJS>()
  const copyKeyButtonRef = useCallback(
    (node: HTMLButtonElement) => {
      if (keyClipboardRef.current) {
        keyClipboardRef.current.destroy()
        keyClipboardRef.current = undefined
      }

      if (node !== null) {
        keyClipboardRef.current = new ClipboardJS(node, { text: () => seed.publicKey })
      }
    },
    [seed]
  )

  return (
    <Dialog open={props.open} onClose={handleCancel}>
      <form>
        <DialogTitle>New Key</DialogTitle>

        <DialogContent>
          <Stack spacing={2}>
            <Box>
              <DialogContentText>Copy and securely store new Seed Phrase:</DialogContentText>
              <Card variant="outlined">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box sx={{ p: 2, fontFamily: 'monospace' }}>{seed.seedPhrase}</Box>
                  <IconButton ref={copySeedButtonRef}>
                    <Icon fontSize="small" color="secondary" className="material-symbols-outlined">
                      content_copy
                    </Icon>
                  </IconButton>
                </Stack>
              </Card>
            </Box>
            <Box>
              <DialogContentText>Copy and send Public Key to Multisig Manager:</DialogContentText>
              <Card variant="outlined">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box sx={{ p: 2, fontFamily: 'monospace' }}>{seed.publicKey}</Box>
                  <IconButton ref={copyKeyButtonRef}>
                    <Icon fontSize="small" color="secondary" className="material-symbols-outlined">
                      content_copy
                    </Icon>
                  </IconButton>
                </Stack>
              </Card>
            </Box>
          </Stack>
        </DialogContent>
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
}

export default GenerateKeyDialog
