import React, { Fragment, useState } from 'react';
import { IconButton, MenuItem, Popover, TableCell, TableRow } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Label from 'src/components/label';
import { PAYMENT_STATUS } from 'src/constants/commonConstants';
import { formatCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

export const CredInvoiceRow = ({
  item,
  setSelectedInvoice,
  handleOpenCloseUpdateDialog,
  handleOpenCloseDeleteDialog,
}) => {
  const [open, setOpen] = useState(null);

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
        <TableCell>{item.credInvoiceNo}</TableCell>
        <TableCell>{fDate(item.credInvoiceDate)}</TableCell>
        <TableCell>{fDate(item.credInvoiceDueDate)}</TableCell>
        <TableCell>{fDate(item.credInvoicePaidDate)}</TableCell>
        <TableCell>{formatCurrency(item.credInvoiceAmount)}</TableCell>
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
  );
};
