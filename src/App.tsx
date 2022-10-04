import React, { useEffect, useMemo, useRef } from 'react'
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
import { Stack } from '@mui/system'

const drawerWidth = 320

const App = createAppComponent(() => {
  const addDialog = useDialog(handleAddDialogResult)
  const keyDialog = useDialog(handleKeyDialogResult)
  const dispatch = useAppDispatch()
  const location = useLocation()

  const contracts = useAppSelector(contractSelectors.getContracts)
  const selectedContracts = useMemo(() => getContractsFromHash(location.hash), [location.hash])

  const contractsRef = useRef<string[]>()
  useEffect(() => {
    if (contractsRef.current && selectedContractsRef.current) {
      const newSelectedContracts = selectedContractsRef.current.filter((contractId) => contracts.includes(contractId))
      if (newSelectedContracts.length !== selectedContractsRef.current.length) {
        if (newSelectedContracts.length === 0) {
          selectContracts([contracts[0]])
        } else {
          selectContracts(newSelectedContracts)
        }
      }
    }

    contractsRef.current = contracts
  }, [contracts])

  const selectedContractsRef = useRef<string[]>()
  useEffect(() => {
    const newContracts = selectedContracts.filter(
      (contractId) => contractsRef.current && !contractsRef.current.includes(contractId)
    )
    if (newContracts.length > 0) {
      dispatch(contractsActions.addContract(newContracts))
    }

    if (selectedContracts.length === 0 && contractsRef.current && contractsRef.current.length > 0) {
      selectContracts([contractsRef.current[0]])
    }

    selectedContractsRef.current = selectedContracts
  }, [selectedContracts, dispatch])

  const contractsToShow = contracts.filter((contractId) => selectedContracts.includes(contractId))

  return (
    <Box sx={{ display: 'flex' }}>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <DrawerWrapper drawerWidth={drawerWidth} onAction={handleAction}>
          <List>
            {contracts.map((contractId) => (
              <ContractMenuItem
                key={contractId}
                contractId={contractId}
                selected={selectedContracts.includes(contractId)}
                onClick={(event) => selectContract(contractId, event.metaKey)}
              />
            ))}
          </List>
        </DrawerWrapper>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 2, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Stack spacing={1}>
          {contractsToShow.map((contractId) => (
            <Contract key={contractId} name={contractId} />
          ))}
        </Stack>
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
    selectContract(result)
  }

  function selectContract(contractId: string, add = false) {
    if (add) {
      const contracts = getContractsFromHash(location.hash)
      if (!contracts.includes(contractId)) {
        selectContracts(contracts.concat(contractId))
      } else {
        selectContracts(contracts.filter((cid) => cid !== contractId))
      }
    } else {
      selectContracts([contractId])
    }
  }

  function selectContracts(contractIds: string[]) {
    window.location.hash = contractIds.join(',')
  }

  function handleKeyDialogResult(result: string) {
    //
  }
})

export default App
