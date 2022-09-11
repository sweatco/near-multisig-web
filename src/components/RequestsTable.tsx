import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import React, { PropsWithChildren } from 'react'

const RequestsTable: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: '1%' }}>ID</TableCell>
          <TableCell>Request Action</TableCell>
          <TableCell sx={{ width: '25%' }}>Receiver</TableCell>
          <TableCell sx={{ width: '1%' }} align="right">
            Confirmations
          </TableCell>
          <TableCell sx={{ width: '1%' }} align="right">
            Action
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{children}</TableBody>
    </Table>
  )
}

export default RequestsTable
