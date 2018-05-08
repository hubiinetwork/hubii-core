import { combineReducers } from "redux";
import theme from "./Theme/reducers";
import wallets from "./Wallet/reducers";

export default combineReducers({
  theme,
  wallets
});
