import PropTypes from 'prop-types';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const SearchInput = ({ filterName, onFilterName, placeholder }) => {
  return (
    <OutlinedInput
      value={filterName}
      onChange={onFilterName}
      placeholder={placeholder ? placeholder : 'Search ...'}
      startAdornment={
        <InputAdornment position="start">
          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
        </InputAdornment>
      }
    />
  );
};

SearchInput.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  placeholder: PropTypes.string,
};

export default SearchInput;
