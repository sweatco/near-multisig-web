import { useEffect, useMemo } from 'react'

import { useAppDispatch, useAppSelector } from './useApp'
import { ftBalancesSelectors } from '../reducers/ft_balances'
import fetchFTBalance from '../actions/chain/fetchFTBalance'

const useFTBalance = (accountId: string, tokenId: string) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const accountBalanceSelector = useMemo(ftBalancesSelectors.makeAccountBalanceSelector, [])
  const balance = useAppSelector((state) => accountBalanceSelector(state, accountId, tokenId))

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchFTBalance({ tokenId: tokenId, accountId: accountId }))
  }, [dispatch, tokenId, accountId])

  return balance?.balance
}

export default useFTBalance
