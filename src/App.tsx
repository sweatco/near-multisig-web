import React, { useEffect, useMemo } from 'react'
import { Box, Button } from '@mui/material'

import AddContractDialog from './components/Dialogs/AddContractDialog'
import GenerateKeyDialog from './components/Dialogs/GenerateKeyDialog'
import createAppComponent from './utils/createAppComponent'
import { contractsActions } from './reducers/contracts/reducer'
import { useAppDispatch, useAppSelector } from './hooks/useApp'
import { contractSelectors } from './reducers/contracts'
import Contract from './components/Contract'
import { useDialog } from './hooks/useDialog'

const App = createAppComponent(() => {
  const { open, openDialog, closeDialog } = useDialog(handleDialogResult)
  const { open: keyOpen, openDialog: openKeyDialog, closeDialog: closeKeyDialog } = useDialog(handleDialogResult)
  const dispatch = useAppDispatch()

  const contracts = useAppSelector(contractSelectors.getContracts)
  const contractIdFromHash = window.location.hash?.slice(1)
  const sortedContracts = useMemo(() => {
    if (contractIdFromHash && contractIdFromHash.length > 0) {
      const contractIndex = contracts.indexOf(contractIdFromHash)
      if (contractIndex !== -1) {
        return [contractIdFromHash].concat(contracts.filter((id) => id !== contractIdFromHash))
      }
    }
    return contracts
  }, [contracts, contractIdFromHash])

  useEffect(() => {
    if (contractIdFromHash && contractIdFromHash.length > 0) {
      dispatch(contractsActions.addContract(contractIdFromHash))
    }
  }, [dispatch, contractIdFromHash])

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Button onClick={openDialog}>Add multisig contract</Button>
        <Button onClick={openKeyDialog}>Generate Key</Button>
        {sortedContracts.map((contract) => (
          <Contract name={contract} key={contract} />
        ))}
      </Box>
      <AddContractDialog open={open} onClose={closeDialog} />
      <GenerateKeyDialog open={keyOpen} onClose={closeKeyDialog} />
    </>
  )

  function handleDialogResult(result: string) {
    dispatch(contractsActions.addContract(result))
  }
})

export default App
