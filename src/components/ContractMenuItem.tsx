import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import React from 'react'

interface ContractMenuItemProps {
  contractId: string
  selected: boolean
  onClick(): void
}

const ContractMenuItem: React.FC<ContractMenuItemProps> = ({ contractId, selected, onClick }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick} selected={selected}>
        <ListItemText primary={contractId} />
      </ListItemButton>
    </ListItem>
  )
}

export default ContractMenuItem
