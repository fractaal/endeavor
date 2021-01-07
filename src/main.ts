import Vue from 'vue'
import App from './App.vue'
import router from './router'
import movable from "v-movable";

import sharedStore from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import {faArrowLeft, faArrowRight, faWindowMinimize, faWindowRestore, faTimes, faSearch, faCheckCircle, faExclamationCircle, faPowerOff, faBroom, faTerminal, faBold, faItalic, faUnderline, faStrikethrough, faCode, faParagraph, faListOl, faListUl, faQuoteLeft, faRulerHorizontal, faUndo, faRedo, faStream, faGraduationCap, faCog, faScroll, faFlag, faBell, faPlus, faRedoAlt, faMinusCircle, faPlusCircle, faDotCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
  faArrowLeft, 
  faArrowRight, 
  faWindowMinimize, 
  faWindowRestore, 
  faTimes, 
  faSearch, 
  faCheckCircle, 
  faExclamationCircle, 
  faPowerOff, 
  faBroom, 
  faTerminal, 
  faBold, 
  faItalic, 
  faUnderline, 
  faStrikethrough, 
  faCode, 
  faParagraph, 
  faListOl, 
  faListUl, 
  faQuoteLeft, 
  faRulerHorizontal, 
  faUndo, 
  faRedo, 
  faStream,
  faGraduationCap,
  faScroll,
  faCog,
  faSearch,
  faFlag,
  faBell,
  faPlusCircle,
  faDotCircle,
  faRedoAlt,
  faMinusCircle,
  );
Vue.component('fai', FontAwesomeIcon);
Vue.config.productionTip = false

Vue.config.errorHandler = function(err, vm, info) {
  sharedStore.debugLog.push(`[${Date.now()/1000}] - VUE ERROR | ERROR: ${err} | INFO: ${info}`);
}
Vue.config.warnHandler = function(msg, vm, trace) {
  sharedStore.debugLog.push(`[${Date.now()/1000}] - VUE WARN | MSG: ${msg} | TRACE: ${trace}`);
}
window.onerror = function(msg, source, line, col, err) {
  sharedStore.debugLog.push(`[${Date.now()/1000}] - MSG: ${msg} | SOURCE ${source} | LINE ${line} COLUMN ${col} | ERROR: ${err}`);
}

export const Bus = new Vue();


Vue.use(movable);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
