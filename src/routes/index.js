import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './loginRoutes';
import MainRoutes from './mainRoutes';

export default function Routes() {
  return useRoutes([MainRoutes(), LoginRoutes()]);
}
