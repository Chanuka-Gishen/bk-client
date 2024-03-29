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
import { USER_STATUS } from 'src/constants/commonConstants';

export const EmpRow = ({
  employee,
  setSelectedEmp,
  handleOpenUpdateDialog,
  handleOpenResetConfirmation,
}) => {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setSelectedEmp(employee);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setSelectedEmp(null);
    setOpen(null);
  };

  return (
    <>
      <TableRow hover>
        <TableCell component="th">
          <Typography variant="subtitle2" noWrap>
            {`${employee.empFirstName} ${employee.empLastName}`}
          </Typography>
        </TableCell>
        <TableCell>{employee.empUserName}</TableCell>
        <TableCell>
          <Chip label={employee.empRole} color="success" />
        </TableCell>
        <TableCell>
          <Chip
            label={employee.empIsActive ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE}
            color={employee.empIsActive ? 'success' : 'error'}
          />
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
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
        <MenuItem onClick={() => handleOpenUpdateDialog(employee)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleOpenResetConfirmation(employee)}
          disabled={!employee.empIsActive}
        >
          <Iconify icon="eva:refresh-fill" sx={{ mr: 2 }} />
          Reset Password
        </MenuItem>
      </Popover>
    </>
  );
};

EmpRow.propTypes = {
  employee: PropTypes.object.isRequired,
  handleOpenUpdateDialog: PropTypes.func.isRequired,
  handleOpenResetConfirmation: PropTypes.func.isRequired,
};
