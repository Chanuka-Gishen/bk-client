import React, { useState } from 'react';
import PropTypes from 'prop-types';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, MenuItem, Popover, TableCell, TableRow } from '@mui/material';
import { formatCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

export const HistoryRow = ({ payment, handleOpenUpdate, handleOpenDelete }) => {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow>
        <TableCell>{payment.invoiceNo}</TableCell>
        <TableCell>{formatCurrency(payment.invoiceAmount)}</TableCell>
        <TableCell>{fDate(payment.invoiceCreatedAt)}</TableCell>
        <TableCell align="right">
          <IconButton onClick={(e) => handleOpenMenu(e)}>
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
        <MenuItem onClick={() => handleOpenUpdate(payment)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Update
        </MenuItem>
        <MenuItem onClick={() => handleOpenDelete(payment)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
};
