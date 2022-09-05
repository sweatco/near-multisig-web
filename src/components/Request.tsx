import { Alert, Button, Snackbar, TableCell, TableRow } from '@mui/material'
import React, { memo, useState } from 'react'
import { useDialog } from '../hooks/useDialog'

import useRequest from '../hooks/useRequest'
import ConfirmRequestDialog from './ConfirmRequestDialog'
import RequestAction from './RequestAction'

interface RequestProps {
  contractId: string
  requestId: number
}

const Request: React.FC<RequestProps> = memo(({ contractId, requestId }) => {
  const { request, confirmations } = useRequest(contractId, requestId)
  const { open, openDialog, closeDialog } = useDialog(handleDialogResult)
  const [result, setResult] = useState<boolean | string>()
  const [resultVisible, setResultVisible] = useState(false)
  return (
    <>
      <TableRow>
        <TableCell>{requestId}</TableCell>
        <TableCell>
          {request?.actions.map((action, index) => (
            <RequestAction key={index} action={action} />
          ))}
        </TableCell>
        <TableCell>{request ? `@${request.receiver_id}` : '-'}</TableCell>
        <TableCell align="right">{confirmations?.length ?? '-'}</TableCell>
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
