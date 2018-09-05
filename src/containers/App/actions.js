import { SUPPORTED_NETWORKS } from 'config/constants';
import {
  NOTIFY,
  CHANGE_NETWORK,
  LOAD_RELEASE_NOTES,
  LOAD_RELEASE_NOTES_SUCCESS,
  SHOW_RELEASE_NOTES,
  HIDE_RELEASE_NOTES,
  INSTALL_NEW_RELEASE,
} from './constants';


export function notify(messageType, message) {
  return {
    type: NOTIFY,
    messageType,
    message,
  };
}

export function loadReleaseNotes() {
  return {
    type: LOAD_RELEASE_NOTES,
  };
}

export function loadReleaseNotesSuccess(notes) {
  return {
    type: LOAD_RELEASE_NOTES_SUCCESS,
    notes,
  };
}

export function hideReleaseNotes() {
  return {
    type: HIDE_RELEASE_NOTES,
  };
}

export function showReleaseNotes() {
  return {
    type: SHOW_RELEASE_NOTES,
  };
}

export function installNewRelease() {
  return {
    type: INSTALL_NEW_RELEASE,
  };
}

export function changeNetwork(name) {
  return {
    type: CHANGE_NETWORK,
    network: SUPPORTED_NETWORKS[name],
  };
}
