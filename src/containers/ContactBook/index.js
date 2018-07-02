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

import ContactList from 'components/ContactList';
import ContactHeader from 'components/ContactHeader';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import saga from './saga';
import { loadAllContacts, removeContact, editContact } from './actions';
import { makeSelectContacts } from './selectors';
import reducer from './reducer';

import {
  Wrapper,
} from './index.style';

export class ContactBook extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      recentFilterText: null,
      fullFilterText: null,
      newContactName: null,
      newContactAddress: null,
    };

    this.filterSearchText = this.filterSearchText.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this.props.loadAllContacts();
  }

  onDelete(data) {
    this.props.removeContact(data.name, data.address);
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
    return (
      <div>
        <Helmet>
          <title>ContactBook</title>
          <meta name="description" content="Description of ContactBook" />
        </Helmet>

        <Wrapper>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ color: 'white', minWidth: '30rem' }}>
              <ContactHeader
                title={'Recent Contacts'}
                showSearch
                onChange={((value) => this.setState({ recentFilterText: value }))}
              />
              <div style={{ borderRight: 'solid 1px #43616F ', marginTop: contacts.length ? '1rem' : '2rem' }}>
                <ContactList
                  data={this.filterSearchText(contacts || [], 'recentFilterText')}
                  onEdit={(newContact, oldContact) => this.props.editContact(newContact, oldContact)}
                  onDelete={(contact) => this.props.removeContact(contact)}
                />

              </div>
            </div>

            <div style={{ color: 'white', minWidth: '30rem', marginLeft: '1rem' }}>
              <ContactHeader
                title={'All Contacts'}
                showSearch
                onChange={((value) => this.setState({ fullFilterText: value }))}
              />
              <div style={{ borderRight: 'solid 1px #43616F ', marginTop: contacts.length ? '1rem' : '2rem' }}>
                <ContactList
                  data={this.filterSearchText(contacts || [], 'fullFilterText')}
                  onEdit={(newContact, oldContact) => this.props.editContact(newContact, oldContact)}
                  onDelete={(data) => this.props.removeContact(data)}
                />

              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    );
  }
}

ContactBook.propTypes = {
  contacts: PropTypes.array,
  loadAllContacts: PropTypes.func,
  removeContact: PropTypes.func,
  editContact: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  contacts: makeSelectContacts(),
});

export function mapDispatchToProps(dispatch) {
  return {
    loadAllContacts: (...args) => dispatch(loadAllContacts(...args)),
    removeContact: (...args) => dispatch(removeContact(...args)),
    editContact: (...args) => dispatch(editContact(...args)),
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
