import { Avatar, Chip, CircularProgress } from '@mui/material'
import React, { memo } from 'react'
import useBalance from '../../hooks/useBalance'
import useFTMetadata from '../../hooks/useFTMetadata'
import ChipSkeleton from './ChipSkeleton'

interface FungibleTokenChipProps {
  contractId: string
  tokenId: string
  withBalance?: boolean
}

const FungibleTokenChip: React.FC<FungibleTokenChipProps> = memo(({ contractId, tokenId, withBalance }) => {
  const metadata = useFTMetadata(tokenId)
  const balance = useBalance(contractId, tokenId)

  return (
    <ChipSkeleton isLoading={metadata === undefined}>
      <Chip
        avatar={
          metadata ? (
            <Avatar alt={metadata.name} src={metadata.icon}>
              {metadata.symbol.slice(0, 1)}
            </Avatar>
          ) : (
            <CircularProgress size={24} />
          )
        }
        label={renderBalance()}
        variant="outlined"
      />
    </ChipSkeleton>
  )

  function renderBalance() {
    if (balance && metadata && withBalance) {
      return `${balance.toFixed()} ${metadata.symbol}`
    } else if (metadata) {
      return metadata.symbol
    } else {
      return 'Loading...'
    }
  }
})

export default FungibleTokenChip
