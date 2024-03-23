import React from 'react';
import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

export const DashboardView = ({}) => {
  //const user = useSelector((state) => state.auth.user);

  return (
    <Container maxWidth="xl">
      <Typography>DASHBOARD</Typography>
    </Container>
  );
};

DashboardView.propTypes = {};
