import React from 'react';
import PropTypes from 'prop-types';
import { NumericFormat } from 'react-number-format';

export const CurrencyInput = React.forwardRef(function CurrencyInput(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        const value = values.value === null ? 0 : values.value;
        onChange({
          target: {
            name: props.name,
            value: value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="Rs. "
    />
  );
});

CurrencyInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
