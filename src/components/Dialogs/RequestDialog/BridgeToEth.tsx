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
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useMemo } from 'react'

import addRequest, { AddRequestResult } from '../../../actions/chain/addRequest'
import { useAppDispatch } from '../../../hooks/useApp'
import useBalance from '../../../hooks/useBalance'
import useFTListSelector from '../../../hooks/useFTListSelector'
import { BN, parseBalance, parseTgas } from '../../../utils/formatBalance'
import FungibleTokenChip from '../../Chips/FungibleTokenChip'
import useConfirmTransaction from '../ConfirmTransaction/useConfirmTransaction'
import useFTMetadata from '../../../hooks/useFTMetadata'
import fetchFTBalance from '../../../actions/chain/fetchFTBalance'
import { isMainNet } from '../../../utils/networks'

interface BridgeToEthProps {
  contractId: string
  onClose(result?: boolean): void
}

const NEAR = 'near'

const BridgeToEth: React.FC<BridgeToEthProps> = ({ contractId, onClose }) => {
  const dispatch = useAppDispatch()

  const ftList = useFTListSelector(contractId)
  const supportedFtList = ftList.filter((value) => value === 'vfinal.token.sweat.testnet' || value === 'token.sweat')

  const [token, setToken] = useState<string | undefined>(supportedFtList[0])
  const [receiver, setReceiver] = useState('')
  const [amount, setAmount] = useState('')
  const confirmTransaction = useConfirmTransaction()

  const ftBalance = useBalance(contractId, token !== NEAR ? token : undefined)
  const ftMetadata = useFTMetadata(token !== NEAR ? token : undefined)

  const isValidAmount = useMemo(() => {
    const parsedAmount = parseFloat(amount)
    return !isNaN(parsedAmount) && ftBalance && BN(parsedAmount).lte(ftBalance)
  }, [amount, ftBalance])

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
                {supportedFtList.map((token) => (
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
              label="Enter ETH recepient 0x..."
              variant="outlined"
              margin="normal"
              autoComplete="off"
              value={receiver}
              onChange={handleReceiverChange}
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

  function formatAddressTo64Chars(address: string) {
    // Remove '0x' prefix if it exists
    const cleanAddress = address.toLowerCase().replace(/^0x/, '')

    // Pad with leading zeros to ensure 64 characters
    const paddedAddress = cleanAddress.padStart(64, '0')

    return paddedAddress
  }

  // {
  //   "receiver_id": "contract.portalbridge.near",
  //   "amount": "10000000000000000000",
  //   "msg": "{
  //     "receiver": "000000000000000000000000e14a722193667103e4b4f16e0119793a151ee714",
  //     "chain": 2,
  //     "fee": "0",
  //     "payload": "",
  //     "message_fee":0
  //   }"
  // }

  async function getRequest() {
    if (ftMetadata && token) {
      const actions = []

      actions.push({
        type: 'FunctionCall',
        gas: parseTgas(150),
        method_name: 'ft_transfer_call',
        args: Buffer.from(
          JSON.stringify({
            amount: parseBalance(amount, ftMetadata),
            receiver_id: isMainNet() ? 'contract.portalbridge.near' : 'khmelev-multisig.testnet',
            msg: JSON.stringify({
              receiver: formatAddressTo64Chars(receiver),
              chain: 2,
              fee: '0',
              payload: '',
              message_fee: 0,
            }),
          })
        ).toString('base64'),
        deposit: '1',
      })

      const request = {
        receiver_id: token,
        actions: actions,
      }


      return request
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
              addRequest({ key, contractId: contractId, request: await getRequest(), tgas: 300 })
            ).unwrap()
            checkResult(result)
            return result.value != null
          },
          onConfirmWithLedger: async (ledgerManager, ledgerPath) => {
            const result = await dispatch(
              addRequest({ ledgerManager, ledgerPath, contractId, request: await getRequest(), tgas: 300 })
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
  }

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>) {
    setAmount(event.target.value)
  }
}

export default BridgeToEth
