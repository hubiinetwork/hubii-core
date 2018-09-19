/*
 *
 * NahmiiAirdriipRegistration actions
 *
 */

import {
  CHANGE_STAGE,
} from './constants';

export function changeStage(stage) {
  return {
    type: CHANGE_STAGE,
    stage,
  };
}
