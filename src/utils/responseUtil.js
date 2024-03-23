import { SNACKBAR_VARIANT } from 'src/constants/snackbarConstants';

const isResponseSuccess = (responseCode = null) => {
  const responseStatus = responseCode.slice(-1);
  switch (responseStatus) {
    case '1':
      return true;
    default:
      return false;
  }
};

const findResponseType = (responseCode = null) => {
  const responseStatus = responseCode.slice(-1);
  switch (responseStatus) {
    case '1':
      return SNACKBAR_VARIANT.SUCCESS;
    case '2':
      return SNACKBAR_VARIANT.INFO;
    case '3':
      return SNACKBAR_VARIANT.WARNING;
    case '4':
      return SNACKBAR_VARIANT.ERROR;
    default:
      return null;
  }
};

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  isResponseSuccess,
  findResponseType,
};
