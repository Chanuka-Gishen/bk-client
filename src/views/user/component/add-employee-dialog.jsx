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
              {...getFieldProps('userFirstName')}
              error={Boolean(touched.userFirstName && errors.userFirstName)}
              helperText={touched.userFirstName && errors.userFirstName}
            />
            <TextField
              label="Employee Last Name*"
              fullWidth
              autoComplete="off"
              variant="outlined"
              {...getFieldProps('userLastName')}
              error={Boolean(touched.userLastName && errors.userLastName)}
              helperText={touched.userLastName && errors.userLastName}
            />
            <FormControl>
              <InputLabel id="select-label">User Role*</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                label="User Role"
                {...getFieldProps('userRole')}
              >
                <MenuItem value={USER_ROLE.ADMIN}>Admin</MenuItem>
                <MenuItem value={USER_ROLE.TECHNICIAN}>Technician</MenuItem>
                <MenuItem value={USER_ROLE.HELPER}>Helper</MenuItem>
              </Select>
              {Boolean(touched.userRole && errors.userRole) && (
                <FormHelperText>{touched.userRole && errors.userRole}</FormHelperText>
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
