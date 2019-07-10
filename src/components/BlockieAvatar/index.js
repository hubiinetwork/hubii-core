import makeBlockie from 'ethereum-blockies-base64';

import React from 'react';
import PropTypes from 'prop-types';

function BlockieAvatar(props) {
  return (
    <img {...props} src={makeBlockie(props.address)} alt="" />
  );
}

BlockieAvatar.propTypes = {
  address: PropTypes.string.isRequired,
};

export default BlockieAvatar;
