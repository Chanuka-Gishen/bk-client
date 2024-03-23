import { lazy } from 'react';

// project import
import MinimalLayout from 'src/layout/minimalLayout';
import { NAVIGATION_ROUTES } from './constants/navigationRoutes';
import { Navigate } from 'react-router-dom';

// render - login
const AuthLogin = lazy(() => import('src/pages/loginPage'));
const NotFoundPage = lazy(() => import('src/pages/notFoundPage'));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = () => {
  return {
    path: '/',
    element: <MinimalLayout />,
    children: [
      {
        path: NAVIGATION_ROUTES.login,
        element: <AuthLogin />,
      },
      { path: NAVIGATION_ROUTES.not_found, element: <NotFoundPage /> },
      {
        path: NAVIGATION_ROUTES.all_path,
        element: <Navigate to={NAVIGATION_ROUTES.not_found} replace />,
      },
    ],
  };
};

export default LoginRoutes;
