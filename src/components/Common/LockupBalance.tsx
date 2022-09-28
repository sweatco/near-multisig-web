import { Button, Card, CardActions, CardContent, Skeleton, Stack, Typography } from '@mui/material'
import React from 'react'
import useLockup from '../../hooks/useLockup'
import FungibleTokenChip from '../Chips/FungibleTokenChip'

interface LockupBalanceProps {
  contractId: string
  tokenId: string
  lockupId: string
  onDelete?(lockupId: string): void
  onClaim?(lockupId: string): void
}

const LockupBalance: React.FC<LockupBalanceProps> = ({ contractId, tokenId, lockupId, onDelete, onClaim }) => {
  const lockup = useLockup(contractId, tokenId, lockupId)

  if (lockup) {
    return (
      <Card>
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
        <CardActions>
          <Button size="small" onClick={() => onClaim?.(lockupId)}>
            Claim
          </Button>
          <Button size="small" color="error" onClick={() => onDelete?.(lockupId)}>
            Delete
          </Button>
        </CardActions>
      </Card>
    )
  } else {
    return <Skeleton variant="rounded" height={40} component="div" />
  }
}

export default LockupBalance
