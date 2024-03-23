import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function TableLoadingRow({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center">
        <Typography variant="subtitle2"> Loading...</Typography>
      </TableCell>
    </TableRow>
  );
}

TableLoadingRow.propTypes = {
  colSpan: PropTypes.number.isRequired,
};
