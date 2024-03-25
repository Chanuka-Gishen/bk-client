import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { FormikProvider } from 'formik';
import { USER_ROLE } from 'src/constants/userRole';
import { LoadingButton } from '@mui/lab';

export const AddEmployeeDialog = ({
  open,
  handleClose,
  formik,
  handleSubmitAddUser,
  isLoading,
}) => {
  const { touched, errors, getFieldProps } = formik;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth sx={{ px: 2 }}>
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Stack direction={'column'} spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Employee First Name*"
              fullWidth
              autoComplete="off"
              variant="outlined"
              {...getFieldProps('empFirstName')}
              error={Boolean(touched.empFirstName && errors.empFirstName)}
              helperText={touched.empFirstName && errors.empFirstName}
            />
            <TextField
              label="Employee Last Name*"
              fullWidth
              autoComplete="off"
              variant="outlined"
              {...getFieldProps('empLastName')}
              error={Boolean(touched.empLastName && errors.empLastName)}
              helperText={touched.empLastName && errors.empLastName}
            />
            <FormControl>
              <InputLabel id="select-label">User Role*</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                label="User Role"
                {...getFieldProps('empRole')}
              >
                <MenuItem value={USER_ROLE.ADMIN_ROLE}>Admin</MenuItem>
                <MenuItem value={USER_ROLE.MANAGER_ROLE}>Manager</MenuItem>
                <MenuItem value={USER_ROLE.STAFF_ROLE}>Staff</MenuItem>
              </Select>
              {Boolean(touched.empRole && errors.empRole) && (
                <FormHelperText error>{touched.empRole && errors.empRole}</FormHelperText>
              )}
            </FormControl>
          </Stack>
        </FormikProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          color="inherit"
          disabled={isLoading}
          loading={isLoading}
          onClick={handleSubmitAddUser}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

AddEmployeeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  handleSubmitAddUser: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
