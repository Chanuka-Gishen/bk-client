import React from 'react';
import {
  Breadcrumbs,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  emphasize,
  styled,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { NAVIGATION_ROUTES } from 'src/routes/constants/navigationRoutes';
import { CreditorInvoicesComp } from '../components/creditorInvoicesComp';
import { CreditorInfoComp } from '../components/creditorInfoComp';
import { UpdateCreditorDialog } from '../components/updateCreditorDialog';
import { AddInvoiceDialog } from '../components/addInvoiceDialog';

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

export const CreditorDetailsView = ({
  id,
  creditor,
  isLoading,
  handleOpenUpdateDialog,
  handleOpenCloseInvoiceDialog,
  isOpenCreditorUpdate,
  isOpenAddInvoice,
  formik,
  handleOpenCloseCreditorUpdate,
  handleUpdateCreditor,
  isLoadingCreditorUpdate,
  formikInvoice,
  isLoadingAddInvoice,
  handleSubmitAddInvoice,
  invoices,
  isLoadingInvoices,
  handleFetchCreditorInvoices,
}) => {
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
      <Grid item xs={12} sm={6}>
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardActionArea onClick={handleOpenUpdateDialog}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                      <EditIcon />
                      <Typography>Update Creditor</Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardActionArea onClick={handleOpenCloseInvoiceDialog}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                      <AddBoxIcon />
                      <Typography>Add Invoice</Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </>
      </Grid>
      <Grid item xs={12} sm={12}>
        <CreditorInvoicesComp
          id={creditor ? creditor._id : null}
          isLoading={isLoadingInvoices}
          invoices={invoices}
          handleFetchCreditorInvoices={handleFetchCreditorInvoices}
        />
      </Grid>
      {isOpenCreditorUpdate && (
        <UpdateCreditorDialog
          open={isOpenCreditorUpdate}
          formik={formik}
          handleClose={handleOpenCloseCreditorUpdate}
          handleSubmit={handleUpdateCreditor}
          isLoading={isLoadingCreditorUpdate}
        />
      )}
      {isOpenAddInvoice && (
        <AddInvoiceDialog
          open={isOpenAddInvoice}
          formik={formikInvoice}
          handleClose={handleOpenCloseInvoiceDialog}
          isLoading={isLoadingAddInvoice}
          handleSubmit={handleSubmitAddInvoice}
        />
      )}
    </Grid>
  );
};
