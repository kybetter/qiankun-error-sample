import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start } from 'qiankun';

Vue.config.productionTip = false;


let app = null;

function render({ appContent, loading }) {
  if (!app) {
    app = new Vue({
      el: '#container',
      router,
      store,
      data() {
        return {
          content: appContent,
          loading,
        };
      },
      render(h) {
        return h(App, {
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

render({ loading: true });

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}


// const request = url =>
//   fetch(url, {
//     referrerPolicy: 'origin-when-cross-origin',
//   });

registerMicroApps(
  [
    { 
      name: 'Home', 
      entry: '//localhost:8081', 
      render, 
      activeRule: genActiveRule('/child') 
    },
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
  // {
  //   fetch: request,
  // },
);

setDefaultMountApp('/');
// runAfterFirstMounted(() => console.info('first app mounted'));

// start({ prefetch: true, fetch: request });
start();