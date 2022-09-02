import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from './useApp'
import { metadataSelectors } from '../reducers/metadata'
import { contractsActions } from '../reducers/contracts/reducer'
import fetchContract from '../actions/chain/fetchContract'

const useContract = (name: string) => {
  const dispatch = useAppDispatch()

  const balance = useAppSelector((state) => metadataSelectors.getBalance(state, name))
  const confirmations = useAppSelector((state) => metadataSelectors.getNumConfirmations(state, name))
  const requestIds = useAppSelector((state) => metadataSelectors.getRequestIds(state, name))
  const failed = useAppSelector((state) => metadataSelectors.getFailed(state, name))
  const invalidated = useAppSelector((state) => metadataSelectors.getInvalidated(state, name))

  useEffect(() => {
    dispatch(fetchContract(name))
  }, [dispatch, name, invalidated])

  return { failed, balance, confirmations, remove, requestIds }

  function remove() {
    dispatch(contractsActions.removeContract(name))
  }
}

export default useContract
