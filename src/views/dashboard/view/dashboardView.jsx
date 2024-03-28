import { useState } from 'react';

// material-ui
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

// project import
import OrdersTable from './OrdersTable';
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import SalesColumnChart from './SalesColumnChart';

// assets
import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import avatar1 from '/assets/images/users/avatar-1.png';
import avatar2 from '/assets/images/users/avatar-2.png';
import avatar3 from '/assets/images/users/avatar-3.png';
import avatar4 from '/assets/images/users/avatar-4.png';
import MainCard from 'src/components/mainCard';
import AnalyticEcommerce from '../component/analyticEcommerce';
import { DueInvoicesTable } from '../component/dueInvoicesTable';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem',
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none',
};

// sales report status
const status = [
  {
    value: 'today',
    label: 'Today',
  },
  {
    value: 'month',
    label: 'This Month',
  },
  {
    value: 'year',
    label: 'This Year',
  },
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export const DashboardView = ({
  selectedDays,
  isLoadingDueInvoices,
  dueInvocies,
  handleSelectDueDays,
  headersDueInvoice,
}) => {
  const [value, setValue] = useState('today');
  const [slot, setSlot] = useState('week');

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Page Views"
          count="4,42,236"
          percentage={59.3}
          extra="35,000"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Users" count="78,250" percentage={70.5} extra="8,900" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Order"
          count="18,800"
          percentage={27.4}
          isLoss
          color="warning"
          extra="1,943"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Sales"
          count="$35,078"
          percentage={27.4}
          isLoss
          color="warning"
          extra="$20,395"
        />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      <Grid item xs={12} sm={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Recent Due Invoices</Typography>
          <Select value={selectedDays} label="Days" onChange={handleSelectDueDays}>
            <MenuItem value={7}>Within 7 Days</MenuItem>
            <MenuItem value={10}>Within 10 Days</MenuItem>
            <MenuItem value={14}>Within 14 Days</MenuItem>
            <MenuItem value={30}>Within 30 Days</MenuItem>
          </Select>
        </Stack>
        <MainCard sx={{ mt: 2 }} content={false}>
          <DueInvoicesTable
            headers={headersDueInvoice}
            isLoading={isLoadingDueInvoices}
            invoices={dueInvocies}
          />
        </MainCard>
      </Grid>
    </Grid>
  );
};
