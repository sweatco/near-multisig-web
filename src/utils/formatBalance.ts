import BigNumber from 'bignumber.js'
import { FungibleTokenMetadata } from './contracts/FungibleToken'

export const BN = BigNumber.clone({ DECIMAL_PLACES: 2, ROUNDING_MODE: BigNumber.ROUND_FLOOR })

const formatBalance = (balance: string | BigNumber, metadata: FungibleTokenMetadata) => {
  const bn = new BN(balance)
  return bn.dividedBy(new BN(10).pow(metadata.decimals)).toFixed()
}

export default formatBalance
