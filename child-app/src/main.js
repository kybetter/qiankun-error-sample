import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// new Vue({
//   render: (h) => h(App),
//   router,
//   store,
//   el: '#vueRoot'
// });

let instance = null;

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  console.log('props from main framework', props);
  instance = new Vue({
    el: '#vueRoot',
    render: h => h(App),
  });
}

export async function unmount() {
  instance.$destroy();
  instance = null;
}
