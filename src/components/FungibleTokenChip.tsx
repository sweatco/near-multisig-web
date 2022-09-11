import { Avatar, Chip, CircularProgress } from '@mui/material'
import React, { memo } from 'react'
import useFTMetadata from '../hooks/useFTMetadata'

interface FungibleTokenChipProps {
  tokenId: string
}

//

const FungibleTokenChip: React.FC<FungibleTokenChipProps> = memo(({ tokenId }) => {
  const metadata = useFTMetadata(tokenId)

  return (
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
  )
})

export default FungibleTokenChip
