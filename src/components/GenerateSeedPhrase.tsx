import { Box, Card, DialogContent, DialogContentText, DialogTitle, Stack, Icon, IconButton } from '@mui/material'
import React, { useMemo, useRef } from 'react'
import { generateSeedPhrase } from 'near-seed-phrase'
import ClipboardJS from 'clipboard'

interface GenerateSeedPhraseProps {
  seedIndex: number
}

const GenerateSeedPhrase: React.FC<GenerateSeedPhraseProps> = (props) => {
  const seed = useMemo(() => generateSeedPhrase(), [props.seedIndex])
  const dialogContentRef = useRef()

  return (
    <>
      <DialogTitle>New Key</DialogTitle>
      <DialogContent ref={dialogContentRef}>
        <Stack spacing={2}>
          <Box>
            <DialogContentText>Copy and securely store new Seed Phrase:</DialogContentText>
            <Card variant="outlined">
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ p: 2, fontFamily: 'monospace' }}>{seed.seedPhrase}</Box>
                <IconButton onClick={handleSeedPhraseCopy}>
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
                <Box sx={{ p: 2, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {seed.publicKey}
                </Box>
                <IconButton onClick={handlePublicKeyCopy}>
                  <Icon fontSize="small" color="secondary" className="material-symbols-outlined">
                    content_copy
                  </Icon>
                </IconButton>
              </Stack>
            </Card>
          </Box>
        </Stack>
      </DialogContent>
    </>
  )

  function handleSeedPhraseCopy(event: any) {
    ClipboardJS.copy(seed.seedPhrase, { container: dialogContentRef.current })
  }

  function handlePublicKeyCopy(event: any) {
    ClipboardJS.copy(seed.publicKey, { container: dialogContentRef.current })
  }
}

export default GenerateSeedPhrase
