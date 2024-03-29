import { useSelector } from 'react-redux';

const useUser = () => {
  return useSelector((state) => state.auth.user.userRole);
};

const hasPermission = (permissionList) => {
  const userRole = useUser();
  if (permissionList.length === 0) {
    return true;
  } else {
    return permissionList.includes(userRole);
  }
};

export default { hasPermission };
