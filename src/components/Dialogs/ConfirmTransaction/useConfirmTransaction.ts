import { useContext } from 'react'
import ConfirmTransactionContext from './ConfirmTransactionContext'

const useConfirmTransaction = () => {
  const confirm = useContext(ConfirmTransactionContext)
  return confirm
}

export default useConfirmTransaction
