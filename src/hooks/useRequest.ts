import * as nearAPI from 'near-api-js'
import { useCallback, useEffect } from 'react'

import { TestNet } from '../utils/networks'
import { getContract } from '../utils/MultiSigContract'
import { useAppDispatch, useAppSelector } from './useApp'
import { requestsActions } from '../reducers/requests/reducer'
import { requestsSelectors } from '../reducers/requests'

const useRequest = (contractId: string, requestId: number) => {
  const dispatch = useAppDispatch()
  const fetchData = useCallback(fetchDataAsync, [dispatch])

  const request = useAppSelector((state) => requestsSelectors.getRequest(state, contractId, requestId))
  const confirmations = useAppSelector((state) => requestsSelectors.getConfirmations(state, contractId, requestId))

  useEffect(() => {
    if (!request && !confirmations) {
      fetchData(contractId, requestId)
    }
  }, [fetchData, contractId, requestId, request, confirmations])

  return { request, confirmations }

  async function fetchDataAsync(contractId: string, requestId: number) {
    const near = await nearAPI.connect(TestNet)
    const account = await near.account(contractId)
    const contract = getContract(account, contractId)

    try {
      const [request, confirmations] = await Promise.all([
        contract.get_request({ request_id: requestId }),
        contract.get_confirmations({ request_id: requestId }),
      ])
      dispatch(requestsActions.setRequest({ contractId, requestId, request, confirmations }))
    } catch (e) {
      // dispatch(requestsActions.setRequest({ contractId, requestId, metadata: { failed: true } }))
    }
  }
}

export default useRequest
