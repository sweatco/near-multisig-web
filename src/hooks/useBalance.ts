import { useEffect, useMemo } from 'react'

import { useAppDispatch, useAppSelector } from './useApp'
import { ftBalancesSelectors } from '../reducers/ft_balances'
import fetchFTBalance from '../actions/chain/fetchFTBalance'
import { metadataSelectors } from '../reducers/metadata'
import useFTMetadata from './useFTMetadata'
import { BN, toNearBalance } from '../utils/formatBalance'

const useBalance = (accountId: string, tokenId?: string) => {
  const nearBalance = useAppSelector((state) => metadataSelectors.getBalance(state, accountId))

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const accountBalanceSelector = useMemo(ftBalancesSelectors.makeAccountBalanceSelector, [])
  const balance = useAppSelector((state) => accountBalanceSelector(state, accountId, tokenId))
  const metadata = useFTMetadata(tokenId)

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (tokenId) {
      dispatch(fetchFTBalance({ tokenId: tokenId, accountId: accountId }))
    }
  }, [dispatch, tokenId, accountId])

  if (!tokenId && nearBalance) {
    return toNearBalance(nearBalance.available)
  } else if (tokenId && balance && metadata) {
    return new BN(balance.balance).dividedBy(new BN(10).pow(metadata?.decimals))
  }
}

export default useBalance
