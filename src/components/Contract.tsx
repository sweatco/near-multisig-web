import { Alert, Box, Button, Divider, Icon, IconButton, Link, Paper, Stack, styled, Typography } from '@mui/material'
import React, { memo } from 'react'

import ConfirmationsChip from './Chips/ConfirmationsChip'
import FungibleTokenChip from './Chips/FungibleTokenChip'
import NearTokenChip from './Chips/NearTokenChip'
import Request from './Request'
import RequestsTable from './RequestsTable'
import useContract from '../hooks/useContract'
import useFTListSelector from '../hooks/useFTListSelector'

interface ContractProps {
  name: string
}

const Contract: React.FC<ContractProps> = memo(({ name }) => {
  const { confirmations, failed, remove, requestIds } = useContract(name)
  const ftList = useFTListSelector(name)

  return (
    <Paper sx={{ p: 3, marginTop: 2 }}>
      <Stack direction="row">
        <Box sx={{ flex: 1 }}>
          <StyledTypography variant="h5" gutterBottom sx={{ flex: 1 }}>
            @{name}{' '}
            <StyledLink href={`#${name}`} underline="none">
              #
            </StyledLink>
          </StyledTypography>
        </Box>
        <IconButton color="error" onClick={remove}>
          <Icon fontSize="inherit" className="material-symbols-outlined">
            delete
          </Icon>
        </IconButton>
      </Stack>

      {failed ? (
        <>
          <Alert severity="error">Unable to load contract!</Alert>
        </>
      ) : (
        <>
          <Stack direction="row" spacing={1}>
            <ConfirmationsChip confirmations={confirmations} />
            <NearTokenChip contractId={name} withBalance={true} />
            {ftList.map((token) => (
              <FungibleTokenChip key={token} tokenId={token} contractId={name} withBalance />
            ))}
          </Stack>
          {requestIds !== undefined && requestIds.length > 0 ? (
            <RequestsTable>
              {requestIds.map((requestId) => (
                <Request contractId={name} requestId={requestId} key={`${name}-${requestId}`} />
              ))}
            </RequestsTable>
          ) : (
            <Divider sx={{ marginTop: 2 }} />
          )}
        </>
      )}

      <Box sx={{ display: 'flex', marginTop: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Button color="primary" disabled>
            NEW REQUEST
          </Button>
        </Box>
      </Box>
    </Paper>
  )
})

const StyledLink = styled(Link)`
  display: none;
`

const StyledTypography = styled(Typography)`
  :hover ${StyledLink} {
    display: inline;
  }
`

export default Contract
