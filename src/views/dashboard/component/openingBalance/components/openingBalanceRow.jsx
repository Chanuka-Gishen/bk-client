import React, { useState } from 'react';
import { IconButton, MenuItem, Popover, TableCell, TableRow } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';

import { formatCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';
import commonUtil from 'src/utils/common-util';

export const OpeningBalanceRow = ({
  record,
  handleOpenUpdateDialog,
  setSelectedCashRecord,
  handleOpenResetDialog,
}) => {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setSelectedCashRecord(record);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setSelectedCashRecord(null);
    setOpen(null);
  };

  return (
    <>
      <TableRow>
        <TableCell>{fDate(record.cashBalanceDate)}</TableCell>
        <TableCell>{formatCurrency(record.openingBalance)}</TableCell>
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
        <MenuItem onClick={() => handleOpenUpdateDialog(record)}>
          <EditIcon sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleOpenResetDialog}>
          <RefreshIcon sx={{ mr: 2 }} />
          Refresh
        </MenuItem>
      </Popover>
    </>
  );
};
