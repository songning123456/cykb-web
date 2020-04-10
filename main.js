import Vue from 'vue';
import App from './App';
import store from './store/store';
import CustomImage from './components/CustomImage';
import BackTop from './components/BackTop';

Vue.component('custom-image', CustomImage);
Vue.component('back-top', BackTop);
Vue.prototype.$store = store;
Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
    ...App
});
app.$mount();
