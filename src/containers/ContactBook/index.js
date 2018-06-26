/**
 *
 * ContactBook
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import StriimTabs, { TabPane } from 'components/ui/StriimTabs';

import ContactList from 'components/ContactList';
import ContactHeader from 'components/ContactHeader';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import saga from './saga';
import { loadAllContacts, removeContact } from './actions';
import { makeSelectContacts } from './selectors';
import reducer from './reducer';

export class ContactBook extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      recentFilterText: null,
      fullFilterText: null,
    };

    this.filterSearchText = this.filterSearchText.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this.props.loadAllContacts();
  }

  onDelete(data) {
    this.props.removeContact(data.name, data.address, 'Striim');
  }

  filterSearchText(data, type) {
    if (this.state[type]) {
      return data.filter((contact) => contact.name.toLowerCase().includes(this.state[type].toLowerCase()) || contact.address.includes(this.state[type]));
    }
    return data;
  }

  render() {
    let { contacts } = this.props;
    contacts = contacts.toJS();
    const titleTabs = [
      {
        title: 'All Contacts',
        TabContent:
  <div style={{ borderRight: 'solid 1px black', lineHeight: '100rem' }}>
    <ContactList
      data={this.filterSearchText(contacts || [], 'fullFilterText')}
      onEdit={(values) => {
        console.log('Edited values are', values);
      }}
      onDelete={(data) => this.props.removeContact(data)}
    />
  </div>,
      },
      {
        title: 'Striim Contacts',
        TabContent: <div style={{ borderRight: 'solid 1px black', lineHeight: '100rem' }}>
          <ContactList
            data={this.filterSearchText(contacts, 'fullFilterText')}
            onEdit={(values) => {
              console.log('Edited values are', values);
            }}
            onDelete={(data) => this.props.removeContact(data)}
          />
        </div>,
      },
    ];
    return (
      <div>
        <Helmet>
          <title>ContactBook</title>
          <meta name="description" content="Description of ContactBook" />
        </Helmet>


        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ color: 'white', fontSize: '1.3rem' }}>
            <ContactHeader
              title={'Recent Contacts'}
              showSearch
              onChange={((value) => this.setState({ recentFilterText: value }))}
            />
            <div style={{ borderRight: 'solid 1px black', lineHeight: '100rem' }}>
              <ContactList
                data={this.filterSearchText(contacts || [], 'recentFilterText')}
                onEdit={(values) => {
                  console.log('Edited values are', values);
                }}
                onDelete={(data) => this.props.removeContact(data)}
              />

            </div>
          </div>
          <div style={{ color: 'white' }}>
            <ContactHeader
              titleTabs={titleTabs}
              showSearch
              onTabChange={() => {
                console.log('Tab changed');
              }}
              // onSearch={(value) => console.log(value)}
              onChange={((value) => this.setState({ fullFilterText: value }))}
            />
          </div>
          <StriimTabs onChange={this.onTabChange}>
            <TabPane tab="Payments" style={{ color: 'white' }}>
              Content of Tab Pane 1
              {/* <Route path={match.url} component={PageLoadingIndicator} /> */}
            </TabPane>
            <TabPane tab="Topup" style={{ color: 'white' }}>
              Content of Tab Pane 2
            </TabPane>

          </StriimTabs>
        </div>
      </div>
    );
  }
}

ContactBook.propTypes = {
  contacts: PropTypes.array,
  loadAllContacts: PropTypes.func,
  removeContact: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  contacts: makeSelectContacts(),
});

export function mapDispatchToProps(dispatch) {
  return {
    loadAllContacts: (...args) => dispatch(loadAllContacts(...args)),
    removeContact: (...args) => dispatch(removeContact(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'contacts', reducer });
const withSaga = injectSaga({ key: 'contacts', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ContactBook);
