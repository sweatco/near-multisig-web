import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import confirmRequest from '../../actions/chain/confirmRequest'
import fetchContractRequest from '../../actions/chain/fetchContractRequest'
import { MultiSigRequest } from '../../utils/MultiSigContract'

interface InvalidatedMultiSigRequest extends MultiSigRequest {
  invalidated?: boolean
}

interface RequestsState {
  requests: {
    [contractId: string]:
      | {
          [requestId: number]: InvalidatedMultiSigRequest
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchContractRequest.fulfilled, (state, action) => {
        const { contractId, requestId } = action.meta.arg
        const { request, confirmations } = action.payload

        state.requests[contractId] = state.requests[contractId] ?? {}
        state.requests[contractId]![requestId] = request

        state.confirmations[contractId] = state.confirmations[contractId] ?? {}
        state.confirmations[contractId]![requestId] = confirmations
      })
      .addCase(fetchContractRequest.rejected, (state, action) => {
        //
      })
      .addCase(confirmRequest.fulfilled, (state, action) => {
        const { contractId, requestId } = action.meta.arg
        if (typeof action.payload === 'boolean' && action.payload === true) {
          state.requests[contractId]![requestId].invalidated = true
        }
      })
  },
})

export const requestsActions = requestsSlice.actions
export default requestsSlice
