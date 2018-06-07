/**
 * Checks type of ID
 * @param {*} id
 */

export function getStriimIdType(id) {
  if (id.length > 11) {
    return null;
  } else if (id[0] === '1') {
    return 'wallet';
  } else if (id[0] === '2') {
    return 'order';
  } else if (id[0] === '3') {
    return 'deal';
  } else if (id[0] === '4') {
    return 'deposit';
  } else if (id[0] === '5') {
    return 'withdrawal';
  } else if (id[0] === '6') {
    return 'settlement';
  }
  return null;
}
