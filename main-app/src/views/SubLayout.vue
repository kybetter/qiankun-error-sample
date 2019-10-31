<template>
  <div id="root">
    <a-layout id="components-layout-demo-top-side-2">
    <a-layout-header class="header">
      <div class="logo" />
      <a-menu
        theme="dark"
        mode="horizontal"
        :defaultSelectedKeys="['2']"
        :style="{ lineHeight: '64px' }"
        @click="goto"
      >
        <a-menu-item key="/">主应用首页</a-menu-item>
        <a-menu-item key="/main/about">主应用 about</a-menu-item>
        <a-menu-item key="/child">子应用首页</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          mode="inline"
          :defaultSelectedKeys="['1']"
          :defaultOpenKeys="['sub1']"
          :style="{ height: '100%', borderRight: 0 }"
          @click="goto"
        >
          <a-sub-menu key="sub1">
            <span slot="title"><a-icon type="user" />子应用菜单</span>
            <a-menu-item key="/child/about">about菜单</a-menu-item>
            <a-menu-item key="/child/other">other菜单</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
          <slot></slot>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> | 
      <router-link to="/child">Child</router-link>
    </div> -->
    
    <!-- <div v-if="loading">loading</div> -->
  </div>
</template>
<script>
export default {
  name: 'App',
  props: {
    loading: Boolean,
    content: String,
  },
  // inject: ['content', 'loading'],
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
