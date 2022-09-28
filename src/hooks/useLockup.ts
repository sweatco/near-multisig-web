import { useEffect, useMemo } from 'react'

import fetchLockup from '../actions/chain/fetchLockup'
import { useAppDispatch, useAppSelector } from './useApp'
import { ftLockupsSelectors } from '../reducers/ft_lockups'

const useLockup = (contractId: string, tokenId: string, lockupId: string) => {
  const dispatch = useAppDispatch()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lockupsSelector = useMemo(ftLockupsSelectors.makeLockupsSelector, [])
  const lockup = useAppSelector((state) => lockupsSelector(state, contractId, tokenId, lockupId))

  useEffect(() => {
    dispatch(fetchLockup({ contractId, tokenId, lockupId }))
  }, [dispatch, contractId, tokenId, lockupId])

  if (lockup) {
    return {
      unclaimed: lockup.unclaimed_balance,
      total: lockup.total_balance.minus(lockup.claimed_balance),
    }
  }
}

export default useLockup
