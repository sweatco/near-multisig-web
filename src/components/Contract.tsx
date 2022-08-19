import { Alert, Box, Button, Divider, Paper, Typography } from '@mui/material'
import React, { memo } from 'react'

import useContract from '../hooks/useContract'
import BalanceChip from './BalanceChip'
import ConfirmationsChip from './ConfirmationsChip'
import Request from './Request'
import RequestsTable from './RequestsTable'

interface ContractProps {
  name: string
}

const Contract: React.FC<ContractProps> = memo(({ name }) => {
  const { balance, confirmations, failed, remove, requestIds } = useContract(name)
  return (
    <Paper sx={{ p: 3, marginTop: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ flex: 1 }}>
        @{name}
      </Typography>

      {failed ? (
        <>
          <Alert severity="error">Unable to load contract!</Alert>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex' }}>
            <BalanceChip balance={balance} />
            <ConfirmationsChip confirmations={confirmations} />
          </Box>
          {requestIds !== undefined && requestIds.length > 0 ? (
            <RequestsTable>
              {requestIds.map((requestId) => (
                <Request contractId={name} requestId={requestId} key={`${name}-${requestId}`} />
              ))}
            </RequestsTable>
          ) : (
            <Divider sx={{ marginTop: 2 }} />
          )}
        </>
      )}

      <Box sx={{ display: 'flex', marginTop: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Button color="primary" disabled>
            NEW TRANSACTION
          </Button>
        </Box>
        <Button color="error" onClick={remove}>
          DELETE CONTRACT
        </Button>
      </Box>
    </Paper>
  )
})

export default Contract
