import { createAsyncThunk } from '@reduxjs/toolkit'
import { getContract } from '../../utils/contracts/MultiSig'
import { ErrorObject, errorToJson, createAccountWithSigner } from '../../utils/chainHelpers'

const fetchContractRequestList = createAsyncThunk<
  number[],
  string,
  {
    rejectValue: ErrorObject
  }
>('chain/fetchContractRequestList', async (contractId, { rejectWithValue }) => {
  const account = createAccountWithSigner(contractId)
  const contract = getContract(account, contractId)

  try {
    return contract.list_request_ids()
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default fetchContractRequestList
