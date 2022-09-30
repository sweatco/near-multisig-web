import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from './useApp'
import { metadataSelectors } from '../reducers/metadata'
import fetchContractRequestList from '../actions/chain/fetchContractRequestList'

const useContractRequestList = (name: string) => {
  const dispatch = useAppDispatch()

  const requestIds = useAppSelector((state) => metadataSelectors.getRequestIds(state, name))
  const failed = useAppSelector((state) => metadataSelectors.getFailed(state, name))
  const invalidated = useAppSelector((state) => metadataSelectors.getInvalidated(state, name))

  useEffect(() => {
    dispatch(fetchContractRequestList(name))
  }, [dispatch, name, invalidated])

  return { failed, requestIds }
}

export default useContractRequestList
