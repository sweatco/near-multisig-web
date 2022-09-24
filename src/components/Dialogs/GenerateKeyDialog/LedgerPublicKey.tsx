import {
  Backdrop,
  Button,
  Card,
  Chip,
  CircularProgress,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import ClipboardJS from 'clipboard'
import { useEffect, useRef, useState } from 'react'
import { deriveLedgerPath } from '../../../utils/chainHelpers'
import { ledgerManager } from '../../../utils/LedgerManager'

const LedgerPublicKey = () => {
  const dialogContentRef = useRef()
  const [pk, setPk] = useState<string>()
  const [message, setMessage] = useState<string>()
  const [ledgerPath, setLedgerPath] = useState(1)
  const [ledgerLoading, setLedgerLoading] = useState(false)

  useEffect(() => {
    return () => {
      ledgerManager.disconnect().catch(() => {})
    }
  }, [])

  return (
    <>
      <DialogTitle>Ledger Key</DialogTitle>
      <DialogContent ref={dialogContentRef}>
        <Stack direction="row" spacing={2} mt={1} mb={4}>
          <Button variant="contained" color="secondary" onClick={generateWithLedger}>
            Generate Ledger Key
          </Button>
          <TextField
            value={ledgerPath}
            onChange={handleLedgerPathChange}
            label="Path"
            type="number"
            autoComplete="off"
            sx={{ width: '4em' }}
          />
        </Stack>
        <Divider />
        <Stack spacing={2} mt={2}>
          <Box>
            <DialogContentText>Copy and send Public Ledger's Key to Multisig Manager:</DialogContentText>
            <Card elevation={0}>
              <OutlinedInput
                readOnly
                fullWidth
                multiline
                error={message !== undefined}
                maxRows={3}
                value={pk ?? message ?? 'Press button...'}
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
      <Backdrop open={ledgerLoading} sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
        <Stack direction="column" alignItems="center">
          <CircularProgress color="inherit" />
          <Chip label="Follow Ledger's on-screen instructions" color="primary" sx={{ mt: 4 }} />
        </Stack>
      </Backdrop>
    </>
  )

  async function generateWithLedger() {
    try {
      setPk(undefined)
      setLedgerLoading(true)

      const publicKey = await ledgerManager.getPublicKey(deriveLedgerPath(ledgerPath))
      if (publicKey) {
        setPk(publicKey.toString())
      }
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setLedgerLoading(false)
    }
  }

  function handleLedgerPathChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value)
    if (!isNaN(value)) {
      setLedgerPath(value)
      setPk(undefined)
      setMessage(undefined)
    }
  }

  function handleCopyClick() {
    if (pk) {
      ClipboardJS.copy(pk, { container: dialogContentRef.current })
    }
  }
}

export default LedgerPublicKey
