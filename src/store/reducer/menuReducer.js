// types
import { createSlice } from '@reduxjs/toolkit';
import { MENU_CONSTANT_REDUX } from '../constant/menuConstant';

const initialState = {
  openItem: ['dashboard'],
  defaultId: 'dashboard',
  openComponent: 'buttons',
  drawerOpen: false,
  componentDrawerOpen: true,
};

const menuReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case MENU_CONSTANT_REDUX.MENU_ACTIVATE_ITEM:
      return {
        ...state,
        openItem: payload.openItem,
      };
    case MENU_CONSTANT_REDUX.MENU_ACTIVATE_COMPONENT:
      return {
        ...state,
        openComponent: payload.openComponent,
      };
    case MENU_CONSTANT_REDUX.OPEN_DRAWER:
      return {
        ...state,
        drawerOpen: payload.drawerOpen,
      };
    case MENU_CONSTANT_REDUX.OPEN_COMPONENT_DRAWER:
      return {
        ...state,
        componentDrawerOpen: payload.componentDrawerOpen,
      };
    default:
      return state;
  }
};

export default menuReducer;
