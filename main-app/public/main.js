// import Vue from 'vue';
// import App from './App.vue';
// import store from './store';
// import router from './router';
// import singleSpaVue from 'single-spa-vue';
// import { registerApplication, start } from 'single-spa';
import * as SingleSpa from 'single-spa';
import systemjs from 'systemjs/dist/system';

// import axios from 'axios';

// function loadModule(module) {
//   return new Promise(resolve => {
//     axios.get(module).then(res => {
//       // console.log(res.data);
//       resolve(import(res.data));
//     })
//   }, reject => {

//   })
//   // return axios.get(module)
// }
// loadModule('http://localhost:8080/js/app.js')

// console.log(systemjs);

// Vue.config.productionTip = false;
// new Vue({
//   render: (h) => h(App),
//   router,
//   store,
//   el: '#app'
// });
// const vueLifecycles = singleSpaVue({
//   Vue,
//   appOptions: {
//     el: '#app',
//     render: (h) => h(App),
//     router,
//     store,
//   },
// });

// export const bootstrap = vueLifecycles.bootstrap;
// export const mount = vueLifecycles.mount;
// export const unmount = vueLifecycles.unmount;
console.log(SystemJS);
SingleSpa.registerApplication(
  'child', 
  // loadModule('http://localhost:8080/js/app.js?a=12312312'),
  // require('../../child-app/src/main'),
  () => SystemJS.import('child'),
  location => true
)

SingleSpa.start();


