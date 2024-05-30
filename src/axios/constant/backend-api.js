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
  SBOOK_UPDATE: IP_URL + 'sales-book/update',
  SBOOK_GET_ALL: IP_URL + 'sales-book/',
  SBOOK_CASHB_TOTAL: IP_URL + 'sales-book/cash-balance-total',
  SBOOK_CASHB: IP_URL + 'sales-book/cash-balance',
  SBOOK_DOWNLOAD_SUM: IP_URL + 'sales-book/download-summary',

  CREDITOR_CREATE: IP_URL + 'creditor/create',
  CREDITOR_UPDATE: IP_URL + 'creditor/update',
  CREDITOR_LIST: IP_URL + 'creditor/all',
  CREDITOR_DETAILS: IP_URL + 'creditor/details/',

  CREDITORS_INVOICES: IP_URL + 'credInvoice/all',
  CREDITOR_INVOICES: IP_URL + 'credInvoice/creditor/',
  CREDITOR_ADD_INVOICE: IP_URL + 'credInvoice/add',
  CREDITOR_UPDATE_INVOICE: IP_URL + 'credInvoice/update',
  CREDITOR_DELETE_INVOICE: IP_URL + 'credInvoice/delete/',
  CRED_INVOICE_FILTER_DAYS: IP_URL + 'credInvoice/filterByDays',

  CRED_PAYMENT_INVOICES: IP_URL + 'invoice/cred-payments/',

  INVOICE_CREATE_RANGE: IP_URL + 'invoice/add-range',
  INVOICE_CREATE_SINGLE: IP_URL + 'invoice/add-single',
  INVOICE_CREATE_CRED: IP_URL + 'invoice/add-cred',
  INVOICE_UPDATE: IP_URL + 'invoice/update/',
  INVOICE_UPDATE_PAYMENT: IP_URL + 'invoice/update-cred',
  INVOICE_DELETE: IP_URL + 'invoice/delete/',
  INVOICE_DELETE_PAYMENT: IP_URL + 'invoice/delete-cred/',
  INVOICE_BY_BOOK: IP_URL + 'invoice/book/',
  INVOICE_CRED_PAYMENTS: IP_URL + 'invoice/cred-payments',
  INVOICE_BULK: IP_URL + 'invoice/bulk-invoices/',
  INVOICE_TOTAL_CRED_PAYMENTS: IP_URL + 'invoice/cred-payment-total',
  INVOICE_STATS_AMOUNT: IP_URL + 'invoice/invoices-net/',

  PAYMENT_ADD: IP_URL + 'payment/add',
  PAYMENT_UPDATE: IP_URL + 'payment/update',
  PAYMENT_DELETE: IP_URL + 'payment/delete/',
  PAYMENTS: IP_URL + 'payment/invoices',
  PAYMENTS_TOTAL: IP_URL + 'payment/total',

  CASHB_ADD: IP_URL + 'balance/add',
  CASHB_GET_RECENT: IP_URL + 'balance/recent',
  CASHB_GET_TODAY: IP_URL + 'balance/today',
  CASHB_UPDATE: IP_URL + 'balance/update',
  CASHB_RESET: IP_URL + 'balance/reset/',
};
