import Vue from 'vue';
// import App from './App.vue';
import Framework from './Framework.vue';
// import store from './store';
// import router from './router';
// import singleSpaVue from 'single-spa-vue';
// import { registerApplication, start } from 'single-spa';
// import systemjs from 'systemjs/dist/extras/amd';
// import importHTML,{ importEntry } from 'import-html-entry';
import fetch from 'isomorphic-fetch';

import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start } from './dist/index.esm.js';

let app = null;

function render({ appContent, loading }) {
  /*
  examples for vue
   */
  if (!app) {
    app = new Vue({
      el: '#container',
      data() {
        return {
          content: appContent,
          loading,
        };
      },
      render(h) {
        return h(Framework, {
          props: {
            content: this.content,
            loading: this.loading,
          },
        });
      },
    });
  } else {
    app.content = appContent;
    app.loading = loading;
  }
}

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

render({ loading: true });

Vue.config.productionTip = false;

const request = url =>
  fetch(url, {
    referrerPolicy: 'origin-when-cross-origin',
  });

registerMicroApps(
  [
    { name: 'child-app', entry: '//localhost:8080', render, activeRule: genActiveRule('/vue') },
  ],
  {
    beforeLoad: [
      app => {
        console.log('before load', app);
      },
    ],
    beforeMount: [
      app => {
        console.log('before mount', app);
      },
    ],
    afterUnmount: [
      app => {
        console.log('after unload', app);
      },
    ],
  },
  {
    fetch: request,
  },
);

setDefaultMountApp('/vue');
runAfterFirstMounted(() => console.info('first app mounted'));

start({ prefetch: true, fetch: request });