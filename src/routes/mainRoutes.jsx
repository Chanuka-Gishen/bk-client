import { lazy } from 'react';

// project import
import MainLayout from 'src/layout/MainLayout';
import { NAVIGATION_ROUTES } from './constants/navigationRoutes';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// render - dashboard
const Dashboard = lazy(() => import('src/pages/dashboardPage'));
const CreditorsPage = lazy(() => import('src/pages/creditorsPage'));
const SalesBooksPage = lazy(() => import('src/pages/salesBookPage'));
const EmployeesPage = lazy(() => import('src/pages/employeesPage'));

const MainRoutes = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return {
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <Navigate to={NAVIGATION_ROUTES.login} replace />,
    children: [
      { path: '/', element: <Navigate to={NAVIGATION_ROUTES.dashboard} replace /> },
      { path: NAVIGATION_ROUTES.dashboard, element: <Dashboard /> },
      { path: NAVIGATION_ROUTES.creditors, element: <CreditorsPage /> },
      { path: NAVIGATION_ROUTES.employees, element: <EmployeesPage /> },
      { path: NAVIGATION_ROUTES.salesBooks, element: <SalesBooksPage /> },
    ],
  };
};

export default MainRoutes;
