import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { IconButton, MenuItem, Popover, TableCell, TableRow, Typography } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { fDate } from 'src/utils/format-time';
import { formatCurrency } from 'src/utils/format-number';

export const PaymentInvoicesRow = ({
  invoice,
  handleOpenUpdateDialog,
  handleOpenDeleteDialog,
  setSelectedInvoiceId,
}) => {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setSelectedInvoiceId(invoice._id);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setSelectedInvoiceId(null);
    setOpen(null);
  };

  return (
    <>
      <TableRow hover>
        <TableCell component="th">
          <Typography variant="subtitle2" noWrap>
            {fDate(invoice.paymentDate)}
          </Typography>
        </TableCell>
        <TableCell>{invoice.paymentDescription}</TableCell>
        <TableCell sx={{ maxWidth: 100 }}>{formatCurrency(invoice.paymentAmount)}</TableCell>
        <TableCell align="right" width={'100'}>
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
        <MenuItem onClick={handleOpenDeleteDialog}>
          <DeleteForeverIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
};

PaymentInvoicesRow.propTypes = {
  invoice: PropTypes.object.isRequired,
  handleOpenUpdateDialog: PropTypes.func.isRequired,
  handleOpenDeleteDialog: PropTypes.func.isRequired,
};
