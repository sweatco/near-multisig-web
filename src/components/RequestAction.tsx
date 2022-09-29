import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from '@mui/material'
import React, { useMemo, useState } from 'react'
import * as nearAPI from 'near-api-js'
import { MultiSigRequest } from '../utils/contracts/MultiSig'
import formatBalance, { BN } from '../utils/formatBalance'
import useFTMetadata from '../hooks/useFTMetadata'
import { base64ToJson, isFungibleTokenRequest } from '../utils/multisigHelpers'
import NearTokenChip from './Chips/NearTokenChip'
import FungibleTokenChip from './Chips/FungibleTokenChip'
import { ftListSelectors } from '../reducers/ft_list'
import { useAppSelector } from '../hooks/useApp'
import { ClaimEntry } from '../utils/contracts/Lockup'

interface RequestActionProps {
  contractId: string
  request: MultiSigRequest
  action: any
}

const RequestAction: React.FC<RequestActionProps> = ({ contractId, request, action }) => {
  const isFungibleToken = isFungibleTokenRequest(request)
  const metadata = useFTMetadata(isFungibleToken ? request.receiver_id : undefined)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getLockupTokenIdSelector = useMemo(ftListSelectors.makeGetLockupTokenIdSelector, [])
  const lockupTokenId = useAppSelector((state) => getLockupTokenIdSelector(state, contractId, request.receiver_id))

  const [open, setOpen] = useState(false)
  let label = action.type

  if (action.type === 'Transfer') {
    label = `Transfer: ${nearAPI.utils.format.formatNearAmount(action.amount, 2)} NEAR`
  } else if (action.type === 'FTTransfer' && metadata) {
    label = `Transfer: ${formatBalance(action.amount, metadata)} ${metadata.symbol}`
  }

  return (
    <>
      {renderChip()}
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle>{'Action Details'}</DialogTitle>
        <DialogContent>
          <pre>{JSON.stringify(action, undefined, 2)}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )

  function renderChip() {
    if (action.type === 'Transfer') {
      return (
        <NearTokenChip
          onClick={handleClick}
          contractId={contractId}
          prefix="Send:"
          amount={action.amount}
          variant="filled"
        />
      )
    } else if (action.type === 'FTTransfer' && metadata) {
      return (
        <FungibleTokenChip
          onClick={handleClick}
          contractId={contractId}
          tokenId={request.receiver_id}
          prefix="Send:"
          amount={action.amount}
          variant="filled"
        />
      )
    } else if (action.type === 'FunctionCall' && action.method_name === 'claim' && lockupTokenId) {
      const args: { amounts?: ClaimEntry[] } = base64ToJson(action.args)
      const amount = (args.amounts ?? []).reduce((value, entry) => {
        return value.plus(entry[1])
      }, BN(0))
      return (
        <FungibleTokenChip
          onClick={handleClick}
          contractId={contractId}
          tokenId={lockupTokenId}
          prefix={args.amounts ? 'Claim:' : 'Claim available'}
          amount={args.amounts ? amount : undefined}
          variant="filled"
        />
      )
    } else {
      return <Chip icon={<Icon>{getChipIcon()}</Icon>} label={label} onClick={handleClick} />
    }
  }

  function getChipIcon() {
    if (action.type === 'AddKey') {
      return 'key'
    } else {
      return 'info'
    }
  }

  function handleClick() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }
}

export default RequestAction
