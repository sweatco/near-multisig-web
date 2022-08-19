import * as nearAPI from 'near-api-js'
import { useCallback, useEffect } from 'react'

import { TestNet } from '../utils/networks'
import { getContract } from '../utils/MultiSigContract'
import { useAppDispatch, useAppSelector } from './useApp'
import { metadataActions } from '../reducers/metadata/reducer'
import { metadataSelectors } from '../reducers/metadata'
import { contractsActions } from '../reducers/contracts/reducer'

const useContract = (name: string) => {
  const dispatch = useAppDispatch()
  const fetchData = useCallback(fetchDataAsync, [dispatch])

  const balance = useAppSelector((state) => metadataSelectors.getBalance(state, name))
  const confirmations = useAppSelector((state) => metadataSelectors.getNumConfirmations(state, name))
  const requestIds = useAppSelector((state) => metadataSelectors.getRequestIds(state, name))
  const failed = useAppSelector((state) => metadataSelectors.getFailed(state, name))

  useEffect(() => {
    fetchData(name)
  }, [fetchData, name])

  return { failed, balance, confirmations, remove, requestIds }

  async function fetchDataAsync(contractId: string) {
    const near = await nearAPI.connect(TestNet)
    const account = await near.account(contractId)
    const contract = getContract(account, contractId)

    try {
      const [balance, num_confirmations, request_ids] = await Promise.all([
        account.getAccountBalance(),
        contract.get_num_confirmations(),
        contract.list_request_ids(),
      ])
      dispatch(metadataActions.setMetadata({ contractId, metadata: { balance, num_confirmations, request_ids } }))
    } catch (e) {
      dispatch(metadataActions.setMetadata({ contractId, metadata: { failed: true } }))
    }
  }

  function remove() {
    dispatch(contractsActions.removeContract(name))
  }
}

export default useContract
