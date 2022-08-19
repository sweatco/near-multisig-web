import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MultiSigRequest } from '../../utils/MultiSigContract'

interface RequestsState {
  requests: {
    [contractId: string]:
      | {
          [requestId: number]: MultiSigRequest
        }
      | undefined
  }
  confirmations: {
    [contractId: string]:
      | {
          [requestId: number]: string[]
        }
      | undefined
  }
}

export const requestsSlice = createSlice({
  name: 'requests',
  initialState: { requests: {}, confirmations: {} } as RequestsState,
  reducers: {
    setRequest(
      state,
      action: PayloadAction<{
        contractId: string
        requestId: number
        request: MultiSigRequest
        confirmations: string[]
      }>
    ) {
      const { contractId, requestId, request, confirmations } = action.payload
      state.requests[contractId] = state.requests[contractId] ?? {}
      state.requests[contractId]![requestId] = request

      state.confirmations[contractId] = state.confirmations[contractId] ?? {}
      state.confirmations[contractId]![requestId] = confirmations
    },
  },
})

export const requestsActions = requestsSlice.actions
export default requestsSlice
