// SERVER URL
const IP_URL = import.meta.env.VITE_SERVER_URL;

// URIs
export const BACKEND_API = {
  // AUTHENTICATION API'S
  LOGIN: IP_URL + 'auth/login',
  LOGOUT: IP_URL + 'auth/logout',

  EMP_REGISTER: IP_URL + 'emp/register',
  EMP_UPDATE: IP_URL + 'emp/update',
  EMP_RESET_PWD: IP_URL + 'emp/resetPwd/',
  EMP_LIST: IP_URL + 'emp/list',

  SBOOK_CREATE: IP_URL + 'sales-book/create',
  SBOOK_GET_ALL: IP_URL + 'sales-book/',

  CREDITOR_CREATE: IP_URL + 'creditor/create',
  CREDITOR_UPDATE: IP_URL + 'creditor/update',
  CREDITOR_LIST: IP_URL + 'creditor/all',
  CREDITOR_DETAILS: IP_URL + 'creditor/details/',
  CREDITOR_INVOICES: IP_URL + 'credInvoice/creditor/',
  CREDITOR_ADD_INVOICE: IP_URL + 'credInvoice/add',
  CREDITOR_UPDATE_INVOICE: IP_URL + 'credInvoice/update',
};
