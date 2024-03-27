import React from 'react';
import {
  Breadcrumbs,
  Card,
  Chip,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  emphasize,
  styled,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';

import { NAVIGATION_ROUTES } from 'src/routes/constants/navigationRoutes';
import { CreditorInvoicesComp } from '../components/creditorInvoicesComp';
import { CreditorInfoComp } from '../components/creditorInfoComp';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(4),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

export const CreditorDetailsView = ({ id, creditor, isLoading }) => {
  return (
    <Grid container rowSpacing={4} columnSpacing={2}>
      <Grid item xs={12} sm={12}>
        <Breadcrumbs>
          <StyledBreadcrumb
            size="large"
            component="a"
            href={NAVIGATION_ROUTES.creditors.base}
            label="Creditors"
            icon={<HomeIcon fontSize="small" />}
            style={{ cursor: 'pointer' }}
          />
          <StyledBreadcrumb disabled={true} label="Details" />
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} sm={6}>
        <CreditorInfoComp isLoading={isLoading} creditor={creditor} />
      </Grid>
      <Grid item xs={12} sm={12}>
        <CreditorInvoicesComp id={id} />
      </Grid>
    </Grid>
  );
};
