import { useMemo } from 'react'
import { ftListSelectors } from '../reducers/ft_list'
import { useAppSelector } from './useApp'

const useFTListSelector = (contractId: string) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ftListSelector = useMemo(ftListSelectors.makeFTListSelector, [])
  return useAppSelector((state) => ftListSelector(state, contractId))
}

export default useFTListSelector
