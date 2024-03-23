import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';

import Iconify from 'src/components/iconify';

export const PasswordField = ({ error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <OutlinedInput
      type={showPassword ? 'text' : 'password'}
      endAdornment={
        <InputAdornment position="end">
          <IconButton onClick={handleShowPassword} edge="end">
            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
          </IconButton>
        </InputAdornment>
      }
      {...props}
      error={error}
    />
  );
};

PasswordField.propTypes = {
  error: PropTypes.bool,
};
