/**
 *
 * Asynchronously loads the component for LoadingIndicator
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
