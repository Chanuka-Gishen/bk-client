import React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import TableEmptyRow from 'src/components/custom-table/table-empty-row';
import TableLoadingRow from 'src/components/custom-table/table-loading-row';

import { InvoiceUpdateDialog } from '../component/invoiceUpdateDialog';
import ConfirmationDialog from 'src/components/confirmation-dialog/confirmation-dialog';
import { CredInvoiceRow } from '../component/credInvoiceRow';
import { InvoicePaymentAddDialog } from '../component/invoicePaymentAddDialog';

export const CreditorInvoicesCompView = ({
  isLoading,
  invoices,
  setSelectedInvoice,
  headers,
  openUpdate,
  formik,
  handleOpenCloseUpdateDialog,
  isLoadingUpdate,
  handleUpdateInvoice,
  openDelete,
  isLoadingDelete,
  handleOpenCloseDeleteDialog,
  handleDeleteInvoice,
  openAddPayment,
  isLoadingAddPayment,
  formikPayInvoice,
  handleOpenCloseAddPaymentDialog,
  handleAddPayment,
  handleFetchCreditorInvoices,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Card>
      <TableContainer sx={{ overflow: matchDownMD ? 'scroll' : 'unset' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {headers.map((item, index) => (
                <TableCell align={item === 'Actions' ? 'right' : 'left'} key={index}>
                  {item}
                </TableCell>
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
                        <CredInvoiceRow
                          key={index}
                          item={item}
                          setSelectedInvoice={setSelectedInvoice}
                          handleOpenCloseUpdateDialog={handleOpenCloseUpdateDialog}
                          handleOpenCloseDeleteDialog={handleOpenCloseDeleteDialog}
                          handleOpenCloseAddPaymentDialog={handleOpenCloseAddPaymentDialog}
                          handleFetchCreditorInvoices={handleFetchCreditorInvoices}
                        />
                      ))}
                  </>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        page={page}
        component="div"
        count={invoices.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[10, 20, 30]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {openUpdate && (
        <InvoiceUpdateDialog
          open={openUpdate}
          formik={formik}
          handleClose={handleOpenCloseUpdateDialog}
          handleSubmit={handleUpdateInvoice}
          isLoading={isLoadingUpdate}
        />
      )}
      {openDelete && (
        <ConfirmationDialog
          contentText="Are you that you want to delete this record ?"
          open={openDelete}
          handleClose={handleOpenCloseDeleteDialog}
          handleSubmit={handleDeleteInvoice}
          isLoading={isLoadingDelete}
        />
      )}
      {openAddPayment && (
        <InvoicePaymentAddDialog
          open={openAddPayment}
          handleClose={handleOpenCloseAddPaymentDialog}
          formik={formikPayInvoice}
          handleSubmit={handleAddPayment}
          isLoading={isLoadingAddPayment}
        />
      )}
    </Card>
  );
};
