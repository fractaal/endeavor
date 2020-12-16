import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core';
import {faArrowLeft, faArrowRight, faWindowMinimize, faWindowRestore, faTimes, faSearch, faCheckCircle, faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faArrowLeft, faArrowRight, faWindowMinimize, faWindowRestore, faTimes, faSearch, faCheckCircle, faExclamationCircle);
Vue.component('fai', FontAwesomeIcon);

Vue.config.productionTip = false

export const Bus = new Vue();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
