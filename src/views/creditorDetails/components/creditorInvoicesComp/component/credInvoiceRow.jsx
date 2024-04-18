import React, { Fragment, useState } from 'react';
import { IconButton, MenuItem, Popover, TableCell, TableRow } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PaidIcon from '@mui/icons-material/Paid';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Label from 'src/components/label';
import { PAYMENT_STATUS } from 'src/constants/commonConstants';
import { formatCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';
import { PaymentInvoices } from 'src/views/payments/components/creditPayments';

const HistoryRow = ({ payment }) => {
  return (
    <TableRow>
      <TableCell>{payment.invoiceNo}</TableCell>
      <TableCell>{formatCurrency(payment.invoiceAmount)}</TableCell>
      <TableCell>{fDate(payment.invoiceCreatedAt)}</TableCell>
    </TableRow>
  );
};

export const CredInvoiceRow = ({
  item,
  setSelectedInvoice,
  handleOpenCloseUpdateDialog,
  handleOpenCloseDeleteDialog,
  handleOpenCloseAddPaymentDialog,
  handleFetchCreditorInvoices,
}) => {
  const [open, setOpen] = useState(null);
  const [openRow, setOpenRow] = useState(false);

  const handleOpenMenu = (event, item) => {
    setSelectedInvoice(item);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setSelectedInvoice(null);
    setOpen(null);
  };

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenRow(!openRow)}
            disabled={item.invoices && item.invoices.length === 0}
          >
            {openRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{item.credInvoiceNo}</TableCell>
        <TableCell>{fDate(item.credInvoiceDate)}</TableCell>
        <TableCell>{fDate(item.credInvoiceDueDate)}</TableCell>
        <TableCell>{fDate(item.credInvoicePaidDate)}</TableCell>
        <TableCell>{formatCurrency(item.credInvoiceAmount)}</TableCell>
        <TableCell>{formatCurrency(item.credInvoiceBalance)}</TableCell>
        <TableCell>
          <Label color={item.credInvoiceStatus === PAYMENT_STATUS.PAID ? 'success' : 'error'}>
            {item.credInvoiceStatus}
          </Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={(e) => handleOpenMenu(e, item)}>
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      {openRow && (
        <PaymentInvoices open={openRow} id={item._id} handleFetch={handleFetchCreditorInvoices} />
      )}
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
          <>
            <MenuItem onClick={handleOpenCloseAddPaymentDialog}>
              <PaidIcon fontSize="small" sx={{ mr: 1 }} />
              Payment
            </MenuItem>
            <MenuItem onClick={handleOpenCloseDeleteDialog}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </>
        )}
      </Popover>
    </Fragment>
  );
};
