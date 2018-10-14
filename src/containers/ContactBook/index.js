/**
 *
 * ContactBook
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import ContactList from 'components/ContactList';
import ContactHeader from 'components/ContactHeader';
import { removeContact, editContact } from './actions';
import { makeSelectContacts, makeSelectRecentContacts } from './selectors';

import {
  Wrapper,
  AllContactsWrapper,
  RecentContactsWrapper,
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
    const { formatMessage } = this.props.intl;
    contacts = contacts.toJS();
    recentContacts = recentContacts.toJS();

    return (
      <Wrapper>
        <AllContactsWrapper contactsPresent={contacts.length}>
          <ContactHeader
            title={formatMessage({ id: 'all_contacts' })}
            showSearch={contacts.length !== 0}
            onChange={((value) => this.setState({ fullFilterText: value }))}
          />
          <ContactList
            data={this.filterSearchText(contacts, 'fullFilterText')}
            empty={contacts.length === 0}
            onEdit={(newContact, oldContact) => this.props.editContact(contacts, recentContacts, newContact, oldContact)}
            onDelete={(data) => this.props.removeContact(contacts, recentContacts, data)}
          />
        </AllContactsWrapper>
        <RecentContactsWrapper contactsPresent={contacts.length}>
          <ContactHeader
            title={formatMessage({ id: 'recent_contacts' })}
            showSearch={recentContacts.length !== 0}
            onChange={((value) => this.setState({ recentFilterText: value }))}
          />
          <ContactList
            data={this.filterSearchText(recentContacts, 'recentFilterText')}
            empty={recentContacts.length === 0}
            onEdit={(newContact, oldContact) => this.props.editContact(contacts, recentContacts, newContact, oldContact)}
            onDelete={(contact) => this.props.removeContact(contacts, recentContacts, contact)}
            message={formatMessage({ id: 'no_recent_contacts' })}
          />
        </RecentContactsWrapper>
      </Wrapper>
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
  intl: PropTypes.object.isRequired,
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
)(injectIntl(ContactBook));
