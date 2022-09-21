import { Alert, Box, Button, Divider, Icon, IconButton, Link, Paper, Stack, styled, Typography } from '@mui/material'
import React, { memo } from 'react'

import ConfirmationsChip from './Chips/ConfirmationsChip'
import FungibleTokenChip from './Chips/FungibleTokenChip'
import NearTokenChip from './Chips/NearTokenChip'
import Request from './Request'
import RequestsTable from './RequestsTable'
import useContract from '../hooks/useContract'
import useFTListSelector from '../hooks/useFTListSelector'
import RequestDialog from './Dialogs/RequestDialog'
import { useDialog } from '../hooks/useDialog'
import AddFungibleTokenDialog from './Dialogs/AddFungibleTokenDialog'
import { useAppDispatch } from '../hooks/useApp'
import { ftListActions } from '../reducers/ft_list/reducer'

interface ContractProps {
  name: string
}

const Contract: React.FC<ContractProps> = memo(({ name }) => {
  const dispatch = useAppDispatch()
  const { confirmations, failed, remove, requestIds } = useContract(name)
  const requestDialog = useDialog(handleRequestDialogResult)
  const ftDialog = useDialog(handleFTDialogResult)
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
              <FungibleTokenChip
                key={token}
                tokenId={token}
                contractId={name}
                onDelete={() => handleDeleteFT(token)}
                withBalance
              />
            ))}
            <IconButton color="secondary" size="small" sx={{ alignSelf: 'center' }} onClick={handleNewFT}>
              <Icon fontSize="inherit" className="material-symbols-outlined">
                add_circle
              </Icon>
            </IconButton>
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
          <Button color="primary" onClick={handleNewRequest}>
            NEW REQUEST
          </Button>
        </Box>
      </Box>

      <RequestDialog contractId={name} open={requestDialog.open} onClose={requestDialog.closeDialog} />
      <AddFungibleTokenDialog open={ftDialog.open} onClose={ftDialog.closeDialog} />
    </Paper>
  )

  function handleNewRequest() {
    requestDialog.openDialog()
  }

  function handleNewFT() {
    ftDialog.openDialog()
  }

  function handleDeleteFT(token: string) {
    if (window.confirm(`Do you want to delete "${token}" from "${name}"`)) {
      dispatch(ftListActions.deleteFungibleToken({ contractId: name, tokenId: token }))
    }
  }

  function handleRequestDialogResult(result?: boolean) {
    // skip result
  }

  function handleFTDialogResult(result: string) {
    dispatch(ftListActions.addFungibleToken({ contractId: name, tokenId: result }))
  }
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
