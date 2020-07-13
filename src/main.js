import Vue from 'vue'
import Buefy from 'buefy';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faTimes, faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faUserSecret, faTimes, faChevronDown, faCheck);


import App from './App.vue'
import {
    Dropdown,
    Field,
    Input,
    Table,
    Button,
    Checkbox,
} from 'buefy';
import 'buefy/dist/buefy.css'
Vue.config.productionTip = false;
Vue.component('vue-fontawesome', FontAwesomeIcon);

Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
});

Vue.use(Dropdown);
Vue.use(Field);
Vue.use(Input);
Vue.use(Table);
Vue.use(Button);
Vue.use(Checkbox);

new Vue({
  render: h => h(App),
}).$mount('#app');
