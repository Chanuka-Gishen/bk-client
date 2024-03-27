import { DashboardOutlined, BankOutlined, IdcardOutlined, ReadOutlined } from '@ant-design/icons';
import { NAVIGATION_ROUTES } from 'src/routes/constants/navigationRoutes';

const icons = {
  DashboardOutlined,
  BankOutlined,
  IdcardOutlined,
  ReadOutlined,
};

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    url: NAVIGATION_ROUTES.dashboard,
    icon: icons.DashboardOutlined,
  },
  {
    id: 'creditors',
    title: 'Creditors',
    type: 'item',
    url: NAVIGATION_ROUTES.creditors.list,
    icon: icons.BankOutlined,
  },
  {
    id: 'sales-books',
    title: 'SalesBooks',
    type: 'item',
    url: NAVIGATION_ROUTES.salesBooks,
    icon: icons.ReadOutlined,
  },
  {
    id: 'employees',
    title: 'Employees',
    type: 'item',
    url: NAVIGATION_ROUTES.employees,
    icon: icons.IdcardOutlined,
  },
];

export default menuItems;
