import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, MenuItem, Popover, TableCell, TableRow, Typography } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import PaidIcon from '@mui/icons-material/Paid';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { fDate } from 'src/utils/format-time';
import { formatCurrency } from 'src/utils/format-number';
import Label from 'src/components/label';
import { PAYMENT_STATUS } from 'src/constants/commonConstants';
import { PaymentInvoices } from './creditPayments';

// -------------------------------------------------------------

const HistoryRow = ({ payment }) => {
  return (
    <TableRow>
      <TableCell>{payment.invoiceNo}</TableCell>
      <TableCell>{formatCurrency(payment.invoiceAmount)}</TableCell>
      <TableCell>{fDate(payment.invoiceCreatedAt)}</TableCell>
    </TableRow>
  );
};

// -------------------------------------------------------------

export const PaymentRow = ({
  invoice,
  setSelectedInvoice,
  handleOpenCloseAddDialog,
  handleOpenUpdateDialog,
  handleOpenDeleteDialog,
  handleFetchPayments,
}) => {
  const [open, setOpen] = useState(null);
  const [openRow, setOpenRow] = useState(false);

  const handleOpenMenu = (event) => {
    setSelectedInvoice(invoice);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setSelectedInvoice(null);
    setOpen(null);
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenRow(!openRow)}
            disabled={invoice.invoices && invoice.invoices.length === 0}
          >
            {openRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th">
          <Typography variant="subtitle2" noWrap>
            {invoice.creditor.creditorName}
          </Typography>
        </TableCell>
        <TableCell>{invoice.credInvoiceNo}</TableCell>
        <TableCell>{formatCurrency(invoice.credInvoiceAmount)}</TableCell>
        <TableCell>{formatCurrency(invoice.credInvoiceBalance)}</TableCell>
        <TableCell>{fDate(invoice.credInvoiceDate)}</TableCell>
        <TableCell>{fDate(invoice.credInvoiceDueDate)}</TableCell>
        <TableCell>
          <Label color={invoice.credInvoiceStatus === PAYMENT_STATUS.PAID ? 'success' : 'error'}>
            {invoice.credInvoiceStatus}
          </Label>
        </TableCell>
        <TableCell>{fDate(invoice.credInvoicePaidDate)}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      {openRow && (
        <PaymentInvoices open={openRow} id={invoice._id} handleFetch={handleFetchPayments} />
      )}
      {/* <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={openRow} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Payment History
              </Typography>
              <Table sx={{ minWidth: 800 }}>
                <CustomTableHead enableAction={false} headLabel={headerLabelsPayments} />
                <TableBody>
                  {invoice.invoices.map((pay, index) => (
                    <HistoryRow key={index} payment={pay} />
                  ))}
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell sx={{ border: '1px solid #e0e0e0' }}>
                      Total Received Amount
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #e0e0e0' }}>
                      {formatCurrency(
                        invoice.invoices.reduce(
                          (total, invoice) => total + invoice.invoiceAmount,
                          0
                        )
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow> */}
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
        <MenuItem onClick={handleOpenUpdateDialog}>
          <EditIcon sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        {invoice.credInvoiceStatus === PAYMENT_STATUS.NOTPAID && (
          <>
            <MenuItem onClick={handleOpenCloseAddDialog}>
              <PaidIcon fontSize="small" sx={{ mr: 1 }} />
              Payment
            </MenuItem>
            <MenuItem onClick={handleOpenDeleteDialog}>
              <DeleteForeverIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </>
        )}
      </Popover>
    </>
  );
};

PaymentRow.propTypes = {
  invoice: PropTypes.object.isRequired,
  setSelectedInvoice: PropTypes.func.isRequired,
  handleOpenUpdateDialog: PropTypes.func.isRequired,
};
