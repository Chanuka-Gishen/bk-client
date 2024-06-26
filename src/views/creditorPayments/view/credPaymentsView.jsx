import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
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
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { CustomTableHead } from 'src/components/custom-table/custom-table-head';
import TableLoadingRow from 'src/components/custom-table/table-loading-row';
import TableEmptyRow from 'src/components/custom-table/table-empty-row';
import ConfirmationDialog from 'src/components/confirmation-dialog/confirmation-dialog';
import { InvoicePaymentAddDialog } from 'src/views/creditorDetails/components/creditorInvoicesComp/component/invoicePaymentAddDialog';
import { InvoiceUpdateDialog } from 'src/views/creditorDetails/components/creditorInvoicesComp/component/invoiceUpdateDialog';
import MainCard from 'src/components/mainCard';
import { fDate } from 'src/utils/format-time';
import { formatCurrency } from 'src/utils/format-number';
import { DatePicker } from '@mui/x-date-pickers';
import { CloseCircleFilled } from '@ant-design/icons';
import { PaymentRow } from '../components/paymentRow';
import { StatisticCard } from 'src/components/statCard';
import { CreditPaymentUpdateDialog } from '../components/creditPayments/components/creditPaymentUpdateDialog';

export const CredPaymentsView = ({
  headerLabels,
  invoices,
  totalPayments,
  isLoadingTotal,
  searchTerm,
  handleSearchInputChange,
  isLoading,
  formik,
  isOpenUpdate,
  isOpenDelete,
  isLoadingUpdate,
  isLoadingDelete,
  setSelectedInvoice,
  handleOpenCloseAddDialog,
  handleOpenCloseUpdateDialog,
  handleOpenCloseDeleteDialog,
  handleSubmitUpdate,
  handleSubmitDelete,
  handleFetchPayments,
  formikFilter,
  page,
  count,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <>
      <Grid container columnSpacing={2} rowSpacing={4}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h4">Manage Creditor Payments</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatisticCard
            title={'Total Creditors Payments'}
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
              <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                <Grid item xs={12} sm={3}>
                  <OutlinedInput
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    placeholder="Search creditor..."
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                      </InputAdornment>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack direction="row" spacing={2}>
                    <DatePicker
                      onChange={(date) => formikFilter.setFieldValue('filteredDate', date)}
                      value={formikFilter.values.filteredDate}
                    />
                    <IconButton onClick={() => formikFilter.resetForm()} size="large">
                      <CloseCircleFilled />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </Toolbar>
            <TableContainer sx={{ overflow: matchDownMD ? 'scroll' : 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <CustomTableHead headLabel={headerLabels} />
                <TableBody>
                  {isLoading ? (
                    <TableLoadingRow colSpan={headerLabels.length + 1} />
                  ) : (
                    <>
                      {invoices.length > 0 ? (
                        <>
                          {invoices.map((item, index) => (
                            <PaymentRow
                              key={index}
                              invoice={item}
                              setSelectedInvoice={setSelectedInvoice}
                              handleOpenCloseAddDialog={handleOpenCloseAddDialog}
                              handleOpenUpdateDialog={handleOpenCloseUpdateDialog}
                              handleOpenDeleteDialog={handleOpenCloseDeleteDialog}
                              handleFetchPayments={handleFetchPayments}
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
      {isOpenUpdate && (
        <CreditPaymentUpdateDialog
          formik={formik}
          open={isOpenUpdate}
          handleClose={handleOpenCloseUpdateDialog}
          handleSubmit={handleSubmitUpdate}
          isLoading={isLoadingUpdate}
        />
      )}
      {isOpenDelete && (
        <ConfirmationDialog
          open={isOpenDelete}
          contentText="Are you sure that you want to delete this record ?"
          handleClose={handleOpenCloseDeleteDialog}
          handleSubmit={handleSubmitDelete}
          isLoading={isLoadingDelete}
        />
      )}
    </>
  );
};
