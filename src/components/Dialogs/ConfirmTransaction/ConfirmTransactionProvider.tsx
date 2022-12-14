import React, { useCallback, useState } from 'react'
import { useSnackbar } from 'notistack'

import ConfirmContext, { ConfirmTransactionOptions } from './ConfirmTransactionContext'
import ConfirmTransactionDialog from './ConfirmTransactionDialog'
import { ErrorObject, errorToMessage } from '../../../utils/chainHelpers'

type ResolveReject = [(result: boolean) => void, (reason?: string) => void]

export const ConfirmTransactionProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar()

  const [options, setOptions] = useState<ConfirmTransactionOptions>()
  const [resolveReject, setResolveReject] = useState<ResolveReject | []>([])
  const [resolve, reject] = resolveReject

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
        enqueueSnackbar(result === true ? 'Successfully confirmed!' : 'Confirmation failed', {
          variant: result === true ? 'success' : 'error',
        })

        resolve(result)
        handleClose()
      }
    },
    [resolve, handleClose, enqueueSnackbar]
  )

  const handleFail = useCallback(
    (reason: ErrorObject) => {
      if (reject) {
        const rejectReason = errorToMessage(reason)

        enqueueSnackbar(rejectReason, {
          variant: 'error',
        })

        reject(rejectReason)
        handleClose()
      }
    },
    [reject, handleClose, enqueueSnackbar]
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
    </>
  )
}
