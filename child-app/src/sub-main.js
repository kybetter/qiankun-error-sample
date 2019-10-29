import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import singleSpaVue from 'single-spa-vue';

Vue.config.productionTip = false;

// new Vue({
//   render: (h) => h(App),
//   router,
//   store,
//   el: '#app'
// });

// const vueLifecycles = singleSpaVue({
//   Vue,
//   appOptions: {
//     render: (h) => h(App),
//     router,
//     store,
//   },
// });

// export const bootstrap = vueLifecycles.bootstrap;
// export const mount = vueLifecycles.mount;
// export const unmount = vueLifecycles.unmount;

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
