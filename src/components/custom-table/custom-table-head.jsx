import React from 'react';
import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export const CustomTableHead = ({ headLabel, enableAction = true }) => {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell, index) => (
          <TableCell
            key={index}
            align={'left'}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            {headCell}
          </TableCell>
        ))}
        {enableAction && <TableCell align={'right'}>Action</TableCell>}
      </TableRow>
    </TableHead>
  );
};

CustomTableHead.propTypes = {
  headLabel: PropTypes.array.isRequired,
  enableAction: PropTypes.bool,
};
