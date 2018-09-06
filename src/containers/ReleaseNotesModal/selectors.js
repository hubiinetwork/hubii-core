import { createSelector } from 'reselect';

const selectReleaseNotesDomain = (state) => state.get('releaseNotes');

const makeSelectReleaseNotes = () => createSelector(
  selectReleaseNotesDomain,
  (releaseNotes) => releaseNotes.toJS()
);

export {
  makeSelectReleaseNotes,
};
