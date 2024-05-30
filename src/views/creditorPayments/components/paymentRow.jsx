import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, MenuItem, Popover, TableCell, TableRow, Typography } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { fDate } from 'src/utils/format-time';
import { formatCurrency } from 'src/utils/format-number';
import { PAYMENT_STATUS } from 'src/constants/commonConstants';

export const PaymentRow = ({
  invoice,
  setSelectedInvoice,
  handleOpenUpdateDialog,
  handleOpenDeleteDialog,
}) => {
  const [open, setOpen] = useState(null);

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
        <TableCell>{invoice.invoiceCreditorInvoiceRef.credInvoiceNo}</TableCell>
        <TableCell>{invoice.invoiceNo}</TableCell>
        <TableCell component="th">
          <Typography variant="subtitle2" noWrap>
            {invoice.invoiceCreditorRef.creditorName}
          </Typography>
        </TableCell>

        <TableCell>{formatCurrency(invoice.invoiceCreditorInvoiceRef.credInvoiceAmount)}</TableCell>
        <TableCell>
          {formatCurrency(invoice.invoiceCreditorInvoiceRef.credInvoiceBalance)}
        </TableCell>
        <TableCell>{formatCurrency(invoice.invoiceAmount)}</TableCell>
        <TableCell>{fDate(invoice.invoiceCreditorInvoiceRef.credInvoiceDate)}</TableCell>
        <TableCell>{fDate(invoice.invoiceCreatedAt)}</TableCell>
        <TableCell>{fDate(invoice.invoiceCreditorInvoiceRef.credInvoiceDueDate)}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
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
      >
        <MenuItem onClick={() => handleOpenUpdateDialog(invoice)}>
          <EditIcon sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        {invoice.invoiceCreditorInvoiceRef.credInvoiceStatus === PAYMENT_STATUS.NOTPAID && (
          <MenuItem onClick={handleOpenDeleteDialog}>
            <DeleteForeverIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
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
