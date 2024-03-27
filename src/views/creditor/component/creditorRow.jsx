import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Chip,
  IconButton,
  MenuItem,
  Popover,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from 'react-redux';
import { fDate } from 'src/utils/format-time';

export const CreditorRow = ({
  creditor,
  handleOnClickRow,
  setSelectedCreditor,
  handleOpenUpdateDialog,
  handleOpenCloseInvoiceDialog,
}) => {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setSelectedCreditor(creditor);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setSelectedCreditor(null);
    setOpen(null);
  };

  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <TableRow hover onClick={() => handleOnClickRow(creditor)}>
        <TableCell component="th">
          <Typography variant="subtitle2" noWrap>
            {creditor.creditorName}
          </Typography>
        </TableCell>
        <TableCell>{creditor.creditorCity}</TableCell>
        <TableCell>{creditor.creditorUserName}</TableCell>
        <TableCell>{creditor.creditorCreditPeriod} Days</TableCell>
        <TableCell>{creditor.creditorMobilePrimary}</TableCell>
        <TableCell>
          {creditor.creditorMobileSecondary ? creditor.creditorMobileSecondary : ' - '}
        </TableCell>
        <TableCell>{fDate(creditor.creditorCreatedAt)}</TableCell>
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
        <MenuItem onClick={() => handleOpenUpdateDialog(creditor)}>
          <EditIcon sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleOpenCloseInvoiceDialog}>
          <AddBoxIcon sx={{ mr: 2 }} />
          invoice
        </MenuItem>
      </Popover>
    </>
  );
};

CreditorRow.propTypes = {
  creditor: PropTypes.object.isRequired,
  setSelectedCreditor: PropTypes.func.isRequired,
  handleOpenUpdateDialog: PropTypes.func.isRequired,
};
