import React, { useEffect } from 'react';
import { DashboardView } from '../view/dashboardView';

const DashboardController = () => {
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <DashboardView />;
};

export default DashboardController;
