import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// material-ui
import { List } from '@mui/material';

// project import
import NavItem from './NavItem';

const NavGroup = ({ item }) => {
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  return (
    <List sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}>
      <NavItem key={item.id} item={item} level={1} />
    </List>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;
