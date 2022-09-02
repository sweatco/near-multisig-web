import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from './useApp'
import { requestsSelectors } from '../reducers/requests'
import fetchContractRequest from '../actions/chain/fetchContractRequest'

const useRequest = (contractId: string, requestId: number) => {
  const dispatch = useAppDispatch()

  const request = useAppSelector((state) => requestsSelectors.getRequest(state, contractId, requestId))
  const confirmations = useAppSelector((state) => requestsSelectors.getConfirmations(state, contractId, requestId))

  useEffect(() => {
    if ((!request && !confirmations) || (request && request.invalidated)) {
      dispatch(fetchContractRequest({ contractId, requestId }))
    }
  }, [dispatch, contractId, requestId, request, confirmations])

  return { request, confirmations }
}

export default useRequest
