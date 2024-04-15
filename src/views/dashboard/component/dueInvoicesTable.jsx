import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TableLoadingRow from 'src/components/custom-table/table-loading-row';
import TableEmptyRow from 'src/components/custom-table/table-empty-row';
import { fDate } from 'src/utils/format-time';
import { formatCurrency } from 'src/utils/format-number';
import { PAYMENT_STATUS } from 'src/constants/commonConstants';
import Label from 'src/components/label';

export const DueInvoicesTable = ({ headers, isLoading, invoices, page, rowsPerPage }) => {
  return (
    <TableContainer
      sx={{
        width: '100%',
        overflowX: 'auto',
        position: 'relative',
        display: 'block',
        maxWidth: '100%',
        '& td, & th': { whiteSpace: 'nowrap' },
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((item) => (
              <TableCell>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableLoadingRow colSpan={headers.length} />
          ) : (
            <>
              {invoices.length === 0 ? (
                <TableEmptyRow colSpan={headers.length} />
              ) : (
                <>
                  {invoices
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.credInvoiceNo}</TableCell>
                        <TableCell>{item.credInvoicedCreditor.creditorName}</TableCell>
                        <TableCell>{fDate(item.credInvoiceDate)}</TableCell>
                        <TableCell>{fDate(item.credInvoiceDueDate)}</TableCell>
                        <TableCell>{fDate(item.credInvoicePaidDate)}</TableCell>
                        <TableCell>{formatCurrency(item.credInvoiceAmount)}</TableCell>
                        <TableCell>{formatCurrency(item.credInvoiceBalance)}</TableCell>
                        <TableCell>
                          <Label
                            color={
                              item.credInvoiceStatus === PAYMENT_STATUS.PAID ? 'success' : 'error'
                            }
                          >
                            {item.credInvoiceStatus}
                          </Label>
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
