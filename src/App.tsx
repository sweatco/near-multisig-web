import React from 'react'
import { Box, Button } from '@mui/material'

import AddContractDialog from './components/AddContractDialog'
import createAppComponent from './utils/createAppComponent'
import { contractsActions } from './reducers/contracts/reducer'
import { useAppDispatch, useAppSelector } from './hooks/useApp'
import { contractSelectors } from './reducers/contracts'
import Contract from './components/Contract'
import { useDialog } from './hooks/useDialog'
import GenerateKeyDialog from './components/GenerateKeyDialog'

const App = createAppComponent(() => {
  const { open, openDialog, closeDialog } = useDialog(handleDialogResult)
  const { open: keyOpen, openDialog: openKeyDialog, closeDialog: closeKeyDialog } = useDialog(handleDialogResult)
  const dispatch = useAppDispatch()
  const contracts = useAppSelector(contractSelectors.getContracts)

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Button onClick={openDialog}>Add multisig contract</Button>
        <Button onClick={openKeyDialog}>Generate Key</Button>
        {contracts.map((contract) => (
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
