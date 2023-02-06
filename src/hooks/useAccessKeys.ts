import { useEffect, useState } from 'react'

import { useAppDispatch } from './useApp'
import fetchAccountKeys from '../actions/chain/fetchAccountKeys'
import { isFulfilled } from '@reduxjs/toolkit'
import { AccessKeyInfoView } from 'near-api-js/lib/providers/provider'

const isFulfilledAction = isFulfilled(fetchAccountKeys)

const useAccessKeys = (name: string) => {
  const dispatch = useAppDispatch()
  const [keys, setKeys] = useState<AccessKeyInfoView[]>()

  useEffect(() => {
    async function fetch() {
      const result = await dispatch(fetchAccountKeys(name))
      if (isFulfilledAction(result)) {
        setKeys(result.payload)
      }
    }
    fetch()
  }, [dispatch, name])

  return keys
}

export default useAccessKeys
