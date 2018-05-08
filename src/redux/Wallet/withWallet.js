import { connect } from 'react-redux';
import { addWallet, deleteWallet } from './actions';

const mapWalletDataStateToProps = ({ wallets }) => ({
  wallets: wallets.data
});
const mapStateToProps = ({ wallets }) => ({
  wallets
});
const mapdispatchTOProps = dispatch => ({
  addWallet: wallet => dispatch(addWallet(wallet)),
  deleteWallet: address => dispatch(deleteWallet(address))
});
const mapWalletStatusStateToProps = ({ wallets }) => ({
  loading: wallets.loading,
  error: wallets.error
});

export const withWalletData = Component =>
  connect(mapWalletDataStateToProps, mapdispatchTOProps)(Component);
export const withWalletStatus = Component =>
  connect(mapWalletStatusStateToProps, mapdispatchTOProps)(Component);
export const withWallet = Component =>
  connect(mapStateToProps, mapdispatchTOProps)(Component);
