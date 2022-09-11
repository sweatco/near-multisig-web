import React, { memo, useState } from 'react'
import { Alert, Button, Snackbar, Stack, TableCell, TableRow } from '@mui/material'
import { useAppSelector } from '../hooks/useApp'
import { useDialog } from '../hooks/useDialog'

import useRequest from '../hooks/useRequest'
import { metadataSelectors } from '../reducers/metadata'
import { isFungibleTokenRequest } from '../utils/contracts/MultiSig'
import ConfirmRequestDialog from './ConfirmRequestDialog'
import FungibleTokenChip from './FungibleTokenChip'
import RequestAction from './RequestAction'

interface RequestProps {
  contractId: string
  requestId: number
}

const Request: React.FC<RequestProps> = memo(({ contractId, requestId }) => {
  const contractConfirmations = useAppSelector((state) => metadataSelectors.getNumConfirmations(state, contractId))

  const { request, confirmations } = useRequest(contractId, requestId)
  const { open, openDialog, closeDialog } = useDialog(handleDialogResult)
  const [result, setResult] = useState<boolean | string>()
  const [resultVisible, setResultVisible] = useState(false)

  const isFungibleToken = request ? isFungibleTokenRequest(request) : false
  const receiverId = request?.receiver_id

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
          <Button variant="contained" color="success" onClick={handleConfirm} disabled={request === undefined}>
            Confirm
          </Button>
          {request ? (
            <>
              <ConfirmRequestDialog contractId={contractId} requestId={requestId} open={open} onClose={closeDialog} />
              <Snackbar open={resultVisible} autoHideDuration={6000} onClose={handleSnackClose}>
                <Alert
                  onClose={handleSnackClose}
                  severity={result === true ? 'success' : 'error'}
                  variant="filled"
                  sx={{ width: '100%' }}>
                  {typeof result === 'string'
                    ? result
                    : result === true
                    ? 'Successfully confirmed!'
                    : 'Confirmation failed'}
                </Alert>
              </Snackbar>
            </>
          ) : null}
        </TableCell>
      </TableRow>
    </>
  )

  function renderReceiverId() {
    if (isFungibleToken && receiverId) {
      return <FungibleTokenChip tokenId={receiverId} />
    } else if (receiverId) {
      return `@${receiverId}`
    }
  }

  function handleConfirm() {
    openDialog()
  }

  function handleDialogResult(result?: boolean | Error) {
    if (result instanceof Error) {
      if ('kind' in result) {
        setResult((result as any).kind?.ExecutionError ?? 'Unknown error')
      } else {
        setResult(result.message)
      }
    } else if (typeof result === 'boolean') {
      setResult(result)
    } else {
      setResult('Unknown error')
    }

    setResultVisible(true)
  }

  function handleSnackClose() {
    setResultVisible(false)
  }
})

export default Request
