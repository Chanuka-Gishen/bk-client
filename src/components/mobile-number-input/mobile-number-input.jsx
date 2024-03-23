import * as React from 'react';
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, onBlur, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="#0 000 0000"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      onBlur={(event) => {
        onBlur(event);
        onChange(event);
      }}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const MobileNumberInput = ({
  name,
  value,
  onChange,
  handleBlur,
  error,
  helperText,
  ...props
}) => {
  return (
    <TextField
      label="Customer Mobile Number"
      name={name}
      fullWidth
      variant="outlined"
      value={value}
      onChange={onChange}
      onBlur={handleBlur}
      InputProps={{
        inputComponent: TextMaskCustom,
        startAdornment: <InputAdornment position="start">+94</InputAdornment>,
      }}
    />
  );
};
