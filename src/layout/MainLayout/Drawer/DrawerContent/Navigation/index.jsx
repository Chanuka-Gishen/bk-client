// material-ui
import { Box } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItems from 'src/layout/menuItems';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const navGroups = menuItems.map((item) => <NavGroup key={item.id} item={item} />);

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
