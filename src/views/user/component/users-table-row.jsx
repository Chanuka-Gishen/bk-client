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
import Iconify from 'src/components/iconify';
import { useSelector } from 'react-redux';
import { USER_STATUS } from 'src/constants/commonConstants';

export const UsersTableRow = ({
  employee,
  handleOpenUpdateDialog,
  handleOpenDeleteDialog,
  handleOpenResetConfirmation,
}) => {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <TableRow hover>
        <TableCell component="th">
          <Typography variant="subtitle2" noWrap>
            {employee.userFullName}
          </Typography>
        </TableCell>
        <TableCell>{employee.userName}</TableCell>
        <TableCell>
          <Chip label={employee.userRole} color="success" />
        </TableCell>
        <TableCell>
          <Chip
            label={employee.userIsActive ? USER_STATUS.ACTIVE : USER_STATUS.Terminated}
            color={employee.userIsActive ? 'success' : 'error'}
          />
        </TableCell>
        <TableCell align="right">
          {user.id === employee._id ? null : (
            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
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
        <MenuItem onClick={() => handleOpenUpdateDialog(employee)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleOpenResetConfirmation(employee)}
          disabled={!employee.userIsActive}
        >
          <Iconify icon="eva:refresh-fill" sx={{ mr: 2 }} />
          Reset Password
        </MenuItem>
        <MenuItem
          onClick={() => handleOpenDeleteDialog(employee)}
          sx={{ color: 'error.main' }}
          disabled={!employee.userIsActive}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Terminate
        </MenuItem>
      </Popover>
    </>
  );
};

UsersTableRow.propTypes = {
  employee: PropTypes.object.isRequired,
  handleOpenUpdateDialog: PropTypes.func.isRequired,
  handleOpenResetConfirmation: PropTypes.func.isRequired,
};
