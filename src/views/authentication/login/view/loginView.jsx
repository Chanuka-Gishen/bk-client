import React from 'react';

import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

import LoginForm from '../component/loginForm';
import AuthWrapper from 'src/components/authWrapper';
import { Grid } from '@mui/material';

// ----------------------------------------------------------------------

export const LoginView = ({ handleLogin, formik, isLoading }) => {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3">Login</Typography>
        </Grid>
        <Grid item xs={12}>
          <LoginForm handleClick={handleLogin} formik={formik} isLoading={isLoading} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

LoginView.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  formik: PropTypes.object.isRequired,
};
