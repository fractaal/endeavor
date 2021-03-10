import Vue from 'vue'
import App from './App.vue'
import router from './router'
import movable from 'v-movable';
import VueKeepScrollPosition from 'vue-keep-scroll-position';
import Toast from 'vue-toastification';
import "vue-toastification/dist/index.css";

import sharedStore from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import VueTimeago from 'vue-timeago';
import {faArrowLeft, faArrowRight, faWindowMinimize, faWindowRestore, faTimes, faSearch, faCheckCircle, faExclamationCircle, faPowerOff, faBroom, faTerminal, faBold, faItalic, faUnderline, faStrikethrough, faCode, faParagraph, faListOl, faListUl, faQuoteLeft, faRulerHorizontal, faUndo, faRedo, faStream, faGraduationCap, faCog, faScroll, faFlag, faBell, faPlus, faRedoAlt, faMinusCircle, faPlusCircle, faDotCircle, faMinus, faQuestionCircle, faBars, faBook, faClock, faComments, faFile, faPencilAlt, faChalkboard, faCheck} from '@fortawesome/free-solid-svg-icons';
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
  faPlus,
  faMinus,
  faQuestionCircle,
  faBars,
  faBook,
  faClock,
  faComments,
  faFile,
  faPencilAlt,
  faScroll,
  faChalkboard,
  faCheck,
  );
Vue.component('fai', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en',
});
Vue.use(VueKeepScrollPosition);
Vue.use(Toast, {
  timeout: 4000,
  transition: 'Vue-Toastification__fade',
  position: 'bottom-right'
});

Vue.config.errorHandler = function(err, vm, info) {
  console.error(`[${new Date()}] - VUE ERROR | ERROR: ${err} | INFO: ${info}`);
  sharedStore.debugLog.push(`[${new Date()}] - VUE ERROR | ERROR: ${err} | INFO: ${info}`);
}
/*
Vue.config.warnHandler = function(msg, vm, trace) {
  console.warn(`[${new Date()}] - VUE WARN | MSG: ${msg} | TRACE: ${trace}`)
  sharedStore.debugLog.push(`[${new Date()}] - VUE WARN | MSG: ${msg} | TRACE: ${trace}`);
}
window.onerror = function(msg, source, line, col, err) {
  console.error(`[${new Date()}] - MSG: ${msg} | SOURCE ${source} | LINE ${line} COLUMN ${col} | ERROR: ${err}`)
  sharedStore.debugLog.push(`[${new Date()}] - MSG: ${msg} | SOURCE ${source} | LINE ${line} COLUMN ${col} | ERROR: ${err}`);
}
*/

export const Bus = new Vue();

Vue.use(movable);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
