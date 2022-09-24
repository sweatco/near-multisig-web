import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Icon,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useMemo } from 'react'

import addRequest from '../../../actions/chain/addRequest'
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
      <DialogTitle>New Request</DialogTitle>
      <DialogContent>
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
        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <TextField
              fullWidth
              label="Enter recepient"
              variant="outlined"
              color={receiverResponse === ReceiverResponse.EXISTS ? 'success' : undefined}
              error={receiverResponse === ReceiverResponse.FAIL}
              margin="normal"
              value={receiver}
              onChange={handleReceiverChange}
              InputProps={{
                endAdornment:
                  receiverResponse === ReceiverResponse.EXISTS ? (
                    <InputAdornment position="start">
                      <Icon fontSize="inherit" className="material-symbols-outlined">
                        done
                      </Icon>
                    </InputAdornment>
                  ) : undefined,
              }}
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
              helperText={amount !== '' && !isValidAmount ? 'More then available balance' : null}
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
    return !(receiver !== '' && receiverResponse === ReceiverResponse.EXISTS && amount !== '' && isValidAmount)
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
    event?.preventDefault()
    try {
      if (
        await confirmTransaction({
          contractId,
          onConfirmWithKey: async (key) => {
            const result = await dispatch(
              addRequest({ key, contractId: contractId, request: await getRequest(), tgas: 50 })
            ).unwrap()
            return typeof result === 'number'
          },
          onConfirmWithLedger: async (ledgerManager, ledgerPath) => {
            const result = await dispatch(
              addRequest({ ledgerManager, ledgerPath, contractId, request: await getRequest(), tgas: 50 })
            ).unwrap()
            return typeof result === 'number'
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
  }

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>) {
    setAmount(event.target.value)
  }
}

export default TransferRequest
