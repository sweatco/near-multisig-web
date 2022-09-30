import styled from '@emotion/styled'
import { Badge, ListItem, ListItemButton, ListItemText } from '@mui/material'
import React from 'react'
import useContractRequestList from '../hooks/useContractRequestList'

interface ContractMenuItemProps {
  contractId: string
  selected: boolean
  onClick(): void
}

const ContractMenuItem: React.FC<ContractMenuItemProps> = ({ contractId, selected, onClick }) => {
  const { requestIds } = useContractRequestList(contractId)
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick} selected={selected}>
        {requestIds && requestIds.length > 0 ? (
          <StyledBadge badgeContent={requestIds.length} color="info" sx={{ mr: 1 }} />
        ) : null}
        <ListItemText primary={contractId} />
      </ListItemButton>
    </ListItem>
  )
}

const StyledBadge = styled(Badge)`
  & .MuiBadge-badge {
    transform: none;
    position: relative;
  }
`

export default ContractMenuItem
