import { LoadingButton } from '@mui/lab';
import {
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';
import { FormikProvider } from 'formik';
import { PasswordField } from 'src/components/password-field/passwordField';

const LoginForm = ({ handleClick, formik, isLoading }) => {
  const { touched, errors, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="username-login">User Name*</InputLabel>
            <OutlinedInput
              id="username-login"
              name="empUserName"
              placeholder="Enter user name"
              fullWidth
              autoComplete="off"
              {...getFieldProps('empUserName')}
              error={Boolean(touched.empUserName && errors.empUserName)}
            />
            {touched.empUserName && errors.empUserName && (
              <FormHelperText error id="standard-weight-helper-text-email-login">
                {errors.empUserName}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="password-login">Password*</InputLabel>
            <PasswordField
              fullWidth
              id="-password-login"
              name="password"
              placeholder="Enter password"
              {...getFieldProps('empPassword')}
              error={Boolean(touched.empPassword && errors.empPassword)}
            />
            {touched.empPassword && errors.empPassword && (
              <FormHelperText error id="standard-weight-helper-text-password-login">
                {errors.empPassword}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        {errors.submit && (
          <Grid item xs={12}>
            <FormHelperText error>{errors.submit}</FormHelperText>
          </Grid>
        )}
        <Grid item xs={12}>
          <LoadingButton
            disableElevation={false}
            onClick={handleClick}
            disabled={isLoading || (formik.isValid && formik.isDirty)}
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ backgroundColor: 'primary.darker' }}
          >
            Login
          </LoadingButton>
        </Grid>
      </Grid>
    </FormikProvider>
  );
};

LoginForm.propTypes = {
  handleClick: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default LoginForm;
