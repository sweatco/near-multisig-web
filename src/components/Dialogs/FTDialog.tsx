import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import addRequest, { AddRequestResult } from '../../actions/chain/addRequest'
import fetchFTBalance from '../../actions/chain/fetchFTBalance'
import { useAppDispatch } from '../../hooks/useApp'
import useFTListSelector from '../../hooks/useFTListSelector'
import useFTMetadata from '../../hooks/useFTMetadata'
import useLockupList from '../../hooks/useLockupList'
import { ftListActions } from '../../reducers/ft_list/reducer'
import { parseTgas } from '../../utils/formatBalance'
import FungibleTokenChip from '../Chips/FungibleTokenChip'
import LockupBalance from '../Common/LockupBalance'
import useConfirmTransaction from './ConfirmTransaction/useConfirmTransaction'

interface FTDialogProps {
  contractId: string
  tokenId: string
  open: boolean
  onClose(result?: string): void
}

const FTDialog: React.FC<FTDialogProps> = (props) => {
  const { contractId, tokenId } = props
  const [address, setAddress] = useState('')

  const dispatch = useAppDispatch()
  const metadata = useFTMetadata(tokenId)
  const ftList = useFTListSelector(contractId)
  const lockupList = useLockupList(contractId, tokenId)

  const confirmTransaction = useConfirmTransaction()

  useEffect(() => {
    if (props.open) {
      setAddress('')
    }
  }, [props.open])

  return (
    <Dialog open={props.open} onClose={handleCancel} fullWidth>
      <DialogTitle>
        {metadata?.name} ({tokenId})
      </DialogTitle>
      <DialogContent>
        <Typography component="div" mb={1} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Account: <strong>{contractId}</strong>
        </Typography>
        <Typography component="div">
          Balance: <FungibleTokenChip contractId={contractId} tokenId={tokenId} withBalance />
        </Typography>
        <Typography variant="h5" mt={2}>
          Lockups:
        </Typography>
        {lockupList.length > 0 ? (
          <Stack spacing={1} mt={1} mb={2}>
            {lockupList.map((lockupId) => (
              <LockupBalance
                key={lockupId}
                contractId={contractId}
                tokenId={tokenId}
                lockupId={lockupId}
                onClaim={handleClaimLockup}
                onDelete={handleDeleteLockup}
              />
            ))}
          </Stack>
        ) : null}

        <Stack direction="row" spacing={1} mt={1}>
          <TextField
            fullWidth
            label="New contract address"
            type="text"
            size="small"
            variant="outlined"
            autoComplete="off"
            onChange={handleAddressChange}
            value={address}
          />
          <Button variant="contained" color="secondary" disabled={address.length === 0} onClick={handleAddLockup}>
            Add
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Close</Button>
        <Button color="error" onClick={handleDeleteFT}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )

  function handleAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAddress(event.target.value)
  }

  function handleAddLockup() {
    dispatch(ftListActions.addLockup({ contractId: contractId, tokenId: tokenId, lockupId: address }))
    setAddress('')
  }

  function handleCancel() {
    props.onClose()
  }

  function handleDeleteFT() {
    if (window.confirm(`Do you want to delete "${tokenId}" from "${contractId}"`)) {
      dispatch(ftListActions.deleteFungibleToken({ contractId: contractId, tokenId: tokenId }))
    }
  }

  function handleDeleteLockup(lockupId: string) {
    if (window.confirm(`Do you want to delete "${lockupId}" from "${contractId}"`)) {
      dispatch(ftListActions.deleteLockup({ contractId: contractId, tokenId: tokenId, lockupId }))
    }
  }

  async function handleClaimLockup(lockupId: string, claimId?: string, claimAmount?: string) {
    function checkResult(result: AddRequestResult) {
      if (typeof result.value !== 'number') {
        ftList.forEach((tokenId) => {
          dispatch(fetchFTBalance({ accountId: contractId, tokenId, force: true }))
        })
      }
    }

    function getRequest() {
      return {
        receiver_id: lockupId,
        actions: [
          {
            type: 'FunctionCall',
            gas: parseTgas(100),
            method_name: 'claim',
            args: Buffer.from(
              JSON.stringify(claimId && claimAmount ? { amounts: [[parseInt(claimId), claimAmount]] } : {})
            ).toString('base64'),
            deposit: '0',
          },
        ],
      }
    }

    try {
      await confirmTransaction({
        contractId,
        onConfirmWithKey: async (key) => {
          const result = await dispatch(addRequest({ key, contractId, request: getRequest(), tgas: 50 })).unwrap()
          checkResult(result)
          return result.value != null
        },
        onConfirmWithLedger: async (ledgerManager, ledgerPath) => {
          const result = await dispatch(
            addRequest({ ledgerManager, ledgerPath, contractId, request: getRequest(), tgas: 50 })
          ).unwrap()
          checkResult(result)
          return result.value != null
        },
      })
    } catch (e) {}
  }
}

export default FTDialog
