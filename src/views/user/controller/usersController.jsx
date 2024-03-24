import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { UsersView } from '../view/usersView';
import { USER_ROLE } from 'src/constants/userRole';
import axios from 'axios';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';
import { useSnackbar } from 'notistack';
import { SNACKBAR_MESSAGE, SNACKBAR_VARIANT } from 'src/constants/snackbarConstants';

//---------------------------------------------------------

const validationSchema = Yup.object().shape({
  empFirstName: Yup.string().required('Employee first name is required'),
  empLastName: Yup.string().required('Employee last name is required'),
  empRole: Yup.string()
    .required('Employee role required')
    .oneOf(
      [USER_ROLE.ADMIN_ROLE, USER_ROLE.MANAGER_ROLE, USER_ROLE.STAFF_ROLE],
      'Invalid Employee role'
    ),
});

const validationSchemaOnUpdate = Yup.object().shape({
  empFirstName: Yup.string().required('Employee first name is required'),
  empLastName: Yup.string().required('Employee last name is required'),
  empRole: Yup.string()
    .required('Employee role required')
    .oneOf(
      [USER_ROLE.ADMIN_ROLE, USER_ROLE.MANAGER_ROLE, USER_ROLE.STAFF_ROLE],
      'Invalid Employee role'
    ),
});

const UsersController = () => {
  const headerLables = ['Employee Name', 'User name', 'Role', 'Status'];

  const formik = useFormik({
    initialValues: {
      userFirstName: '',
      userLastName: '',
      userRole: '',
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      null;
    },
  });

  const updateFormik = useFormik({
    initialValues: {
      userFirstName: '',
      userLastName: '',
      userRole: '',
    },
    validationSchema: validationSchemaOnUpdate,
    onSubmit: () => {
      null;
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <UsersView />;
};

export default UsersController;
