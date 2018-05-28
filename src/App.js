import React, { Component } from 'react';
import './App.css';
import Wrapper from './themes/Wrapper';
import { Switch, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import SideBar from './components/SideBar';
import Status from './components/Status';
import Dashboard from './pages/indexPage';
import Wallets from './pages/wallets';
const menuItems = [
  {
    to: '/wallets',
    icon: 'wallet',
    name: 'Wallet Manager'
  },
  {
    to: '/wallet',
    icon: 'wallet',
    name: 'Wallet detail'
  }
];
class App extends Component {
  render() {
    return (
      <Wrapper>
        <div>
          <SideBar menuItems={menuItems} logoSrc="Images/corerz-logo.svg">
            <Status statusValue="online" />
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/wallets" component={Wallets} />
            </Switch>
          </SideBar>
        </div>
      </Wrapper>
    );
  }
}

export default App;
