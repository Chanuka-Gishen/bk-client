import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function TableEmptyRow({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center" sx={{ borderBottom: 'none' }}>
        <Typography variant="subtitle2"> No data found</Typography>
      </TableCell>
    </TableRow>
  );
}

TableEmptyRow.propTypes = {
  colSpan: PropTypes.number.isRequired,
};
