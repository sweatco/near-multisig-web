import { Button, Icon, IconButton, Stack, TableCell, TableRow } from '@mui/material'
import React, { memo, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/useApp'

import useRequest from '../hooks/useRequest'
import { ftListActions } from '../reducers/ft_list/reducer'
import { metadataSelectors } from '../reducers/metadata'
import { isFungibleTokenRequest } from '../utils/contracts/MultiSig'
import FungibleTokenChip from './Chips/FungibleTokenChip'
import RequestAction from './RequestAction'
import useConfirmTransaction from './Dialogs/ConfirmTransaction/useConfirmTransaction'
import confirmRequest from '../actions/chain/confirmRequest'
import deleteRequest from '../actions/chain/deleteRequest'

interface RequestProps {
  contractId: string
  requestId: number
}

const Request: React.FC<RequestProps> = memo(({ contractId, requestId }) => {
  const contractConfirmations = useAppSelector((state) => metadataSelectors.getNumConfirmations(state, contractId))
  const dispatch = useAppDispatch()
  const confirmTransaction = useConfirmTransaction()

  const { request, confirmations } = useRequest(contractId, requestId)

  const isFungibleToken = request ? isFungibleTokenRequest(request) : false
  const receiverId = request?.receiver_id

  useEffect(() => {
    if (isFungibleToken && receiverId) {
      dispatch(ftListActions.addFungibleToken({ tokenId: receiverId, contractId: contractId }))
    }
  }, [isFungibleToken, contractId, receiverId, dispatch])

  return (
    <>
      <TableRow>
        <TableCell>{requestId}</TableCell>
        <TableCell>
          <Stack direction="row" spacing={1}>
            {request?.actions.map((action, index) => (
              <RequestAction key={index} action={action} receiverId={request.receiver_id} />
            ))}
          </Stack>
        </TableCell>
        <TableCell>{renderReceiverId()}</TableCell>
        <TableCell align="right">{confirmations ? `${confirmations.length}/${contractConfirmations}` : '-'}</TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="success" onClick={handleConfirm} disabled={request === undefined}>
              Confirm
            </Button>
            <IconButton color="warning" onClick={handleDelete} disabled={request === undefined}>
              <Icon fontSize="inherit" className="material-symbols-outlined">
                clear
              </Icon>
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  )

  function renderReceiverId() {
    if (isFungibleToken && receiverId) {
      return <FungibleTokenChip tokenId={receiverId} contractId={contractId} />
    } else if (receiverId) {
      return `@${receiverId}`
    }
  }

  async function handleConfirm() {
    try {
      await confirmTransaction({
        onConfirmWithKey: async (key) => {
          const result = await dispatch(confirmRequest({ key, contractId, requestId })).unwrap()
          return typeof result.value === 'string' ? true : result.value
        },
        onConfirmWithLedger: async (ledgerManager) => {
          const result = await dispatch(confirmRequest({ ledgerManager, contractId, requestId })).unwrap()
          return typeof result.value === 'string' ? true : result.value
        },
      })
    } catch (e) {}
  }

  async function handleDelete() {
    try {
      await confirmTransaction({
        title: `Confirm deletion of Request ${requestId}`,
        onConfirmWithKey: async (key) => {
          await dispatch(deleteRequest({ key, contractId, requestId })).unwrap()
          return true
        },
        onConfirmWithLedger: async (ledgerManager) => {
          await dispatch(deleteRequest({ ledgerManager, contractId, requestId })).unwrap()
          return true
        },
      })
    } catch (e) {}
  }
})

export default Request
