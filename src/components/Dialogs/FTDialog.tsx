import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../hooks/useApp'
import useFTMetadata from '../../hooks/useFTMetadata'
import useLockupList from '../../hooks/useLockupList'
import { ftListActions } from '../../reducers/ft_list/reducer'
import FungibleTokenChip from '../Chips/FungibleTokenChip'
import LockupBalance from '../Common/LockupBalance'

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
  const lockupList = useLockupList(contractId, tokenId)

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
        <Box>
          Balance: <FungibleTokenChip contractId={contractId} tokenId={tokenId} withBalance />
        </Box>
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

  function handleClaimLockup(lockupId: string) {
    //
  }
}

export default FTDialog
