import {
  Card,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
} from '@mui/material'
import { Box } from '@mui/system'
import ClipboardJS from 'clipboard'
import { useEffect, useRef, useState } from 'react'
import { ledgerManager } from '../utils/LedgerManager'

const LedgerPublicKey = () => {
  const dialogContentRef = useRef()
  const [pk, setPk] = useState<string>()
  const [message, setMessage] = useState("Follow Ledger's on-screen instructions...")

  useEffect(() => {
    async function getData() {
      try {
        const publicKey = await ledgerManager.getPublicKey(/*"44'/397'/0'/0'/1'"*/)
        if (publicKey) {
          setPk(publicKey.toString())
        }
      } catch (err: any) {
        setMessage(err.message)
      }
    }

    getData()

    return () => {
      ledgerManager.disconnect().catch(() => {})
    }
  }, [])

  return (
    <>
      <DialogTitle>Ledger Key</DialogTitle>
      <DialogContent ref={dialogContentRef}>
        <Stack spacing={2}>
          <Box>
            <DialogContentText>Copy and send Public Key to Multisig Manager:</DialogContentText>
            <Card elevation={0}>
              <OutlinedInput
                disabled
                fullWidth
                multiline
                maxRows={4}
                value={pk ?? message}
                sx={{ fontFamily: 'monospace' }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleCopyClick}>
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

  function handleCopyClick() {
    if (pk) {
      ClipboardJS.copy(pk, { container: dialogContentRef.current })
    }
  }
}

export default LedgerPublicKey
