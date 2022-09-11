import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ContractId = string

interface FTListState {
  ftList: {
    [ftTokenId: string]: ContractId[]
  }
}

export const ftListSlice = createSlice({
  name: 'ft_list',
  initialState: { ftList: {} } as FTListState,
  reducers: {
    addFTToken(state, action: PayloadAction<{ ftTokenId: string; contractId: string }>) {
      const { ftTokenId, contractId } = action.payload
      state.ftList[ftTokenId] = state.ftList[ftTokenId] ?? []

      if (!state.ftList[ftTokenId].includes(contractId)) {
        state.ftList[ftTokenId].push(contractId)
      }
    },
  },
})

export const ftListActions = ftListSlice.actions
export default ftListSlice
