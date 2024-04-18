import React, { useState } from 'react';

import {
  Box,
  Collapse,
  IconButton,
  MenuItem,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

import { CustomTableHead } from 'src/components/custom-table/custom-table-head';
import TableLoadingRow from 'src/components/custom-table/table-loading-row';
import { formatCurrency } from 'src/utils/format-number';
import { CreditPaymentUpdateDialog } from '../components/creditPaymentUpdateDialog';
import ConfirmationDialog from 'src/components/confirmation-dialog/confirmation-dialog';
import { HistoryRow } from '../components/historyRow';

export const CreditPaymentsView = ({
  headers,
  open,
  isLoading,
  payments,
  formik,
  openUpdate,
  openDelete,
  isLoadingUpdate,
  isLoadingDelete,
  handleOpenCloseUpdateDialog,
  handleOpenCloseDeleteDialog,
  handleUpdatePayment,
  handleDeletePayment,
}) => {
  return (
    <>
      {isLoading ? (
        <TableLoadingRow colSpan={headers.length + 1} />
      ) : (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Payment History
                </Typography>
                <Table sx={{ minWidth: 800 }}>
                  <CustomTableHead enableAction={true} headLabel={headers} />
                  <TableBody>
                    {payments.map((pay, index) => (
                      <HistoryRow
                        key={index}
                        payment={pay}
                        handleOpenUpdate={handleOpenCloseUpdateDialog}
                        handleOpenDelete={handleOpenCloseDeleteDialog}
                      />
                    ))}
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell sx={{ border: '1px solid #e0e0e0' }}>
                        Total Received Amount
                      </TableCell>
                      <TableCell sx={{ border: '1px solid #e0e0e0' }}>
                        {formatCurrency(
                          payments.reduce((total, invoice) => total + invoice.invoiceAmount, 0)
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
      {openUpdate && (
        <CreditPaymentUpdateDialog
          formik={formik}
          open={openUpdate}
          handleClose={handleOpenCloseUpdateDialog}
          handleSubmit={handleUpdatePayment}
          isLoading={isLoadingUpdate}
        />
      )}
      {openDelete && (
        <ConfirmationDialog
          contentText="Are you sure that you want to delete this payment? This cannot be undone"
          open={openDelete}
          handleClose={handleOpenCloseDeleteDialog}
          handleSubmit={handleDeletePayment}
          isLoading={isLoadingDelete}
        />
      )}
    </>
  );
};
