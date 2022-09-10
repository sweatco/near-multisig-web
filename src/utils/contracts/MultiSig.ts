import { Account, Contract } from 'near-api-js'

type RequestId = number
type Base58PublicKey = string
type AccountId = string
type MultiSigRequestAction = any

export interface MultiSigRequest {
  receiver_id: AccountId
  actions: MultiSigRequestAction[]
}

export interface MultiSig extends Contract {
  // View Method
  get_request(options: { request_id: RequestId }): Promise<MultiSigRequest>
  get_num_requests_pk(options: { public_key: Base58PublicKey }): Promise<number>
  list_request_ids(): Promise<RequestId[]>
  get_confirmations(options: { request_id: RequestId }): Promise<Base58PublicKey[]>
  get_num_confirmations(): Promise<number>
  get_request_nonce(): Promise<number>

  // Change Methods
  add_request(options: { request: MultiSigRequest }): Promise<RequestId>
  add_request_and_confirm(options: { request: MultiSigRequest }): Promise<RequestId>
  delete_request(options: { request_id: RequestId }): void
  confirm(options: { request_id: RequestId }, gas?: string, deposit?: string): Promise<boolean | string>
}

const CONTRACT_METHODS = {
  viewMethods: [
    'get_request',
    'get_num_requests_pk',
    'list_request_ids',
    'get_confirmations',
    'get_num_confirmations',
    'get_request_nonce',
  ],
  changeMethods: ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm'],
}

export const getContract = (account: Account, contractId: string) => {
  return new Contract(account, contractId, CONTRACT_METHODS) as MultiSig
}
