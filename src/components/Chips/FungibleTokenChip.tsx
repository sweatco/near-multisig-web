import { Avatar, Chip, CircularProgress } from '@mui/material'
import BigNumber from 'bignumber.js'
import React, { memo, MouseEventHandler } from 'react'
import useBalance from '../../hooks/useBalance'
import { useDialog } from '../../hooks/useDialog'
import useFTMetadata from '../../hooks/useFTMetadata'
import formatBalance from '../../utils/formatBalance'
import FTDialog from '../Dialogs/FTDialog'
import ChipSkeleton from './ChipSkeleton'

interface FungibleTokenChipProps {
  contractId: string
  tokenId: string
  amount?: string | BigNumber
  prefix?: string
  withBalance?: boolean
  editable?: boolean
  variant?: 'filled' | 'outlined'
  onClick?: MouseEventHandler<HTMLDivElement>
  onDelete?: (event: any) => void
}

const FungibleTokenChip: React.FC<FungibleTokenChipProps> = memo(
  ({ prefix, amount, contractId, tokenId, withBalance, editable, variant = 'outlined', onClick, onDelete }) => {
    const metadata = useFTMetadata(tokenId)
    const balance = useBalance(contractId, tokenId)
    const ftDialog = useDialog(handleDialogResult)

    return (
      <>
        <ChipSkeleton isLoading={metadata === undefined} onClick={onDelete}>
          <Chip
            onDelete={onDelete}
            onClick={editable ? handleClick : onClick}
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
        {editable ? (
          <FTDialog open={ftDialog.open} contractId={contractId} tokenId={tokenId} onClose={ftDialog.closeDialog} />
        ) : null}
      </>
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

    function handleClick() {
      ftDialog.openDialog()
    }

    function handleDialogResult() {
      //
    }
  }
)

export default FungibleTokenChip
