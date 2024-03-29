import {
  DashboardOutlined,
  BankOutlined,
  IdcardOutlined,
  ReadOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { USER_ROLE } from 'src/constants/userRole';
import { NAVIGATION_ROUTES } from 'src/routes/constants/navigationRoutes';

const icons = {
  DashboardOutlined,
  BankOutlined,
  IdcardOutlined,
  ReadOutlined,
  DollarOutlined,
};

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    url: NAVIGATION_ROUTES.dashboard,
    icon: icons.DashboardOutlined,
    users: [],
  },
  {
    id: 'creditors',
    title: 'Creditors',
    type: 'item',
    url: NAVIGATION_ROUTES.creditors.list,
    icon: icons.BankOutlined,
    users: [],
  },
  {
    id: 'sales-books',
    title: 'SalesBooks',
    type: 'item',
    url: NAVIGATION_ROUTES.salesBooks,
    icon: icons.ReadOutlined,
    users: [],
  },
  {
    id: 'payments',
    title: 'Payments',
    type: 'item',
    url: NAVIGATION_ROUTES.payments.base,
    icon: icons.DollarOutlined,
    users: [],
  },
  {
    id: 'employees',
    title: 'Employees',
    type: 'item',
    url: NAVIGATION_ROUTES.employees,
    icon: icons.IdcardOutlined,
    users: [USER_ROLE.ADMIN_ROLE, USER_ROLE.MANAGER_ROLE],
  },
];

export default menuItems;
