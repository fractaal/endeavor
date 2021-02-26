/**
 * This module controls the number of columns present in course views. 
 * 
 * Of course, it also relies on css that works. This only really manages setting / resetting / persistence of the setting. 
 */

import store from './store';

export function setToOneColumn() {
  store.settings.numColumnsInCourseView = 1;
}

export function setToTwoColumns() {
  store.settings.numColumnsInCourseView = 2;
}