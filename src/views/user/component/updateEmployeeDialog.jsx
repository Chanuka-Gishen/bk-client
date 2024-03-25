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
import { USER_STATUS } from 'src/constants/commonConstants';

export const UpdateEmployeeDialog = ({ open, handleClose, formik, handleSubmit, isLoading }) => {
  const { touched, errors, getFieldProps } = formik;

  return (
    <Dialog open={open} onClose={() => handleClose(null)} fullWidth sx={{ px: 2 }}>
      <DialogTitle>Update Employee</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Stack direction={'column'} spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Employee First Name*"
              fullWidth
              variant="outlined"
              {...getFieldProps('empFirstName')}
              error={Boolean(touched.empFirstName && errors.empFirstName)}
              helperText={touched.empFirstName && errors.empFirstName}
            />
            <TextField
              label="Employee Last Name*"
              fullWidth
              variant="outlined"
              {...getFieldProps('empLastName')}
              error={Boolean(touched.empLastName && errors.empLastName)}
              helperText={touched.empLastName && errors.empLastName}
            />
            <FormControl>
              <InputLabel id="select-label">Employee Role*</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                label="Employee Role"
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
            <FormControl>
              <InputLabel id="select-label">Employee Status*</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                label="Employee Status"
                {...getFieldProps('empIsActive')}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Terminated</MenuItem>
              </Select>
              {Boolean(touched.empIsActive && errors.empIsActive) && (
                <FormHelperText error>{touched.empIsActive && errors.empIsActive}</FormHelperText>
              )}
            </FormControl>
          </Stack>
        </FormikProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(null)}>Cancel</Button>
        <LoadingButton
          variant="contained"
          color="inherit"
          disabled={isLoading}
          loading={isLoading}
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

UpdateEmployeeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
