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

  const { confirmations, balance, failed, remove, requestIds } = useContract(name)
  const requestDialog = useDialog(handleRequestDialogResult)
  const addFTDialog = useDialog(handleAddFTDialogResult)
  const ftList = useFTListSelector(name)

  return (
    <Paper sx={{ p: 3 }}>
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

      <Stack direction="row" spacing={1}>
        {balance === undefined || confirmations !== undefined ? (
          <ConfirmationsChip confirmations={confirmations} />
        ) : null}
        <NearTokenChip contractId={name} withBalance={true} />
        {ftList.map((token) => (
          <FungibleTokenChip key={token} tokenId={token} contractId={name} editable withBalance />
        ))}
        <IconButton color="secondary" size="small" sx={{ alignSelf: 'center' }} onClick={handleNewFT}>
          <Icon fontSize="inherit" className="material-symbols-outlined">
            add_circle
          </Icon>
        </IconButton>
      </Stack>
      {failed ? (
        <Box mt={2}>
          <Alert severity="warning">Unable to load contract!</Alert>
        </Box>
      ) : requestIds !== undefined && requestIds.length > 0 ? (
        <RequestsTable>
          {requestIds.map((requestId) => (
            <Request contractId={name} requestId={requestId} key={`${name}-${requestId}`} />
          ))}
        </RequestsTable>
      ) : (
        <Divider sx={{ marginTop: 2 }} />
      )}

      <Box sx={{ display: 'flex', marginTop: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Button color="primary" onClick={handleNewRequest}>
            NEW REQUEST
          </Button>
        </Box>
      </Box>

      <RequestDialog contractId={name} open={requestDialog.open} onClose={requestDialog.closeDialog} />
      <AddFungibleTokenDialog open={addFTDialog.open} onClose={addFTDialog.closeDialog} />
    </Paper>
  )

  function handleNewRequest() {
    requestDialog.openDialog()
  }

  function handleNewFT() {
    addFTDialog.openDialog()
  }

  function handleRequestDialogResult(result?: boolean) {
    // skip result
  }

  function handleAddFTDialogResult(result: string) {
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
