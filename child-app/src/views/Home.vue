<template>
  <div class="home">
    <img src="../assets/logo.png" alt="">
    <h1 class="home-h1">我是子应用的首页路由页面</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>

<style scoped>
.home-h1 {
  background: url(../assets/logo.png)
}
</style>