// material-ui
import { Box } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItems from 'src/layout/menuItems';
import accessUtil from 'src/utils/accessUtil';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const navGroups = menuItems.map((item) =>
    accessUtil.hasPermission(item.users) ? <NavGroup key={item.id} item={item} /> : null
  );

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
