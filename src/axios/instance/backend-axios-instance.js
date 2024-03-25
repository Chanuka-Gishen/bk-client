import axios from 'axios';
import { useDispatch } from 'react-redux';
import { v1 as uuid } from 'uuid';

import common_util from 'src/utils/common-util';
import { enqueueSnackbar as enqueueSnackbarAction } from 'src/store/action/snackbarAction';

import { SNACKBAR_MESSAGE } from 'src/constants/snackbarConstants';
import authAction from 'src/store/action/authAction';
import responseUtil from 'src/utils/responseUtil';
import { reduxPersistStore } from 'src/store/persistStore';

const enqueueSnackbar = (...args) => reduxPersistStore.dispatch(enqueueSnackbarAction(...args));

export const backendAuthApi = axios.create({
  // one minute timeout
  timeout: 60000,
});

backendAuthApi.interceptors.request.use((request) => {
  const bearerToken = reduxPersistStore.getState().auth.user.token;
  if (bearerToken) {
    request.headers.Authorization = `Bearer ${bearerToken}`;
  }
  return request;
});

backendAuthApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error && !axios.isCancel(error)) {
      let errorMessage = SNACKBAR_MESSAGE.SOMETHING_WENT_WRONG.MESSAGE;
      let errorCode = null;

      if (error.response) {
        const errorResponse = error.response.data;
        if (!common_util.isUndefinedOrNull(errorResponse.responseMessage)) {
          errorMessage = errorResponse.responseMessage;
          errorCode = errorResponse.responseCode;
        }
        /**
         * Logout user if the response code matches the below mentioned
         * AUTH-002 is returned if user's token is expired
         * AUTH-003 is returned if user's token is invalid
         * AUTH-004 is returned if user is disabled
         */

        if (errorResponse.responseCode === 'AUTH-004') {
          reduxPersistStore.dispatch(authAction.logoutUser());

          enqueueSnackbar({
            message: errorMessage,
            options: {
              key: uuid(),
              variant: errorCode
                ? responseUtil.findResponseType(errorCode)
                : SNACKBAR_MESSAGE.SOMETHING_WENT_WRONG.VARIANT,
            },
          });

          return;
        }
      }

      enqueueSnackbar({
        message: errorMessage,
        options: {
          key: uuid(),
          variant: errorCode
            ? responseUtil.findResponseType(errorCode)
            : SNACKBAR_MESSAGE.SOMETHING_WENT_WRONG.VARIANT,
        },
      });
    }
    return Promise.reject(error);
  }
);
