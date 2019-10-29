<template>
  <div id="root">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> | 
      <router-link to="/child">Child</router-link>
    </div>
    <router-view/>
    <div v-if="loading">loading</div>
    <div id="router-view" v-html="content"></div>
  </div>
</template>
<script>
export default {
  name: 'App',
  props: {
    loading: Boolean,
    content: String,
  },
  methods: {
    goto(href) {
      //location.href = href
      this.$router.push(href)
    }
  }
}
</script>
<style>
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
