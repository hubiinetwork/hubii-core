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
import { removeContact, editContact } from './actions';
import { makeSelectContacts, makeSelectRecentContacts } from './selectors';

import {
  Wrapper,
  Border,
  InnerWrapper1,
  InnerWrapper2,
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
  }

  filterSearchText(data, type) {
    if (this.state[type]) {
      return data.filter((contact) =>
                contact.name.toLowerCase().includes(this.state[type].toLowerCase())
                || contact.address.includes(this.state[type]));
    }
    return data;
  }

  render() {
    let { contacts, recentContacts } = this.props;
    contacts = contacts.toJS();
    recentContacts = recentContacts.toJS();

    return (
      <div>
        <Helmet>
          <title>ContactBook</title>
          <meta name="description" content="Description of ContactBook" />
        </Helmet>

        <Wrapper>
          <InnerWrapper1 contactsPresent={contacts.length}>
            <ContactHeader
              title={'Recently Used Contacts'}
              showSearch
              onChange={((value) => this.setState({ recentFilterText: value }))}
            />
            <Border contactsLength={recentContacts.length}>
              <ContactList
                data={this.filterSearchText(recentContacts, 'recentFilterText')}
                onEdit={(newContact, oldContact) => this.props.editContact(contacts, recentContacts, newContact, oldContact)}
                onDelete={(contact) => this.props.removeContact(contacts, recentContacts, contact)}
                message={'You have no recently used contacts.'}
              />
            </Border>
          </InnerWrapper1>
          <InnerWrapper2 contactsPresent={contacts.length}>
            <ContactHeader
              title={'All Contacts'}
              showSearch
              onChange={((value) => this.setState({ fullFilterText: value }))}
            />
            <Border contactsLength={contacts.length}>
              <ContactList
                data={this.filterSearchText(contacts, 'fullFilterText')}
                onEdit={(newContact, oldContact) => this.props.editContact(contacts, recentContacts, newContact, oldContact)}
                onDelete={(data) => this.props.removeContact(contacts, recentContacts, data)}
              />
            </Border>
          </InnerWrapper2>
        </Wrapper>
      </div>
    );
  }
}

ContactBook.propTypes = {
  contacts: PropTypes.oneOfType(
    [PropTypes.arrayOf(PropTypes.object), PropTypes.object]
  ),
  removeContact: PropTypes.func,
  recentContacts: PropTypes.oneOfType(
    [PropTypes.arrayOf(PropTypes.object), PropTypes.object]
  ),
  editContact: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  contacts: makeSelectContacts(),
  recentContacts: makeSelectRecentContacts(),

});

export function mapDispatchToProps(dispatch) {
  return {
    removeContact: (...args) => dispatch(removeContact(...args)),
    editContact: (...args) => dispatch(editContact(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);


export default compose(
  withConnect,
)(ContactBook);
