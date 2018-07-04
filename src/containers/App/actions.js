import { NOTIFY } from './constants';


export function notify(messageType, message) {
  return {
    type: NOTIFY,
    messageType,
    message,
  };
}
