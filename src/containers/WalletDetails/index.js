import { Icon, Tabs } from 'antd';
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import WalletsOverview from 'containers/WalletsOverview';
import WalletHeader from 'components/WalletHeader';
import Tab from '../../components/ui/Tab';
import {
  Wrapper,
  TabsLayout,
  StyledButton,
  WalletsTabHeader
} from './index.style';

const TabPane = Tabs.TabPane;

export default class WalletDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onTabsChange = this.onTabsChange.bind(this)
    this.onHomeClick = this.onHomeClick.bind(this)
    this.state = {
      visible: false
    };
  }
  render() {
    const {history, match} = this.props
    return (
      <Wrapper>
        <TabsLayout>
          <WalletHeader
            iconType="home"
            name="Ledger Nano S"
            address={`${match.params.address}`}
            balance={12.34}
            onIconClick={this.onHomeClick}
          />
        </TabsLayout>
        <Tab activeKey={history.location.pathname} onChange={this.onTabsChange} animated={false}>
          <TabPane
            tab={
              <span>
                <Icon type="wallet" />Overview
              </span>
            }
            key={`${match.url}/overview`}
          >
            {/* <Route path={`${match.url}/overview`} component={WalletsOverview} /> */}
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="contacts" />Transfer
              </span>
            }
            key={`${match.url}/transfer`}
          >
          </TabPane>
        </Tab>
        {
          history.location.pathname === match.url &&
          <Redirect from={match.url} to={`${match.url}/overview`} push />
        }
      </Wrapper>
    );
  }
  onTabsChange (key) {
    this.props.history.push(key);
  };
  onHomeClick () {
    this.props.history.push('/wallets');
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
}
