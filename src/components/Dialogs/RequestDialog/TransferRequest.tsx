import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useMemo } from 'react'

import addRequest, { AddRequestResult } from '../../../actions/chain/addRequest'
import viewAccount from '../../../actions/chain/viewAccount'
import { useAppDispatch } from '../../../hooks/useApp'
import useBalance from '../../../hooks/useBalance'
import useFTListSelector from '../../../hooks/useFTListSelector'
import { BN, parseBalance, parseTgas } from '../../../utils/formatBalance'
import FungibleTokenChip from '../../Chips/FungibleTokenChip'
import NearTokenChip from '../../Chips/NearTokenChip'
import useConfirmTransaction from '../ConfirmTransaction/useConfirmTransaction'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import useFTMetadata from '../../../hooks/useFTMetadata'
import fetchFTStorageBalance from '../../../actions/chain/fetchFTStorageBalance'
import fetchFTBalance from '../../../actions/chain/fetchFTBalance'

interface TransferRequestProps {
  contractId: string
  onClose(result?: boolean): void
}

const NEAR = 'near'

enum ReceiverResponse {
  NOT_CHECKED = 0,
  EXISTS,
  FAIL,
}

const TransferRequest: React.FC<TransferRequestProps> = ({ contractId, onClose }) => {
  const dispatch = useAppDispatch()
  const [token, setToken] = useState(NEAR)
  const [receiver, setReceiver] = useState('')
  const [receiverResponse, setReceiverResponse] = useState(ReceiverResponse.NOT_CHECKED)
  const [amount, setAmount] = useState('')
  const confirmTransaction = useConfirmTransaction()

  const ftList = useFTListSelector(contractId)
  const ftBalance = useBalance(contractId, token !== NEAR ? token : undefined)
  const ftMetadata = useFTMetadata(token !== NEAR ? token : undefined)

  const isValidAmount = useMemo(() => {
    const parsedAmount = parseFloat(amount)
    return !isNaN(parsedAmount) && ftBalance && BN(parsedAmount).lte(ftBalance)
  }, [amount, ftBalance])

  useEffect(() => {
    async function checkReceiver() {
      if (receiver !== '') {
        try {
          await dispatch(viewAccount(receiver)).unwrap()
          setReceiverResponse(ReceiverResponse.EXISTS)
        } catch (err) {
          setReceiverResponse(ReceiverResponse.FAIL)
        }
      } else {
        setReceiverResponse(ReceiverResponse.NOT_CHECKED)
      }
    }

    const timeout = setTimeout(checkReceiver, 800)

    return () => {
      clearTimeout(timeout)
    }
  }, [receiver, dispatch])

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent sx={{ mb: -3 }}>
        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel id="demo-simple-select-label">Choose token</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={token}
                label="Choose token"
                onChange={handleTokenChange}>
                <MenuItem value={NEAR}>
                  <NearTokenChip contractId={contractId} withBalance />
                </MenuItem>
                {ftList.map((token) => (
                  <MenuItem key={token} value={token}>
                    <FungibleTokenChip contractId={contractId} tokenId={token} withBalance />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box flex={1}></Box>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ minHeight: 105 }}>
          <Box flex={1}>
            <TextField
              fullWidth
              label="Enter recepient"
              variant="outlined"
              margin="normal"
              color={receiverResponse === ReceiverResponse.FAIL ? 'warning' : undefined}
              autoComplete="off"
              value={receiver}
              onChange={handleReceiverChange}
              helperText={receiverResponse === ReceiverResponse.FAIL ? 'Account does not exist on-chain' : undefined}
            />
          </Box>
          <Box flex={1}>
            <TextField
              fullWidth
              label="Enter amount"
              variant="outlined"
              margin="normal"
              autoComplete="off"
              value={amount}
              onChange={handleAmountChange}
              helperText={amount !== '' && !isValidAmount ? `MAX you can send ${ftBalance?.toFormat()}` : null}
              error={amount !== '' && !isValidAmount}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button type="submit" disabled={getDisabledStatus()}>
          Send Request
        </Button>
      </DialogActions>
    </form>
  )

  function getDisabledStatus() {
    return !(receiver !== '' && amount !== '' && isValidAmount)
  }

  async function getRequest() {
    if (token === NEAR) {
      return {
        receiver_id: receiver,
        actions: [{ type: 'Transfer', amount: parseNearAmount(amount) }],
      }
    } else if (ftMetadata) {
      const actions = []

      if (!(await dispatch(fetchFTStorageBalance({ tokenId: token, accountId: receiver })).unwrap())) {
        actions.push({
          type: 'FunctionCall',
          gas: parseTgas(10),
          method_name: 'storage_deposit',
          args: Buffer.from(JSON.stringify({ account_id: receiver, registration_only: true })).toString('base64'),
          deposit: parseNearAmount('0.0009'),
        })
      }

      actions.push({
        type: 'FunctionCall',
        gas: parseTgas(10),
        method_name: 'ft_transfer',
        args: Buffer.from(JSON.stringify({ amount: parseBalance(amount, ftMetadata), receiver_id: receiver })).toString(
          'base64'
        ),
        deposit: '1',
      })

      return {
        receiver_id: token,
        actions: actions,
      }
    } else {
      throw new Error('Request generation failed')
    }
  }

  function handleCancel() {
    onClose()
  }

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    function checkResult(result: AddRequestResult) {
      if (typeof result.value !== 'number') {
        ftList.forEach((tokenId) => {
          dispatch(fetchFTBalance({ accountId: contractId, tokenId, force: true }))
        })
      }
    }

    event?.preventDefault()
    try {
      if (
        await confirmTransaction({
          contractId,
          onConfirmWithKey: async (key) => {
            const result = await dispatch(
              addRequest({ key, contractId: contractId, request: await getRequest(), tgas: 50 })
            ).unwrap()
            checkResult(result)
            return result.value != null
          },
          onConfirmWithLedger: async (ledgerManager, ledgerPath) => {
            const result = await dispatch(
              addRequest({ ledgerManager, ledgerPath, contractId, request: await getRequest(), tgas: 50 })
            ).unwrap()
            checkResult(result)
            return result.value != null
          },
        })
      ) {
        onClose()
      }
    } catch (e) {}
  }

  function handleTokenChange(event: SelectChangeEvent) {
    setToken(event.target.value)
  }

  function handleReceiverChange(event: ChangeEvent<HTMLInputElement>) {
    setReceiver(event.target.value)
    setReceiverResponse(ReceiverResponse.NOT_CHECKED)
  }

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>) {
    setAmount(event.target.value)
  }
}

export default TransferRequest
