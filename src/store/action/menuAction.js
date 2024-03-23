import { MENU_CONSTANT_REDUX } from '../constant/menuConstant';

const activeItem = (payload) => {
  return {
    type: MENU_CONSTANT_REDUX.MENU_ACTIVATE_ITEM,
    payload,
  };
};

const activeComponent = (payload) => {
  return {
    type: MENU_CONSTANT_REDUX.MENU_ACTIVATE_COMPONENT,
    payload,
  };
};

const openDrawer = (payload) => {
  return {
    type: MENU_CONSTANT_REDUX.OPEN_DRAWER,
    payload,
  };
};

const openComponentDrawer = () => {
  return {
    type: MENU_CONSTANT_REDUX.OPEN_COMPONENT_DRAWER,
    payload,
  };
};

const menuAction = {
  activeItem,
  activeComponent,
  openDrawer,
  openComponentDrawer,
};

export default menuAction;
