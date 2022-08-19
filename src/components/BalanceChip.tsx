import React from 'react'
import { Chip, Icon } from '@mui/material'
import * as nearAPI from 'near-api-js'
import { AccountBalance } from 'near-api-js/lib/account'
import ChipSkeleton from './ChipSkeleton'

interface BalanceChipProps {
  balance?: AccountBalance
}

const BalanceChip: React.FC<BalanceChipProps> = ({ balance }) => {
  return (
    <ChipSkeleton isLoading={balance === undefined}>
      <Chip
        icon={
          <Icon fontSize="inherit" className="material-symbols-outlined">
            account_balance
          </Icon>
        }
        label={`Balance: ${nearAPI.utils.format.formatNearAmount(balance?.available ?? '0', 2)}`}
        variant="outlined"
        color="primary"
        size="small"
      />
    </ChipSkeleton>
  )
}

export default BalanceChip
