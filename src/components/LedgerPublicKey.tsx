import { Card, DialogContent, DialogContentText, DialogTitle, Icon, IconButton, Stack } from '@mui/material'
import { Box } from '@mui/system'
import ClipboardJS from 'clipboard'
import { PublicKey } from 'near-api-js/lib/utils'
import { KeyType } from 'near-api-js/lib/utils/key_pair'
import { useEffect, useRef, useState } from 'react'
import useLedger from '../hooks/useLedger'

const LedgerPublicKey = () => {
  const dialogContentRef = useRef()
  const [pk, setPk] = useState<string>()

  const { available, getVersion, getPublicKey } = useLedger()

  useEffect(() => {
    async function getData() {
      const pkData = await getPublicKey("44'/397'/0'/0'/1'")
      if (pkData) {
        const ledgerPk = new PublicKey({ keyType: KeyType.ED25519, data: pkData })
        setPk(ledgerPk.toString())
      }
    }

    if (available) {
      getData()
    }
  }, [available, getVersion, getPublicKey])

  return (
    <>
      <DialogTitle>Ledger Key</DialogTitle>
      <DialogContent ref={dialogContentRef}>
        <Stack spacing={2}>
          <Box>
            <DialogContentText>Copy and send Public Key to Multisig Manager:</DialogContentText>
            <Card variant="outlined">
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ p: 2, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pk}</Box>
                <IconButton onClick={handleCopyClick}>
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

  function handleCopyClick() {
    if (pk) {
      ClipboardJS.copy(pk, { container: dialogContentRef.current })
    }
  }
}

export default LedgerPublicKey
