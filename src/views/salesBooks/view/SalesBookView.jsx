import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditIcon from '@mui/icons-material/Edit';

import { CreateBookDialog } from '../component/createBookDialog';
import { fDate } from 'src/utils/format-time';

import { UpdateBookDialog } from '../component/updateBookDialog';
import TableLoadingRow from 'src/components/custom-table/table-loading-row';
import TableEmptyRow from 'src/components/custom-table/table-empty-row';
import { InvoiceRow } from '../component/invoiceRow';
import { AddUpdateInvoiceDialog } from '../component/addUpdateInvoiceDialog';
import ConfirmationDialog from 'src/components/confirmation-dialog/confirmation-dialog';
import { AddInvoicesFileDialog } from '../component/addInvoicesFileDialog';

export const SalesBookView = ({
  isLoading,
  salesBooks,
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
  setSelectedInvoice,
  handleAddInvoice,
  handleUpdateInvoice,
  handleDeleteInvoice,
  formikInvoice,
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
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const theme = useTheme();
  return (
    <>
      <Grid container columnSpacing={2} rowSpacing={4}>
        <Grid item xs={12} sm={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">Manage SalesBooks</Typography>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<AddIcon />}
              onClick={handleOpenCloseCreateDialog}
            >
              Add New Book
            </Button>
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
            <Grid item xs={12} sm={6}></Grid>
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
                              {invoices
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => (
                                  <InvoiceRow
                                    key={index}
                                    invoice={item}
                                    setSelectedInvoice={setSelectedInvoice}
                                    handleOpenUpdateDialog={handleOpenCloseUpdateInvoiceDialog}
                                    handleOpenDeleteDialog={handleOpenCloseDeleteInvoiceDialog}
                                  />
                                ))}
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
                  count={invoices.length}
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
          formik={formikInvoice}
          handleClose={handleOpenCloseAddInvoiceDialog}
          open={isOpenAddInvoiceDialog}
          handleSubmit={handleAddInvoice}
          isLoading={isLoadingInvoiceAdd}
        />
      )}
      {isOpenUpdateInvoiceDialog && (
        <AddUpdateInvoiceDialog
          isAdd={false}
          formik={formikInvoice}
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
