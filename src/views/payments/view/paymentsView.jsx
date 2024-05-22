import React from 'react';
import proptypes from 'prop-types';

import {
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { Add, CloseOutlined } from '@mui/icons-material';

import { AddUpdatePaymentDialog } from '../components/addUpdatePaymentDialog';
import { DatePicker } from '@mui/x-date-pickers';
import { CustomTableHead } from 'src/components/custom-table/custom-table-head';
import TableLoadingRow from 'src/components/custom-table/table-loading-row';
import { PaymentInvoicesRow } from '../components/paymentInvoicesRow';
import TableEmptyRow from 'src/components/custom-table/table-empty-row';
import ConfirmationDialog from 'src/components/confirmation-dialog/confirmation-dialog';
import { StatisticCard } from 'src/components/statCard';

export const PaymentsView = ({
  headerLabels,
  setSelectedInvoiceId,
  formik,
  formikFilter,
  invoices,
  totalPayments,
  isAdd,
  isOpenAddUpdate,
  isOpenDelete,
  isLoading,
  isLoadingTotal,
  isLoadingAdd,
  isLoadingUpdate,
  isLoadingDelete,
  handleChangePage,
  handleChangeRowsPerPage,
  handleOpenCloseAddDialog,
  handleOpenCloseUpdateDialog,
  handleOpenCloseDeleteDialog,
  handleAddPaymentSubmit,
  handleUpdatePaymentSubmit,
  handleDeletePaymentSubmit,
  page,
  count,
  rowsPerPage,
}) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <>
      <Grid container columnSpacing={2} rowSpacing={4}>
        <Grid item xs={12} sm={12}>
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Manage Payments</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpenCloseAddDialog}>
              Add Payment
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatisticCard
            title={'Total Payments'}
            isLoading={isLoadingTotal}
            data={totalPayments}
            date={formikFilter.values.filteredDate ? formikFilter.values.filteredDate : new Date()}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card>
            <Toolbar
              sx={{
                height: 96,
                display: 'flex',
                justifyContent: 'space-between',
                p: (theme) => theme.spacing(0, 1, 0, 3),
              }}
            >
              <Stack direction="row" spacing={2}>
                <DatePicker
                  onChange={(date) => formikFilter.setFieldValue('filteredDate', date)}
                  value={formikFilter.values.filteredDate}
                />
                <IconButton onClick={() => formikFilter.resetForm()} size="large">
                  <CloseOutlined />
                </IconButton>
              </Stack>
            </Toolbar>
            <TableContainer sx={{ overflow: matchDownMD ? 'scroll' : 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <CustomTableHead headLabel={headerLabels} />
                <TableBody>
                  {isLoading ? (
                    <TableLoadingRow colSpan={headerLabels.length} />
                  ) : (
                    <>
                      {invoices.length > 0 ? (
                        <>
                          {invoices.map((item, index) => (
                            <PaymentInvoicesRow
                              key={index}
                              invoice={item}
                              setSelectedInvoiceId={setSelectedInvoiceId}
                              handleOpenUpdateDialog={handleOpenCloseUpdateDialog}
                              handleOpenDeleteDialog={handleOpenCloseDeleteDialog}
                            />
                          ))}
                        </>
                      ) : (
                        <TableEmptyRow colSpan={headerLabels.length + 1} />
                      )}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              page={page}
              component="div"
              count={count}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[10, 20, 30]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Grid>
      {isOpenAddUpdate && (
        <AddUpdatePaymentDialog
          isAdd={isAdd}
          open={isOpenAddUpdate}
          formik={formik}
          handleClose={isAdd ? handleOpenCloseAddDialog : handleOpenCloseUpdateDialog}
          isLoading={isAdd ? isLoadingAdd : isLoadingUpdate}
          handleSubmit={isAdd ? handleAddPaymentSubmit : handleUpdatePaymentSubmit}
        />
      )}
      {isOpenDelete && (
        <ConfirmationDialog
          contentText="Are you sure that you want to delete this payment record?"
          open={isOpenDelete}
          handleClose={handleOpenCloseDeleteDialog}
          handleSubmit={handleDeletePaymentSubmit}
          isLoading={isLoadingDelete}
        />
      )}
    </>
  );
};

PaymentsView.proptypes = {
  formik: proptypes.object.isRequired,
  formikFilter: proptypes.object.isRequired,
  invoices: proptypes.array,
  totalPayments: proptypes.number.isRequired,
  isAdd: proptypes.bool.isRequired,
  isOpenAddUpdate: proptypes.bool.isRequired,
  isOpenDelete: proptypes.bool.isRequired,
  isLoading: proptypes.bool.isRequired,
  isLoadingTotal: proptypes.bool.isRequired,
  isLoadingAdd: proptypes.bool.isRequired,
  isLoadingUpdate: proptypes.bool.isRequired,
  isLoadingDelete: proptypes.bool.isRequired,
  handleChangePage: proptypes.func.isRequired,
  handleChangeRowsPerPage: proptypes.func.isRequired,
  handleOpenCloseAddUpdateDialog: proptypes.func.isRequired,
  handleOpenCloseDeleteDialog: proptypes.func.isRequired,
  handleAddPaymentSubmit: proptypes.func.isRequired,
  handleUpdatePaymentSubmit: proptypes.func.isRequired,
  handleDeletePaymentSubmit: proptypes.func.isRequired,
  page: proptypes.number.isRequired,
  count: proptypes.number.isRequired,
  rowsPerPage: proptypes.number.isRequired,
};
