import { Helmet } from 'react-helmet-async';

import { Dashboard } from 'src/views/dashboard';

// ----------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | GamageGroups </title>
      </Helmet>

      <Dashboard />
    </>
  );
}
