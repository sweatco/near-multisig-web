import React, { useEffect, useState } from 'react'
import { Box, List } from '@mui/material'
import { useLocation } from 'react-router-dom'

import AddContractDialog from './components/Dialogs/AddContractDialog'
import GenerateKeyDialog from './components/Dialogs/GenerateKeyDialog'
import createAppComponent from './utils/createAppComponent'
import { contractsActions } from './reducers/contracts/reducer'
import { useAppDispatch, useAppSelector } from './hooks/useApp'
import { contractSelectors } from './reducers/contracts'
import Contract from './components/Contract'
import { useDialog } from './hooks/useDialog'
import ContractMenuItem from './components/ContractMenuItem'
import DrawerWrapper, { DrawerAction } from './components/DrawerWrapper'

const drawerWidth = 320

const App = createAppComponent(() => {
  const addDialog = useDialog(handleAddDialogResult)
  const keyDialog = useDialog(handleKeyDialogResult)
  const dispatch = useAppDispatch()
  const location = useLocation()

  const contracts = useAppSelector(contractSelectors.getContracts)
  const [selectedContract, setSelectedContract] = useState(contracts[0])

  // Watch state and add new contracts
  useEffect(() => {
    const contracts = getContractsFromHash(location.hash)
    if (contracts.length > 0) {
      dispatch(contractsActions.addContract(contracts))
      setSelectedContract(contracts[0])
      window.location.hash = ''
    }
  }, [dispatch, location])

  // Helps to switch to another contract whet selected got deleted
  useEffect(() => {
    if (!contracts.includes(selectedContract)) {
      setSelectedContract(contracts[0])
    }
  }, [contracts, selectedContract])

  return (
    <Box sx={{ display: 'flex' }}>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <DrawerWrapper drawerWidth={drawerWidth} onAction={handleAction}>
          <List>
            {contracts.map((contractId) => (
              <ContractMenuItem
                key={contractId}
                contractId={contractId}
                selected={contractId === selectedContract}
                onClick={() => setSelectedContract(contractId)}
              />
            ))}
          </List>
        </DrawerWrapper>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 2, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        {selectedContract ? <Contract name={selectedContract} /> : null}
      </Box>
      <AddContractDialog open={addDialog.open} onClose={addDialog.closeDialog} />
      <GenerateKeyDialog open={keyDialog.open} onClose={keyDialog.closeDialog} />
    </Box>
  )

  function getContractsFromHash(hash: string) {
    const contracts = hash.slice(1)
    if (contracts.length > 0) {
      return contracts
        .replaceAll(/[^a-z0-9.,_-]/gi, '')
        .toLocaleLowerCase()
        .split(',')
    }
    return []
  }

  function handleAction(drawerAction: DrawerAction) {
    switch (drawerAction) {
      case DrawerAction.addContract:
        addDialog.openDialog()
        break
      case DrawerAction.generateKey:
        keyDialog.openDialog()
        break
    }
  }

  function handleAddDialogResult(result: string) {
    dispatch(contractsActions.addContract([result.toLocaleLowerCase()]))
    setSelectedContract(result)
  }

  function handleKeyDialogResult(result: string) {
    //
  }
})

export default App
