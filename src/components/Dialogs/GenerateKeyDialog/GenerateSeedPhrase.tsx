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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const seed = useMemo(() => generateSeedPhrase(), [props.seedIndex])
  const parsedSeed = useMemo(() => (manualSeed ? parseSeedPhrase(manualSeed) : undefined), [manualSeed])

  const seedPhrase = manualSeed ?? seed.seedPhrase
  const publicKey = parsedSeed?.publicKey ?? seed.publicKey
  const privateKey = parsedSeed?.secretKey ?? seed.secretKey

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
                value={seedPhrase}
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
            <DialogContentText>Copy and send Private Key to Multisig Manager:</DialogContentText>
            <Card elevation={0}>
              <OutlinedInput
                readOnly
                fullWidth
                multiline
                maxRows={4}
                value={privateKey}
                sx={{ fontFamily: 'monospace' }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handlePrivateKeyCopy}>
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
                readOnly
                fullWidth
                multiline
                maxRows={4}
                value={publicKey}
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
    ClipboardJS.copy(seedPhrase, { container: dialogContentRef.current })
  }

  function handlePublicKeyCopy(event: any) {
    ClipboardJS.copy(publicKey, { container: dialogContentRef.current })
  }

  function handlePrivateKeyCopy(event: any) {
    ClipboardJS.copy(privateKey, { container: dialogContentRef.current })
  }
}

export default GenerateSeedPhrase
