/*
 * LoadingError Messages
 *
 * This contains all the text for the LoadingError component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  unknownError: {
    id: 'app.containers.LoadingError.unknownError',
    defaultMessage: 'Error occured: {error}',
  },
  doesntExist: {
    id: 'app.containers.LoadingError.doesntExist',
    defaultMessage: '{type} {id} doesn\'t exist',
  },
});
