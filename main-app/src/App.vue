<template>
  <div>
    <router-view v-if="!isSub" />
    <sub-layout v-else :loading="loading" :content="content">
      <div id="router-view" v-html="content"></div>
    </sub-layout>
  </div>
</template>
<script>
import SubLayout from './views/SubLayout.vue';

export default {
  name: 'App',
  components: {
    SubLayout
  },
  props: {
    loading: Boolean,
    content: String,
  },
  computed: {
    isSub() {
      return this.$route.path.match('child');
    }
  },
  methods: {
    goto(op) {
      // console.log(op);
      //location.href = href
      this.$router.push(op.key)
    }
  }
}
</script>
<style>
.logo {
    width: 120px;
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 28px 16px 0;
    float: left;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
#router-view {
  height: 100%;
}
</style>
