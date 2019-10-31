<template>
  <div class="home">
    <!-- <img src="../assets/logo.png" alt=""> -->
    <h1 class="home-h1">我是主应用的首页路由页面</h1>
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
