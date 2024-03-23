import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// material-ui
import { List } from '@mui/material';

// project import
import NavItem from './NavItem';

const NavGroup = ({ item }) => {
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  const navCollapse = item.children?.map((menuItem) => (
    <NavItem key={menuItem.id} item={menuItem} level={1} />
  ));

  return <List sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}>{navCollapse}</List>;
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;
