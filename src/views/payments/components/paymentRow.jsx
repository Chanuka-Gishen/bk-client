import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { IconButton, MenuItem, Popover, TableCell, TableRow, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { fDate } from 'src/utils/format-time';
import { formatCurrency } from 'src/utils/format-number';

export const PaymentRow = ({
  invoice,
  setSelectedInvoice,
  handleOpenUpdateDialog,
  handleOpenDeleteDialog,
}) => {
  const user = useSelector((state) => state.auth.user);

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
        <TableCell component="th">
          <Typography variant="subtitle2" noWrap>
            {invoice.paymentDescription}
          </Typography>
        </TableCell>
        <TableCell>{formatCurrency(invoice.paymentAmount)}</TableCell>
        <TableCell>{fDate(invoice.paymentDate)}</TableCell>
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

PaymentRow.propTypes = {
  invoice: PropTypes.object.isRequired,
  setSelectedInvoice: PropTypes.func.isRequired,
  handleOpenUpdateDialog: PropTypes.func.isRequired,
};
