import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
  store,
  el: '#app'
});

let instance = null;

export async function bootstrap() {
  console.log('vue app bootstraped');
}

export async function mount(props) {
  console.log('props from main framework', props);
  // console.log(router);

  instance = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
  });
}

export async function unmount() {
  console.log('unmount执行了');
  instance.$destroy();
  instance = null;
}
