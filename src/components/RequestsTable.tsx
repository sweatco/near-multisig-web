import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import React, { PropsWithChildren } from 'react'

const RequestsTable: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell size="small">ID</TableCell>
          <TableCell>Request Action</TableCell>
          <TableCell size="small">Receiver</TableCell>
          <TableCell align="right" size="small">
            Confirmations
          </TableCell>
          <TableCell align="right" size="small">
            Action
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{children}</TableBody>
    </Table>
  )
}

export default RequestsTable
