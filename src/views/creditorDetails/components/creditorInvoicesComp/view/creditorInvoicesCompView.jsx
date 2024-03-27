import React, { Fragment } from 'react';
import {
  Card,
  IconButton,
  MenuItem,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import TableEmptyRow from 'src/components/custom-table/table-empty-row';
import TableLoadingRow from 'src/components/custom-table/table-loading-row';
import Label from 'src/components/label';
import { PAYMENT_STATUS } from 'src/constants/commonConstants';
import { formatCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';
import { InvoiceUpdateDialog } from '../component/invoiceUpdateDialog';
import ConfirmationDialog from 'src/components/confirmation-dialog/confirmation-dialog';

export const CreditorInvoicesCompView = ({
  isLoading,
  invoices,
  headers,
  open,
  handleOpenMenu,
  handleCloseMenu,
  openUpdate,
  formik,
  handleOpenCloseUpdateDialog,
  isLoadingUpdate,
  handleUpdateInvoice,
  openDelete,
  isLoadingDelete,
  handleOpenCloseDeleteDialog,
  handleDeleteInvoice,
}) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <Card>
      <TableContainer sx={{ overflow: matchDownMD ? 'scroll' : 'unset' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
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
                    {invoices.map((item, index) => (
                      <Fragment key={index}>
                        <TableRow>
                          <TableCell>{item.credInvoiceNo}</TableCell>
                          <TableCell>{fDate(item.credInvoiceDate)}</TableCell>
                          <TableCell>{fDate(item.credInvoiceDueDate)}</TableCell>
                          <TableCell>{fDate(item.credInvoicePaidDate)}</TableCell>
                          <TableCell>{formatCurrency(item.credInvoiceAmount)}</TableCell>
                          <TableCell>
                            <Label
                              color={
                                item.credInvoiceStatus === PAYMENT_STATUS.PAID ? 'success' : 'error'
                              }
                            >
                              {' '}
                              {item.credInvoiceStatus}{' '}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton onClick={(e) => handleOpenMenu(e, item)}>
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <Popover
                          open={!!open}
                          anchorEl={open}
                          onClose={handleCloseMenu}
                          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          // PaperProps={{
                          //   sx: { width: 140 },
                          // }}
                        >
                          <MenuItem onClick={() => handleOpenCloseUpdateDialog(item)}>
                            <EditIcon fontSize="small" sx={{ mr: 1 }} />
                            Update
                          </MenuItem>
                          {item.credInvoiceStatus === PAYMENT_STATUS.NOTPAID && (
                            <MenuItem onClick={handleOpenCloseDeleteDialog}>
                              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                              Delete
                            </MenuItem>
                          )}
                        </Popover>
                      </Fragment>
                    ))}
                  </>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
    </Card>
  );
};
