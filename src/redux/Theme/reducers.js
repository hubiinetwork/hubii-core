import initialState from "./initialState";
import { UPDATE_THEME } from "./constants";

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_THEME: {
      return { ...state, appTheme: action.appTheme };
    }
    default:
      return state;
  }
};
