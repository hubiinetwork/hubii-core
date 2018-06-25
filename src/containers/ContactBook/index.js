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

  onDelete(data) {
    const storage = JSON.parse(localStorage.getItem('contactBook'));
    if (storage) {
      const remainingList = storage.filter((contact) => contact.address !== data.address);
      if (remainingList.length === storage.length) {
        console.log('You did not delete anything');
      } else {
        localStorage.setItem('contactBook', JSON.stringify(remainingList));
      }
    }
    this.setState({ recentFilterText: 'hello' });
    return null;
  }

  filterSearchText(data, type) {
    if (this.state[type]) {
      return data.filter((contact) => contact.name.toLowerCase().includes(this.state[type].toLowerCase()) || contact.address.includes(this.state[type]));
    }
    return data;
  }

  render() {
    console.log('rerender');
    const storage = JSON.parse(localStorage.getItem('contactBook'));
    const titleTabs = [
      {
        title: 'All Contacts',
        TabContent:
  <div style={{ borderRight: 'solid 1px black', lineHeight: '100rem' }}>
    <ContactList
      data={this.filterSearchText(storage, 'fullFilterText')}
      onEdit={(values) => {
        console.log('Edited values are', values);
      }}
      onDelete={(values) => this.onDelete(values)}

    />
  </div>,
      },
      {
        title: 'Striim Contacts',
        TabContent: <div style={{ borderRight: 'solid 1px black', lineHeight: '100rem' }}>
          <ContactList
            data={this.filterSearchText(storage, 'fullFilterText')}
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
              onChange={((value) => this.setState({ recentFilterText: value }))}
            />
            <div style={{ borderRight: 'solid 1px black', lineHeight: '100rem' }}>
              <ContactList
                data={this.filterSearchText(storage, 'recentFilterText')}
                onEdit={(values) => {
                  console.log('Edited values are', values);
                }}
                onDelete={(values) => this.onDelete(values)}
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
