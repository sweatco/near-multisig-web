import { useMemo } from 'react'
import { ftListSelectors } from '../reducers/ft_list'
import { useAppSelector } from './useApp'

const useLockupList = (contractId: string, tokenId: string) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lockupListSelector = useMemo(ftListSelectors.makeLockupListSelector, [])
  return useAppSelector((state) => lockupListSelector(state, contractId, tokenId))
}

export default useLockupList
