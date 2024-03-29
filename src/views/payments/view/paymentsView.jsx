import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Container,
  Grid,
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
import { Add } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { CustomTableHead } from 'src/components/custom-table/custom-table-head';
import TableLoadingRow from 'src/components/custom-table/table-loading-row';
import TableEmptyRow from 'src/components/custom-table/table-empty-row';
import { PaymentRow } from '../components/paymentRow';
import { AddPaymentDialog } from '../components/addPaymentDialog';
import { UpdatePaymentDialog } from '../components/updatePaymentDialog';
import ConfirmationDialog from 'src/components/confirmation-dialog/confirmation-dialog';

export const PaymentsView = ({
  headerLabels,
  invoices,
  searchTerm,
  handleSearchInputChange,
  filteredData,
  isLoading,
  formik,
  isOpenAdd,
  isOpenUpdate,
  isOpenDelete,
  isLoadingAdd,
  isLoadingUpdate,
  isLoadingDelete,
  setSelectedInvoice,
  handleOpenCloseAddDialog,
  handleOpenCloseUpdateDialog,
  handleOpenCloseDeleteDialog,
  handleSubmitAdd,
  handleSubmitUpdate,
  handleSubmitDelete,
  page,
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
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Manage Payments</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpenCloseAddDialog}>
              Add Payment
            </Button>
          </Stack>
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
              <OutlinedInput
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="Search description..."
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                }
              />
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
                          {filteredData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((item, index) => (
                              <PaymentRow
                                key={index}
                                invoice={item}
                                setSelectedInvoice={setSelectedInvoice}
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
              count={invoices.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[10, 20, 30]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Grid>
      {isOpenAdd && (
        <AddPaymentDialog
          open={isOpenAdd}
          formik={formik}
          handleClose={handleOpenCloseAddDialog}
          handleSubmit={handleSubmitAdd}
          isLoading={isLoadingAdd}
        />
      )}
      {isOpenUpdate && (
        <UpdatePaymentDialog
          open={isOpenUpdate}
          formik={formik}
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
