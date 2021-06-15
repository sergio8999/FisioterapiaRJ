import Vue from 'vue'
import App from './App.vue'

import { firestorePlugin } from 'vuefire'
import router from './router'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

/* sweet alert 2 */
import VueSweetalert2 from 'vue-sweetalert2'; 

// If you don't need the styles, do not connect
 import 'sweetalert2/dist/sweetalert2.min.css'; 

 import PrimeVue from 'primevue/config';
 import Calendar from 'primevue/calendar';
 import 'primevue/resources/themes/saga-blue/theme.css'       //theme
 import 'primevue/resources/primevue.min.css'                //core css
 import 'primeicons/primeicons.css'                           //icons


/* fontawesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt,faShoppingCart, faLongArrowAltRight, faSort } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faTwitter,faGoogle } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTrashAlt,faShoppingCart, faFacebookF, faInstagram, faTwitter, faGoogle, faLongArrowAltRight, faSort)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

import Vuex from 'vuex'
import store from './store'


Vue.use(firestorePlugin).use(BootstrapVue).use(IconsPlugin).use(Vuex).use(VueSweetalert2).use(PrimeVue).component('Calendar', Calendar).use(require('vue-moment'))

import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet';

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-popup', LPopup);
Vue.component('l-tooltip', LTooltip);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
