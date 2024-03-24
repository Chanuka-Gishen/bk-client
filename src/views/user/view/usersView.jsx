import React from 'react';
import PropTypes from 'prop-types';

import { Button, Container, Stack, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';

export const UsersView = ({}) => {
  return (
    <Container maxWidth={'xl'}>
      <Stack direction={'row'} alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Employees</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={null}
        >
          Add
        </Button>
      </Stack>
    </Container>
  );
};

UsersView.propTypes = {};
