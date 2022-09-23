import { Button, Icon, IconButton, Stack, TableCell, TableRow } from '@mui/material'
import React, { memo, useEffect } from 'react'
import { useSnackbar } from 'notistack'

import useRequest from '../hooks/useRequest'
import { useAppDispatch, useAppSelector } from '../hooks/useApp'
import { ftListActions } from '../reducers/ft_list/reducer'
import { metadataSelectors } from '../reducers/metadata'
import RequestAction from './RequestAction'
import useConfirmTransaction from './Dialogs/ConfirmTransaction/useConfirmTransaction'
import confirmRequest, { ConfirmRequestResult } from '../actions/chain/confirmRequest'
import deleteRequest from '../actions/chain/deleteRequest'
import { getReceiverList, humanifyActions, isFungibleTokenRequest } from '../utils/multisigHelpers'
import fetchFTBalance from '../actions/chain/fetchFTBalance'
import { DefaultNet } from '../utils/networks'

interface RequestProps {
  contractId: string
  requestId: number
}

const Request: React.FC<RequestProps> = memo(({ contractId, requestId }) => {
  const contractConfirmations = useAppSelector((state) => metadataSelectors.getNumConfirmations(state, contractId))

  const dispatch = useAppDispatch()
  const confirmTransaction = useConfirmTransaction()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { request, confirmations } = useRequest(contractId, requestId)

  const isFungibleToken = request ? isFungibleTokenRequest(request) : false
  const receiverId = request?.receiver_id

  const humanActions = request ? humanifyActions(request) : []
  const receiverList = request ? getReceiverList(request, humanActions) : []

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
            {request &&
              humanActions.map((action, index) => (
                <RequestAction key={index} action={action} request={request} contractId={contractId} />
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
    return receiverList.map((receiver) => `@${receiver}`).join(', ')
  }

  async function handleConfirm() {
    function checkResult(result: ConfirmRequestResult) {
      if (isFungibleToken && request && result.value === '') {
        dispatch(fetchFTBalance({ tokenId: request.receiver_id, accountId: contractId, force: true }))
      }

      if (result.value === '') {
        setTimeout(() => {
          enqueueSnackbar('Confirmation details', {
            variant: 'default',
            persist: true,
            action: (snackbarId) => (
              <>
                <Button
                  size="medium"
                  onClick={() => {
                    window.open(`${DefaultNet.explorerUrl}/transactions/${result.txHash}`, '_blank')
                  }}>
                  Open TX
                </Button>
                <Button
                  color="error"
                  size="medium"
                  onClick={() => {
                    closeSnackbar(snackbarId)
                  }}>
                  Dismiss
                </Button>
              </>
            ),
          })
        }, 500)
      }

      return typeof result.value === 'string' ? true : result.value
    }

    try {
      await confirmTransaction({
        onConfirmWithKey: async (key) => {
          const result = await dispatch(confirmRequest({ key, contractId, requestId })).unwrap()
          return checkResult(result)
        },
        onConfirmWithLedger: async (ledgerManager) => {
          const result = await dispatch(confirmRequest({ ledgerManager, contractId, requestId })).unwrap()
          return checkResult(result)
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
