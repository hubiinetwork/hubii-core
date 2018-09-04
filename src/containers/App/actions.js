import {
  NOTIFY,
  LOAD_RELEASE_NOTES,
  LOAD_RELEASE_NOTES_SUCCESS,
  SHOW_RELEASE_NOTES,
  HIDE_RELEASE_NOTES,
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
