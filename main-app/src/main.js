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
// import axios from 'axios';

// import fetch from 'isomorphic-fetch';
// import Vue from 'vue';
import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start } from './dist/index.esm.js';
// const request = url =>
//   fetch(url, {
//     referrerPolicy: 'origin-when-cross-origin',
//   });

// async function r() {
//   const { template: appContent, execScripts } = await importEntry('//localhost:8089/sub.html', { 
//       fetch: request
//     });

//     // console.log(appContent);
//     console.log(execScripts);
//     const { bootstrap: bootstrapApp, mount, unmount } = await execScripts(false);
//     console.log(bootstrapApp);
//     console.log(mount);
//     console.log(unmount);
// }

// r();

// importHTML('//localhost:8089/sub.html').then(res => {
//   console.log(res);
//   console.log(res.getExternalScripts().then(res => {
//     console.log(res);
//   }));
// })

// new Vue({
//     render: (h) => h(App),
//   router,
//   store,
//   el: '#app'
// })


// import Framework from './Framework.vue';

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

// function loadModule(module) {
//   return new Promise(resolve => {
//     axios.get(module).then(res => {
//       // console.log(res.data);
//       console.log(res.data);
//       resolve(require(eval(res.data)));
//     })
//   }, reject => {

//   })
//   // return axios.get(module)
// }
// loadModule('http://localhost:8080/js/app.js')

// console.log(systemjs);

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
//     el: '#app',
//     render: (h) => h(App),
//     router,
//     store,
//   },
// });

// export const bootstrap = vueLifecycles.bootstrap;
// export const mount = vueLifecycles.mount;
// export const unmount = vueLifecycles.unmount;

// registerApplication(
//   'child', 
//   // loadModule('http://localhost:8080/js/app.js?a=12312312'),
//   require('../../child-app/src/main'),
//   // async () => {
//   //   const { template: appContent, execScripts } = await importEntry('//localhost:8089', { 
//   //     fetch: request
//   //   });

//   //   console.log(appContent);
//   //   console.log(execScripts);
//   // },
//   // () => systemjs.import('child'),
//   // () => systemjs.import('http://localhost:8089/sub.app.js'),
//   location => true
// )

// start();


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