// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme) {
  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: 12,
          border: 'none',
        },
        head: {
          fontWeight: 600,
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: theme.palette.grey[200],
        },
      },
    },
  };
}
