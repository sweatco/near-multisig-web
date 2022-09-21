import { MultiSigRequest } from './contracts/MultiSig'
import { BN } from './formatBalance'

interface StorageDepositArgs {
  account_id: string
  registration_only?: boolean
}

interface FTTransferArgs {
  receiver_id: string
  amount: string
}

interface FTTransferAction {
  type: string
  receiver_id: string
  deposit: string
  amount: string
  gas: string
}

export const isFungibleTokenRequest = (request: MultiSigRequest) => {
  for (const action of request.actions) {
    if (action.type === 'FunctionCall' && action.method_name === 'ft_transfer') {
      return true
    }
  }
  return false
}

const mergeActions = (action1: FTTransferAction, action2: FTTransferAction): FTTransferAction => {
  return {
    type: action1.type,
    receiver_id: action1.receiver_id,
    deposit: BN(action1.deposit).plus(BN(action2.deposit)).toFixed(),
    amount: BN(action1.amount).plus(BN(action2.amount)).toFixed(),
    gas: BN(action1.gas).plus(BN(action2.gas)).toFixed(),
  }
}

export const humanifyActions = (request: MultiSigRequest) => {
  const actions: any[] = []
  const ftTransfers: FTTransferAction[] = []
  const ftTransfersIds: string[] = []

  request.actions.forEach((action) => {
    if (action.type === 'FunctionCall') {
      if (action.method_name === 'storage_deposit') {
        const args: StorageDepositArgs = base64ToJson(action.args)
        if (args) {
          const transferAction: FTTransferAction = {
            type: 'FTTransfer',
            receiver_id: args.account_id,
            deposit: action.deposit,
            amount: '0',
            gas: action.gas ?? '0',
          }

          const transferIndex = ftTransfersIds.indexOf(args.account_id)
          if (transferIndex !== -1) {
            ftTransfers[transferIndex] = mergeActions(ftTransfers[transferIndex], transferAction)
          } else {
            ftTransfers.push(transferAction)
            ftTransfersIds.push(transferAction.receiver_id)
          }
        }
        return
      } else if (action.method_name === 'ft_transfer') {
        const args: FTTransferArgs = base64ToJson(action.args)
        if (args) {
          const transferAction: FTTransferAction = {
            type: 'FTTransfer',
            receiver_id: args.receiver_id,
            deposit: action.deposit ?? '0',
            amount: args.amount,
            gas: action.gas ?? '0',
          }

          const transferIndex = ftTransfersIds.indexOf(args.receiver_id)
          if (transferIndex !== -1) {
            ftTransfers[transferIndex] = mergeActions(ftTransfers[transferIndex], transferAction)
          } else {
            ftTransfers.push(transferAction)
            ftTransfersIds.push(transferAction.receiver_id)
          }
        }
        return
      }
    }
    actions.push(action)
  })

  return ftTransfers.concat(actions)
}

export const base64ToJson = (input: string) => {
  let args = Buffer.from(input, 'base64').toString('utf8')
  try {
    return JSON.parse(args)
  } catch (e) {}
  return
}

export const getReceiverList = (request: MultiSigRequest, actions: any[]) => {
  let receiverList: string[] = []
  let otherActions = 0

  actions.forEach((action) => {
    if (action.type === 'FTTransfer') {
      receiverList.push(action.receiver_id)
    } else {
      otherActions++
    }
  })

  if (otherActions > 0) {
    receiverList = [request.receiver_id].concat(receiverList)
  }

  return receiverList
}
