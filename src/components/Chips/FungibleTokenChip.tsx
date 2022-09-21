import { Avatar, Chip, CircularProgress } from '@mui/material'
import React, { memo, MouseEventHandler } from 'react'
import useBalance from '../../hooks/useBalance'
import useFTMetadata from '../../hooks/useFTMetadata'
import formatBalance from '../../utils/formatBalance'
import ChipSkeleton from './ChipSkeleton'

interface FungibleTokenChipProps {
  contractId: string
  tokenId: string
  amount?: string
  prefix?: string
  withBalance?: boolean
  variant?: 'filled' | 'outlined'
  onClick?: MouseEventHandler<HTMLDivElement>
  onDelete?: (event: any) => void
}

const FungibleTokenChip: React.FC<FungibleTokenChipProps> = memo(
  ({ prefix, amount, contractId, tokenId, withBalance, variant = 'outlined', onClick, onDelete }) => {
    const metadata = useFTMetadata(tokenId)
    const balance = useBalance(contractId, tokenId)

    return (
      <ChipSkeleton isLoading={metadata === undefined} onClick={onDelete}>
        <Chip
          onDelete={onDelete}
          onClick={onClick}
          avatar={
            metadata ? (
              <Avatar alt={metadata.name} src={metadata.icon}>
                {metadata.symbol.slice(0, 1)}
              </Avatar>
            ) : (
              <CircularProgress size={24} />
            )
          }
          label={getLabel()}
          variant={variant}
        />
      </ChipSkeleton>
    )

    function getLabel() {
      const labelParts = []

      if (!metadata) {
        labelParts.push('Loading...')
      } else {
        if (prefix) {
          labelParts.push(prefix)
        }

        if (amount) {
          labelParts.push(formatBalance(amount, metadata))
        } else if (withBalance && balance) {
          labelParts.push(balance.toFormat())
        }

        labelParts.push(metadata.symbol)
      }

      return labelParts.join(' ')
    }
  }
)

export default FungibleTokenChip
