/**
 *
 * Asynchronously loads the component for DeleteContactModal
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
