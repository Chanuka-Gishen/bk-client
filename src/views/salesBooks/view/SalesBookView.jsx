import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditIcon from '@mui/icons-material/Edit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { CloseCircleFilled } from '@ant-design/icons';

import { CreateBookDialog } from '../component/createBookDialog';
import { fDate } from 'src/utils/format-time';

import { UpdateBookDialog } from '../component/updateBookDialog';
import TableLoadingRow from 'src/components/custom-table/table-loading-row';
import TableEmptyRow from 'src/components/custom-table/table-empty-row';
import { InvoiceRow } from '../component/invoiceRow';
import { AddUpdateInvoiceDialog } from '../component/addUpdateInvoiceDialog';
import ConfirmationDialog from 'src/components/confirmation-dialog/confirmation-dialog';
import { AddInvoicesFileDialog } from '../component/addInvoicesFileDialog';
import { INVOICE_TYPES } from 'src/constants/invoiceTypeConstants';
import { formatCurrency } from 'src/utils/format-number';
import { CurrencyInput } from 'src/components/currency-input/currency-input';
import MainCard from 'src/components/mainCard';
import { DownloadDialog } from '../component/downloadDialog';

export const SalesBookView = ({
  bookType,
  isLoading,
  salesBooks,
  cashBalance,
  isLoadingCashBalance,
  isOpenCreateDialog,
  isLoadingCreate,
  formik,
  handleOpenCloseCreateDialog,
  handleCreateSalesBook,
  selectedBook,
  handleSelectBook,
  isOpenUpdateDialog,
  handleOpenCloseUpdateDialog,
  isLoadingUpdate,
  handleUpdateSalesBook,
  invoiceHeaders,
  isLoadingInvoices,
  invoices,
  invoiceStats,
  formikFilter,
  isLoadingInvoicesStats,
  setSelectedInvoice,
  handleAddInvoice,
  handleUpdateInvoice,
  handleDeleteInvoice,
  formikInvoice,
  formikInvoiceSingle,
  isOpenAddInvoiceDialog,
  isOpenUpdateInvoiceDialog,
  isOpenDeleteInvoiceDialog,
  handleOpenCloseAddInvoiceDialog,
  handleOpenCloseUpdateInvoiceDialog,
  handleOpenCloseDeleteInvoiceDialog,
  isLoadingInvoiceAdd,
  isLoadingInvoiceUpdate,
  isLoadingInvoiceDelete,
  selectedFile,
  setSelectedFile,
  isOpenAddBulkInvDialog,
  isLoadingInvoiceBulk,
  handleOpenCloseAddBulkInvDialog,
  handleAddBulkFiles,
  page,
  documentCount,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  downloadDate,
  isOpenDownloadInvoice,
  handleOpenCloseDownloadReportDialog,
  isDownloadingInvoiceReport,
  handleChangeDownloadDate,
  handleDownloadInvoiceReport,
}) => {
  const theme = useTheme();
  return (
    <>
      <Grid container columnSpacing={2} rowSpacing={4}>
        <Grid item xs={12} sm={3}>
          <MainCard contentSX={{ p: 2.25 }}>
            <Stack spacing={0.5}>
              <Typography variant="h6" color="textSecondary">
                Total Cash Balance
              </Typography>
              <Grid container alignItems="center">
                <Grid item xs={12} sm={12}>
                  <Typography variant="h4" color="inherit">
                    {isLoadingCashBalance ? 'Loading...' : formatCurrency(cashBalance)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Chip
                    variant="combined"
                    icon={<CalendarMonthIcon />}
                    label={`${fDate(new Date())}`}
                    sx={{ mt: 1 }}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4">Manage SalesBooks</Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="inherit"
                startIcon={<AddIcon />}
                onClick={handleOpenCloseDownloadReportDialog}
              >
                Download Reports
              </Button>
              <Button
                variant="contained"
                color="inherit"
                startIcon={<AddIcon />}
                onClick={handleOpenCloseCreateDialog}
              >
                Add New Book
              </Button>
            </Stack>
          </Stack>
        </Grid>
        {salesBooks.length > 0 && (
          <>
            {salesBooks.map((book, index) => (
              <Grid item xs={6} sm={2} key={index}>
                <Card
                  sx={{
                    backgroundColor:
                      selectedBook && selectedBook._id === book._id
                        ? theme.palette.primary.lighter
                        : 'default',
                  }}
                >
                  <CardActionArea onClick={() => handleSelectBook(book)}>
                    <CardContent>
                      <Typography align="center">{book.bookName}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </>
        )}
        {selectedBook && (
          <>
            <Grid item xs={12} sm={12}></Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={4} alignItems="center" justifyContent="center">
                    <Typography>{`Created on ${fDate(selectedBook.bookCreatedDate)}`}</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {selectedBook.bookName}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={6}>
                    <Card
                      sx={{
                        backgroundColor: theme.palette.primary.lighter,
                      }}
                    >
                      <CardActionArea onClick={handleOpenCloseUpdateDialog}>
                        <CardContent>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <EditIcon />
                            <Typography align="center">Edit SalesBook</Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Card
                      sx={{
                        backgroundColor: theme.palette.primary.lighter,
                      }}
                    >
                      <CardActionArea onClick={handleOpenCloseAddInvoiceDialog}>
                        <CardContent>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <AddCircleIcon />
                            <Typography align="center">Add Invoice</Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Card
                      sx={{
                        backgroundColor: theme.palette.primary.lighter,
                      }}
                    >
                      <CardActionArea onClick={handleOpenCloseAddBulkInvDialog}>
                        <CardContent>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <UploadFileIcon />
                            <Typography align="center">Add Invoice Bulk</Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Card>
                <Toolbar
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: (theme) => theme.spacing(4, 2, 2, 2),
                  }}
                >
                  <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="grossTotal"
                        value={invoiceStats ? invoiceStats.netAmount : 0}
                        label="Gross Total"
                        InputProps={{
                          inputComponent: CurrencyInput,
                          readOnly: true,
                        }}
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
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {invoiceHeaders.map((item, index) => (
                          <TableCell key={index} align={item === 'Action' ? 'right' : 'left'}>
                            {item}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoadingInvoices ? (
                        <TableLoadingRow colSpan={invoiceHeaders.length} />
                      ) : (
                        <>
                          {invoices.length > 0 ? (
                            <>
                              {invoices.map((item, index) => (
                                <InvoiceRow
                                  key={index}
                                  bookType={bookType}
                                  invoice={item}
                                  setSelectedInvoice={setSelectedInvoice}
                                  handleOpenUpdateDialog={handleOpenCloseUpdateInvoiceDialog}
                                  handleOpenDeleteDialog={handleOpenCloseDeleteInvoiceDialog}
                                />
                              ))}
                              {invoiceStats && (
                                <>
                                  <TableRow sx={{ border: '1px solid #e0e0e0' }}>
                                    <TableCell
                                      variant="head"
                                      colSpan={bookType === INVOICE_TYPES.RANGE ? 2 : 1}
                                    ></TableCell>
                                    <TableCell variant="head">Total</TableCell>
                                    <TableCell>
                                      {formatCurrency(invoiceStats.totalInAmount)}
                                    </TableCell>
                                    <TableCell>
                                      {formatCurrency(invoiceStats.totalOutAmount)}
                                    </TableCell>
                                    <TableCell></TableCell>
                                  </TableRow>
                                </>
                              )}
                            </>
                          ) : (
                            <TableEmptyRow colSpan={invoiceHeaders.length} />
                          )}
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  page={page}
                  component="div"
                  count={documentCount}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handleChangePage}
                  rowsPerPageOptions={[10, 20, 30]}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Grid>
          </>
        )}
      </Grid>
      {isOpenCreateDialog && (
        <CreateBookDialog
          open={isOpenCreateDialog}
          handleClose={handleOpenCloseCreateDialog}
          formik={formik}
          handleSubmit={handleCreateSalesBook}
          isLoading={isLoadingCreate}
        />
      )}
      {isOpenUpdateDialog && (
        <UpdateBookDialog
          open={isOpenUpdateDialog}
          handleClose={handleOpenCloseUpdateDialog}
          formik={formik}
          handleSubmit={handleUpdateSalesBook}
          isLoading={isLoadingUpdate}
        />
      )}
      {isOpenAddInvoiceDialog && (
        <AddUpdateInvoiceDialog
          isAdd={true}
          bookType={bookType}
          formik={bookType === INVOICE_TYPES.RANGE ? formikInvoice : formikInvoiceSingle}
          handleClose={handleOpenCloseAddInvoiceDialog}
          open={isOpenAddInvoiceDialog}
          handleSubmit={handleAddInvoice}
          isLoading={isLoadingInvoiceAdd}
        />
      )}
      {isOpenUpdateInvoiceDialog && (
        <AddUpdateInvoiceDialog
          isAdd={false}
          bookType={bookType}
          formik={bookType === INVOICE_TYPES.RANGE ? formikInvoice : formikInvoiceSingle}
          handleClose={handleOpenCloseUpdateInvoiceDialog}
          open={isOpenUpdateInvoiceDialog}
          handleSubmit={handleUpdateInvoice}
          isLoading={isLoadingInvoiceUpdate}
        />
      )}
      {isOpenDeleteInvoiceDialog && (
        <ConfirmationDialog
          contentText="Are you sure that you want to delete this invoice ? This action cannot be undone."
          handleClose={handleOpenCloseDeleteInvoiceDialog}
          open={isOpenDeleteInvoiceDialog}
          handleSubmit={handleDeleteInvoice}
          isLoading={isLoadingInvoiceDelete}
        />
      )}
      {isOpenAddBulkInvDialog && (
        <AddInvoicesFileDialog
          open={isOpenAddBulkInvDialog}
          file={selectedFile}
          setFile={setSelectedFile}
          handleClose={handleOpenCloseAddBulkInvDialog}
          handleSubmit={handleAddBulkFiles}
          isLoading={isLoadingInvoiceBulk}
        />
      )}
      {isOpenDownloadInvoice && (
        <DownloadDialog
          open={isOpenDownloadInvoice}
          handleClose={handleOpenCloseDownloadReportDialog}
          downloadDate={downloadDate}
          handleChange={handleChangeDownloadDate}
          handleSubmit={handleDownloadInvoiceReport}
          isLoading={isDownloadingInvoiceReport}
        />
      )}
    </>
  );
};

SalesBookView.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  salesBooks: PropTypes.array,
  isOpenCreateDialog: PropTypes.bool.isRequired,
  isLoadingCreate: PropTypes.bool.isRequired,
  formik: PropTypes.object.isRequired,
  handleOpenCloseCreateDialog: PropTypes.func.isRequired,
  handleCreateSalesBook: PropTypes.func.isRequired,
  selectedBook: PropTypes.object,
  handleSelectBook: PropTypes.func.isRequired,
  invoiceHeaders: PropTypes.array.isRequired,
  isLoadingInvoices: PropTypes.bool.isRequired,
  invoices: PropTypes.array,
  setSelectedInvoice: PropTypes.func.isRequired,
  handleUpdateInvoice: PropTypes.func.isRequired,
  handleDeleteInvoice: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
};
