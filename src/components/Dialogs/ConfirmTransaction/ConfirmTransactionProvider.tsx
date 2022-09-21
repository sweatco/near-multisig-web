import { Alert, Snackbar } from '@mui/material'
import React, { useCallback, useState } from 'react'
import ConfirmContext, { ConfirmTransactionOptions } from './ConfirmTransactionContext'
import ConfirmTransactionDialog from './ConfirmTransactionDialog'

type ResolveReject = [(result: boolean) => void, (reason?: string) => void]

export const ConfirmTransactionProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [options, setOptions] = useState<ConfirmTransactionOptions>()
  const [resolveReject, setResolveReject] = useState<ResolveReject | []>([])
  const [resolve, reject] = resolveReject

  const [result, setResult] = useState<boolean | string>()
  const [resultVisible, setResultVisible] = useState(false)

  const confirm = useCallback((options: ConfirmTransactionOptions) => {
    return new Promise((resolve, reject) => {
      setOptions(options)
      setResolveReject([resolve, reject])
    })
  }, [])

  const handleClose = useCallback(() => {
    if (reject) {
      reject()
    }
    setResolveReject([])
  }, [reject])

  const handleResult = useCallback(
    (result: boolean) => {
      if (resolve) {
        setResult(result)
        setResultVisible(true)
        resolve(result)
        handleClose()
      }
    },
    [resolve, handleClose]
  )

  const handleFail = useCallback(
    (reason: any) => {
      if (reject) {
        let rejectReason = 'Unknown error'
        if (reason instanceof Error) {
          if ('kind' in reason) {
            rejectReason = (reason as any).kind?.ExecutionError ?? 'Unknown error'
          } else {
            rejectReason = reason.message
          }
        }

        setResult(rejectReason)
        setResultVisible(true)
        reject(rejectReason)
        handleClose()
      }
    },
    [reject, handleClose]
  )

  return (
    <>
      <ConfirmContext.Provider value={confirm}>{children}</ConfirmContext.Provider>
      <ConfirmTransactionDialog
        open={resolveReject.length === 2}
        onClose={handleClose}
        onResult={handleResult}
        onFail={handleFail}
        {...options}
      />
      <Snackbar
        open={resultVisible}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        TransitionProps={{
          onExited: handleSnackExit,
        }}>
        <Alert onClose={handleSnackClose} severity={result === true ? 'success' : 'error'} variant="filled">
          {gerResultMessage()}
        </Alert>
      </Snackbar>
    </>
  )

  function gerResultMessage() {
    if (typeof result === 'string') {
      return result
    } else if (result === true) {
      return 'Successfully confirmed!'
    } else {
      return 'Confirmation failed'
    }
  }

  function handleSnackClose() {
    setResultVisible(false)
  }

  function handleSnackExit() {
    setResult(undefined)
  }
}
