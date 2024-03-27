export const NAVIGATION_ROUTES = {
  // authentication routes
  login: 'login',

  // not found
  not_found: '404',
  all_path: '*',

  // main routes
  dashboard: 'dashboard/overview',
  employees: 'employees',
  creditors: {
    base: '/creditors',
    list: 'creditors',
    details: {
      base: '/creditors/',
      id: 'creditors/:id',
    },
  },
  salesBooks: 'salesBooks',
  settings: 'settings',
};
