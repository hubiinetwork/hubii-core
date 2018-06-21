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

import ContactList from 'components/ContactList';
import ContactHeader from 'components/ContactHeader';
import injectSaga from 'utils/injectSaga';
import saga from './saga';

// testing purposes only
import TestItems from './TestItems';

export class ContactBook extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const titleTabs = [
      {
        title: 'All Contacts',
        TabContent:
  <div style={{ borderRight: 'solid 1px black', lineHeight: '100rem' }}>
    <ContactList
      data={TestItems.large}
      onEdit={(values) => {
        console.log('Edited values are', values);
      }}
      onDelete={(values) => {
        console.log('Deleted values are', values);
      }}
    />
  </div>,
      },
      {
        title: 'Striim Contacts',
        TabContent: <div style={{ borderRight: 'solid 1px black', lineHeight: '100rem' }}>
          <ContactList
            data={TestItems.large}
            onEdit={(values) => {
              console.log('Edited values are', values);
            }}
            onDelete={(values) => {
              console.log('Deleted values are', values);
            }}
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
              onSearch={(value) => console.log(value)}
            />
            <div style={{ borderRight: 'solid 1px black', lineHeight: '100rem' }}>
              <ContactList
                data={TestItems.medium}
                onEdit={(values) => {
                  console.log('Edited values are', values);
                }}
                onDelete={(values) => {
                  console.log('Deleted values are', values);
                }}
              />

            </div>
          </div>
          <div style={{ color: 'white' }}>
            <ContactHeader
              titleTabs={titleTabs}
              // showSearch
              onTabChange={() => {
                console.log('Tab changed');
              }}
              onSearch={(value) => console.log(value)}
            />
          </div>
        </div>
      </div>
    );
  }
}

ContactBook.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);
const withSaga = injectSaga({ key: 'contactBook', saga });

export default compose(
  withSaga,
  withConnect,
)(ContactBook);
