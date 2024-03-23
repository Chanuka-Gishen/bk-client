import React, { useState } from 'react';

import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import * as Yup from 'yup';

import { LoginView } from '../view/loginView';
import authAction from 'src/store/action/authAction';

import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';
import { useNavigate } from 'react-router-dom';
import { SNACKBAR_MESSAGE, SNACKBAR_VARIANT } from 'src/constants/snackbarConstants';
import { NAVIGATION_ROUTES } from 'src/routes/constants/navigationRoutes';

//-------------------------------------------------------

const validationSchema = Yup.object().shape({
  empUserName: Yup.string().required('User Name is required'),
  empPassword: Yup.string().required('Password is required'),
});

const LoginController = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  let cancelToken = axios.CancelToken.source();

  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      empUserName: '',
      empPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      null;
    },
  });

  const handleLogin = async () => {
    formik.validateForm();
    formik.setTouched({ empUserName: true, empPassword: true });
    if (formik.isValid && formik.dirty) {
      setIsLoading(true);

      await backendAuthApi({
        url: BACKEND_API.LOGIN,
        method: 'POST',
        cancelToken: cancelToken.token,
        data: formik.values,
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            dispatch(authAction.loginUser(res.data.responseData));
            navigate('/');
          } else {
            enqueueSnackbar(data.responseMessage, {
              variant: responseUtil.findResponseType(res.data.responseCode),
            });
          }
        })
        .catch(() => {
          setIsLoading(false);
        })
        .then(() => {
          setIsLoading(false);
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, {
        variant: SNACKBAR_VARIANT.WARNING,
      });
    }
  };

  return <LoginView handleLogin={handleLogin} formik={formik} isLoading={isLoading} />;
};

export default LoginController;
