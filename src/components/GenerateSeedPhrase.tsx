import {
  Box,
  Card,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Icon,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { generateSeedPhrase, parseSeedPhrase } from 'near-seed-phrase'
import ClipboardJS from 'clipboard'

interface GenerateSeedPhraseProps {
  seedIndex: number
}

const GenerateSeedPhrase: React.FC<GenerateSeedPhraseProps> = (props) => {
  const dialogContentRef = useRef()
  const [manualSeed, setManualSeed] = useState<string | null>(null)

  const seed = useMemo(() => generateSeedPhrase(), [props.seedIndex])
  const parsedSeed = useMemo(() => (manualSeed ? parseSeedPhrase(manualSeed) : undefined), [manualSeed])

  useEffect(() => {
    setManualSeed(null)
  }, [props.seedIndex])

  return (
    <>
      <DialogTitle>Generate New Key</DialogTitle>
      <DialogContent ref={dialogContentRef}>
        <Stack spacing={2}>
          <Box>
            <DialogContentText>Copy and securely store new Seed Phrase:</DialogContentText>
            <Card elevation={0}>
              <OutlinedInput
                fullWidth
                multiline
                maxRows={4}
                minRows={2}
                value={manualSeed ?? seed.seedPhrase}
                sx={{ fontFamily: 'monospace' }}
                onBlur={handleBlur}
                onChange={handleSeedPhraseChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleSeedPhraseCopy}>
                      <Icon fontSize="small" color="secondary" className="material-symbols-outlined">
                        content_copy
                      </Icon>
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Card>
          </Box>
          <Box>
            <DialogContentText>Copy and send Public Key to Multisig Manager:</DialogContentText>
            <Card elevation={0}>
              <OutlinedInput
                disabled
                fullWidth
                multiline
                maxRows={4}
                value={parsedSeed?.publicKey ?? seed.publicKey}
                sx={{ fontFamily: 'monospace' }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handlePublicKeyCopy}>
                      <Icon fontSize="small" color="secondary" className="material-symbols-outlined">
                        content_copy
                      </Icon>
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Card>
          </Box>
        </Stack>
      </DialogContent>
    </>
  )

  function handleBlur() {
    if (manualSeed?.length === 0) {
      setManualSeed(null)
    }
  }

  function handleSeedPhraseChange(event: React.ChangeEvent<HTMLInputElement>) {
    setManualSeed(event.target.value)
  }

  function handleSeedPhraseCopy(event: any) {
    ClipboardJS.copy(seed.seedPhrase, { container: dialogContentRef.current })
  }

  function handlePublicKeyCopy(event: any) {
    ClipboardJS.copy(seed.publicKey, { container: dialogContentRef.current })
  }
}

export default GenerateSeedPhrase
