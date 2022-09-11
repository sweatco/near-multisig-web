import { Avatar, Chip, CircularProgress } from '@mui/material'
import React, { memo } from 'react'
import useFTMetadata from '../hooks/useFTMetadata'
import ChipSkeleton from './ChipSkeleton'

interface FungibleTokenChipProps {
  tokenId: string
}

const FungibleTokenChip: React.FC<FungibleTokenChipProps> = memo(({ tokenId }) => {
  const metadata = useFTMetadata(tokenId)

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
        label={metadata ? metadata.symbol : 'Loading...'}
        variant="outlined"
      />
    </ChipSkeleton>
  )
})

export default FungibleTokenChip
