import * as React from 'react';
import ethers from 'ethers';
import Notification from '../../Notification';
import PasswordModal from './PasswordModal.component';
import { Modal } from '../../ui/Modal';
import { withWalletData } from '../../../redux/Wallet/withWallet';
import PropTypes from 'prop-types';

class PasswordModalContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      error: false,
      loading: false
    };
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = () => {
    this.setState(
      {
        visible: false
      },
      () => {
        this.setState({
          error: false,
          loading: false
        });
      }
    );
  };

  copy(wallet) {
    const ElementForCopy = document.createElement('input');
    document.body.appendChild(ElementForCopy);
    ElementForCopy.value = wallet;
    ElementForCopy.select();
    document.execCommand('copy', false);
    ElementForCopy.remove();
  }

  deleteWallet = values => {
    const { Wallet } = ethers;
    const wallet = this.props.wallets.find(item => {
      return item.credentials.address === this.props.address.substring(2);
    });
    const encryptedWallet = JSON.stringify(wallet.credentials);
    this.setState({ loading: true });
    Wallet.fromEncryptedWallet(encryptedWallet, values.WalletPassword)
      .then(resultedWallet => {
        switch (this.props.option) {
          case 'delete':
            this.props.deleteWallet(resultedWallet.address);
            const deleteMessage = 'Wallet deleted.';
            this.showNotification(true, deleteMessage);
            this.setState({ visible: false, loading: false, error: false });
            break;
          case 'private':
            const privateMessage = 'Private Key copied to clipboard.';
            this.showNotification(true, privateMessage);
            this.copy(resultedWallet.privateKey);
            this.setState({ visible: false, loading: false, error: false });
            break;
          case 'seed':
            const seedMessage = 'Mnemonic copied to clipboard.';
            this.showNotification(true, seedMessage);
            this.copy(resultedWallet.mnemonic);
            this.setState({ visible: false, loading: false, error: false });
            break;
        }
      })
      .catch(() => {
        this.setState({
          error: true,
          loading: false
        });
      });
  };

  render() {
    return (
      <div>
        <span onClick={this.showModal}>{this.props.title}</span>
        <Modal
          visible={this.state.visible}
          onCancel={this.handleCancel}
          maskClosable={false}
          maskStyle={{ background: 'rgba(232,237,239,.65)' }}
          style={{ marginTop: '20px' }}
          footer={null}
        >
          <PasswordModal
            {...this.props}
            error={this.state.error}
            loading={this.state.loading}
            handleSubmit={this.deleteWallet}
            handleCancel={this.handleCancel}
          />
        </Modal>
      </div>
    );
  }
  showNotification = (success, message) => {
    Notification(success, message);
  };
}
PasswordModalContainer.propTypes = {
  /**
   * wallets to  be passed.
   */
  wallets: PropTypes.node.isRequired,
  /**
   * error prop to check if the component is in error state.
   */
  error: PropTypes.bool.isRequired,
  /**
   * loading prop to check if the component is in loading state.
   */
  loading: PropTypes.bool.isRequired,
  /**
   * title of the item on which modal is opened when clicked.
   */
  title: PropTypes.string.isRequired,
  /**
   * address of the wallet to be deleted/exported.
   */
  address: PropTypes.string.isRequired,
  /**
   * description of the item on which modal is opened when clicked.
   */
  description: PropTypes.string.isRequired,
  /**
   * function to be called  when  cancel  is pressed.
   */
  handleCancel: PropTypes.func.isRequired,
  /**
   * function to be called  when  submit  is pressed.
   */
  handleSubmit: PropTypes.string.isRequired,
  /**
   * function to be called  when  wallet is deleted.
   */
  deleteWallet: PropTypes.func.isRequired,
  /**
   * options of  the task  to be done.
   */
  option: PropTypes.oneOf(['seed', 'private', 'delete']).isRequired
};
export default withWalletData(PasswordModalContainer);
