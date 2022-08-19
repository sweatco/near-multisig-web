import React from 'react'
import { Chip, Icon } from '@mui/material'
import ChipSkeleton from './ChipSkeleton'

interface ConfirmationsChipProps {
  confirmations?: number
}

const ConfirmationsChip: React.FC<ConfirmationsChipProps> = ({ confirmations }) => {
  return (
    <ChipSkeleton isLoading={confirmations === undefined} sx={{ marginLeft: 1 }}>
      <Chip
        icon={
          <Icon fontSize="inherit" className="material-symbols-outlined">
            done_all
          </Icon>
        }
        label={`Confirmations needed: ${confirmations ?? 0}`}
        variant="outlined"
        color="success"
        size="small"
        sx={{ marginLeft: 1 }}
      />
    </ChipSkeleton>
  )
}

export default ConfirmationsChip
