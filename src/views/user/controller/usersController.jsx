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
  empIsActive: Yup.boolean().required('Employee status required'),
});

const UsersController = () => {
  const headerLables = ['Employee Name', 'User name', 'Role', 'Status'];

  const { enqueueSnackbar } = useSnackbar();
  const sourceToken = axios.CancelToken.source();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenResetPwd, setIsOpenResetPwd] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAddUser, setIsLoadingAddUser] = useState(false);
  const [isLoadingUpdateUser, setIsLoadingUpdateUser] = useState(false);
  const [isLoadingResetPwd, setIsLoadingResetPwd] = useState(false);

  const formik = useFormik({
    initialValues: {
      empFirstName: '',
      empLastName: '',
      empRole: '',
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      null;
    },
  });

  const updateFormik = useFormik({
    initialValues: {
      empFirstName: '',
      empLastName: '',
      empRole: '',
      empIsActive: true,
    },
    validationSchema: validationSchemaOnUpdate,
    onSubmit: () => {
      null;
    },
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenCloseAddDialog = () => {
    setIsOpenAdd(!isOpenAdd);

    if (!isOpenAdd) {
      formik.resetForm();
    }
  };

  const handleOpenCloseUpdateDialog = (data) => {
    setIsOpenUpdate(!isOpenUpdate);

    if (!isOpenUpdate) {
      updateFormik.setValues({
        empFirstName: data.empFirstName,
        empLastName: data.empLastName,
        empRole: data.empRole,
        empIsActive: data.empIsActive,
      });
    } else {
      updateFormik.resetForm();
    }
  };

  const handleOpenCloseResetDialog = () => {
    setIsOpenResetPwd(!isOpenResetPwd);
  };

  const handleAddUser = async () => {
    setIsLoadingAddUser(true);

    if (formik.isValid && formik.dirty) {
      await backendAuthApi({
        url: BACKEND_API.EMP_REGISTER,
        method: 'POST',
        cancelToken: sourceToken.token,
        data: formik.values,
      })
        .then((res) => {
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });

          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleOpenCloseAddDialog();
            handleFetchUsers();
          }
        })
        .catch(() => {
          setIsLoadingAddUser(false);
        })
        .finally(() => {
          setIsLoadingAddUser(false);
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, { variant: SNACKBAR_VARIANT.WARNING });
    }
  };

  const handleUpdateUser = async () => {
    setIsLoadingUpdateUser(true);

    await backendAuthApi({
      url: BACKEND_API.EMP_UPDATE,
      method: 'PUT',
      cancelToken: sourceToken.token,
      data: {
        _id: selectedEmp._id,
        ...updateFormik.values,
      },
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          handleOpenCloseUpdateDialog(null);
          handleFetchUsers();
        } else {
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        }
      })
      .catch(() => {
        setIsLoadingUpdateUser(false);
      })
      .finally(() => {
        setIsLoadingUpdateUser(false);
      });
  };

  const handleResetPwd = async () => {
    setIsLoadingResetPwd(true);

    await backendAuthApi({
      url: BACKEND_API.EMP_RESET_PWD + selectedEmp._id,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          handleFetchUsers();
          handleOpenCloseResetDialog();
        } else {
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        }
      })
      .catch((res) => {
        setIsLoadingResetPwd(false);
      })
      .finally((res) => {
        setIsLoadingResetPwd(false);
      });
  };

  const handleFetchUsers = async () => {
    setIsLoading(true);

    await backendAuthApi({
      url: BACKEND_API.EMP_LIST,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setEmployees(res.data.responseData);
        }
      })
      .catch(() => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    handleFetchUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UsersView
      headerLables={headerLables}
      setSelectedEmp={setSelectedEmp}
      isLoading={isLoading}
      employees={employees}
      isOpenAdd={isOpenAdd}
      handleOpenCloseAddDialog={handleOpenCloseAddDialog}
      formik={formik}
      handleAddUser={handleAddUser}
      isLoadingAddUser={isLoadingAddUser}
      isOpenUpdate={isOpenUpdate}
      updateFormik={updateFormik}
      handleOpenCloseUpdateDialog={handleOpenCloseUpdateDialog}
      isLoadingUpdateUser={isLoadingUpdateUser}
      handleUpdateUser={handleUpdateUser}
      isOpenResetPwd={isOpenResetPwd}
      handleOpenCloseResetDialog={handleOpenCloseResetDialog}
      isLoadingResetPwd={isLoadingResetPwd}
      handleResetPwd={handleResetPwd}
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default UsersController;
