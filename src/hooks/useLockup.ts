import { useEffect, useMemo } from 'react'

import fetchLockup from '../actions/chain/fetchLockup'
import { useAppDispatch, useAppSelector } from './useApp'
import { ftLockupsSelectors } from '../reducers/ft_lockups'

const useLockup = (contractId: string, tokenId: string, lockupId: string) => {
  const dispatch = useAppDispatch()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lockupsSelector = useMemo(ftLockupsSelectors.makeLockupsSelector, [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const aggregatedLockupsSelector = useMemo(ftLockupsSelectors.makeAggregatedSelector, [])

  const lockups = useAppSelector((state) => lockupsSelector(state, contractId, tokenId, lockupId))
  const aggregatedLockup = useAppSelector((state) => aggregatedLockupsSelector(state, contractId, tokenId, lockupId))

  useEffect(() => {
    dispatch(fetchLockup({ contractId, tokenId, lockupId }))
  }, [dispatch, contractId, tokenId, lockupId])

  if (aggregatedLockup && lockups) {
    return {
      unclaimed: aggregatedLockup.unclaimed_balance,
      total: aggregatedLockup.total_balance.minus(aggregatedLockup.claimed_balance),
      lockups,
    }
  }
}

export default useLockup
