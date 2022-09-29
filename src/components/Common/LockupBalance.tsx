import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  LinearProgress,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import useFTMetadata from '../../hooks/useFTMetadata'
import useLockup from '../../hooks/useLockup'
import { Lockup } from '../../utils/contracts/Lockup'
import formatBalance, { BN, parseBalance, toFTBalance } from '../../utils/formatBalance'
import FungibleTokenChip from '../Chips/FungibleTokenChip'

interface LockupBalanceProps {
  contractId: string
  tokenId: string
  lockupId: string
  onDelete?(lockupId: string): void
  onClaim?(lockupId: string, claimId?: string, claimAmount?: string): void
}

const LockupBalance: React.FC<LockupBalanceProps> = ({ contractId, tokenId, lockupId, onDelete, onClaim }) => {
  const lockup = useLockup(contractId, tokenId, lockupId)
  const metadata = useFTMetadata(tokenId)

  const [claimId, setClaimId] = useState('-1')
  const [claimAmount, setClaimAmount] = useState('')

  useEffect(() => {
    setClaimAmount('')
  }, [claimId])

  return (
    <Card>
      {lockup && metadata ? (
        <>
          <CardContent sx={{ paddingBottom: 1 }}>
            <Typography variant="h6" mb={2}>
              Contract: {lockupId}
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" component="div">
                Total locked: <FungibleTokenChip contractId={contractId} tokenId={tokenId} amount={lockup.total} />
              </Typography>
              <Typography variant="body2" component="div">
                Available to claim:{' '}
                <FungibleTokenChip contractId={contractId} tokenId={tokenId} amount={lockup.unclaimed} />
              </Typography>
            </Stack>
          </CardContent>
          <CardContent>
            <Stack direction="row" spacing={1}>
              <FormControl size="small" fullWidth sx={{ flex: 1 }}>
                <InputLabel id="demo-simple-select-label">Lockup</InputLabel>
                <Select
                  value={claimId}
                  label="Lockup"
                  onChange={handleClaimIdChange}
                  renderValue={(value) => {
                    return value === '-1'
                      ? 'All available'
                      : `[${value}]: ${formatBalance(lockup.lockups[value].unclaimed_balance, metadata)}`
                  }}>
                  <MenuItem value={'-1'}>All available</MenuItem>
                  {Object.entries(lockup.lockups).map(([lockupId, entry]: [string, Lockup]) => (
                    <MenuItem key={lockupId} value={lockupId}>
                      <FungibleTokenChip
                        prefix={`[${lockupId}]:`}
                        contractId={contractId}
                        tokenId={tokenId}
                        amount={BN(entry.unclaimed_balance)}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                value={claimAmount}
                onChange={handleClaimAmountChange}
                label="Amount"
                variant="outlined"
                helperText={
                  claimId !== '-1' ? (
                    <>
                      Maximum is{' '}
                      <MaxLink onClick={handleMaxClick}>
                        {formatBalance(lockup.lockups[claimId].unclaimed_balance, metadata)}
                      </MaxLink>
                    </>
                  ) : null
                }
                size="small"
                autoComplete="off"
                disabled={claimId === '-1'}
                sx={{ flex: 1 }}
              />
              <Button
                sx={{ alignSelf: 'flex-start', minHeight: 40 }}
                variant="contained"
                color="secondary"
                size="small"
                disabled={claimId !== '-1' && !(parseFloat(claimAmount) > 0)}
                onClick={handleClaim}>
                Claim
              </Button>
            </Stack>
          </CardContent>
        </>
      ) : (
        <CardContent sx={{ paddingBottom: 1 }}>
          <Typography variant="h6" mb={2}>
            Contract: {lockupId}
          </Typography>
          <LinearProgress />
        </CardContent>
      )}
      <CardActions>
        <Button size="small" color="error" onClick={() => onDelete?.(lockupId)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  )

  function handleClaimIdChange(event: SelectChangeEvent) {
    setClaimId(event.target.value)
  }

  function handleClaimAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    setClaimAmount(event.target.value)
  }

  function handleMaxClick() {
    if (lockup && metadata) {
      setClaimAmount(toFTBalance(lockup.lockups[claimId].unclaimed_balance, metadata).toFixed())
    }
  }

  function handleClaim() {
    if (!metadata) {
      return
    }

    if (claimId === '-1') {
      onClaim?.(lockupId)
    } else {
      onClaim?.(lockupId, claimId, parseBalance(claimAmount, metadata))
    }
  }
}

const MaxLink = styled(Link)`
  cursor: pointer;
`

export default LockupBalance
