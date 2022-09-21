import BigNumber from 'bignumber.js'
import { NEAR_NOMINATION_EXP } from 'near-api-js/lib/utils/format'
import { FungibleTokenMetadata } from './contracts/FungibleToken'

export const BN = BigNumber.clone({ DECIMAL_PLACES: 2, ROUNDING_MODE: BigNumber.ROUND_FLOOR })

const formatBalance = (balance: string | BigNumber, metadata: FungibleTokenMetadata) => {
  const bn = new BN(balance)
  return bn.dividedBy(new BN(10).pow(metadata.decimals)).toFixed()
}

export const parseBalance = (balance: string, metadata: FungibleTokenMetadata) => {
  return BN(balance).multipliedBy(new BN(10).pow(metadata.decimals)).toFixed()
}

export const parseTgas = (tgas: number) => {
  if (tgas) {
    return BN(tgas).multipliedBy(new BN(10).pow(12)).toFixed()
  }
}

export const toNearBalance = (balance: string | BigNumber) => {
  return new BN(balance).dividedBy(new BN(10).pow(NEAR_NOMINATION_EXP))
}

export const formatNearBalance = (balance: string | BigNumber) => {
  return toNearBalance(balance).toFixed()
}

export default formatBalance
