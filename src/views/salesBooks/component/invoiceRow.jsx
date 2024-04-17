import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, MenuItem, Popover, TableCell, TableRow, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { fDate } from 'src/utils/format-time';
import { formatCurrency } from 'src/utils/format-number';
import { INVOICE_TYPES } from 'src/constants/invoiceTypeConstants';

export const InvoiceRow = ({
  bookType,
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
        {bookType === INVOICE_TYPES.RANGE ? (
          <>
            <TableCell component="th">
              <Typography variant="subtitle2" noWrap>
                {invoice.invoiceNoFrom}
              </Typography>
            </TableCell>
            <TableCell component="th">
              <Typography variant="subtitle2" noWrap>
                {invoice.invoiceNoTo}
              </Typography>
            </TableCell>
          </>
        ) : (
          <TableCell component="th">
            <Typography variant="subtitle2" noWrap>
              {invoice.invoiceNo}
            </Typography>
          </TableCell>
        )}
        <TableCell>{invoice.invoiceDescription ? invoice.invoiceDescription : '-'}</TableCell>
        <TableCell>{fDate(invoice.invoiceCreatedAt)}</TableCell>
        <TableCell>{formatCurrency(invoice.invoiceInAmount)}</TableCell>
        <TableCell>{formatCurrency(invoice.invoiceOutAmount)}</TableCell>
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
        // PaperProps={{
        //   sx: { width: 140 },
        // }}
      >
        <MenuItem onClick={handleOpenUpdateDialog}>
          <EditIcon sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog}>
          <DeleteForeverIcon sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
};

InvoiceRow.propTypes = {
  invoice: PropTypes.object.isRequired,
  setSelectedInvoice: PropTypes.func,
  handleOpenUpdateDialog: PropTypes.func,
  handleOpenDeleteDialog: PropTypes.func,
};
