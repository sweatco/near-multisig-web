import {
  Box,
  Button,
  Card,
  DialogActions,
  DialogContent,
  DialogContentText,
  Icon,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material'
import React, { FormEvent, useMemo, useRef, useState } from 'react'

import { generateSeedPhrase } from 'near-seed-phrase'
import ClipboardJS from 'clipboard'
import useAccessKeys from '../../../hooks/useAccessKeys'
import useConfirmTransaction from '../ConfirmTransaction/useConfirmTransaction'
import { useAppDispatch } from '../../../hooks/useApp'
import sendTransaction from '../../../actions/chain/sendTransaction'
import LedgerManager from '../../../utils/LedgerManager'
import { transactions } from 'near-api-js'
import { PublicKey } from 'near-api-js/lib/utils'

interface TakeOverRequestProps {
  contractId: string
  onClose(result?: boolean): void
}

interface TransactionKeyOptions {
  key?: string
  ledgerManager?: LedgerManager
  ledgerPath?: number
}

const TakeOverRequest: React.FC<TakeOverRequestProps> = ({ contractId, onClose }) => {
  const dispatch = useAppDispatch()
  const dialogContentRef = useRef()
  const [seedIndex, setSeedIndex] = useState(0)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const seed = useMemo(() => generateSeedPhrase(), [seedIndex])
  const keys = useAccessKeys(contractId)
  const confirmTransaction = useConfirmTransaction()

  const { seedPhrase, publicKey } = seed

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent ref={dialogContentRef}>
        <Stack direction="column" spacing={2}>
          <Box>
            <DialogContentText>Copy and securely store new Seed Phrase:</DialogContentText>
            <Card elevation={0}>
              <OutlinedInput
                fullWidth
                multiline
                maxRows={4}
                minRows={2}
                contentEditable={false}
                value={seedPhrase}
                sx={{ fontFamily: 'monospace' }}
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
            <DialogContentText>Key to add:</DialogContentText>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>{publicKey}</TableCell>
                  <TableCell>Full</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box>
            <DialogContentText>Keys to delete:</DialogContentText>
            {keys !== undefined ? (
              keys.length === 0 ? (
                'No keys'
              ) : (
                <Table>
                  <TableBody>
                    {keys.map((key) => (
                      <TableRow>
                        <TableCell>{key.public_key}</TableCell>
                        <TableCell>{key.access_key.permission === 'FullAccess' ? 'Full' : 'Func'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
            ) : null}
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
        <Button onClick={handleCancel}>Cancel</Button>
        <Button type="submit" disabled={keys === undefined || keys.length === 0}>
          Send Request
        </Button>
      </DialogActions>
    </form>
  )

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    try {
      if (
        await confirmTransaction({
          contractId,
          onConfirmWithKey: async (key) => {
            await addNewKey({ key })
            await deleteOldKeys()
            return true
          },
          onConfirmWithLedger: async (ledgerManager, ledgerPath) => {
            await addNewKey({ ledgerManager, ledgerPath })
            await deleteOldKeys()
            return true
          },
        })
      ) {
        onClose()
      }
    } catch (e) {}
  }

  function addNewKey(options: TransactionKeyOptions) {
    return dispatch(
      sendTransaction({
        ...options,
        accountId: contractId,
        request: {
          receiver_id: contractId,
          actions: [transactions.addKey(PublicKey.fromString(publicKey), transactions.fullAccessKey())],
        },
      })
    ).unwrap()
  }

  function deleteOldKeys() {
    return dispatch(
      sendTransaction({
        key: seedPhrase,
        accountId: contractId,
        request: {
          receiver_id: contractId,
          actions: keys!.map((key) => {
            return transactions.deleteKey(PublicKey.fromString(key.public_key))
          }),
        },
      })
    ).unwrap()
  }

  function handleCancel() {
    onClose()
  }

  function handleRefreshSeed() {
    setSeedIndex(seedIndex + 1)
  }

  function handleSeedPhraseCopy(event: any) {
    ClipboardJS.copy(seedPhrase, { container: dialogContentRef.current })
  }
}

export default TakeOverRequest
