import { createSelectorCreator, defaultMemoize } from 'reselect';
import _ from 'lodash';

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  _.isEqual
);
