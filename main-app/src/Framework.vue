<template>
  <section>
    <header class="header">
      <nav>
        <ol>
          <li><a @click="goto('react app', '/react')">react16 + antd3</a></li>
          <li><a @click="goto('react15 app', '/15react15')">react15 + antd2</a></li>
          <li><a @click="goto('vue app', '/vue')">vue2 + element2</a></li>
        </ol>
      </nav>
    </header>
    <div v-if="loading">loading</div>
    <div class="appContainer" v-html="content">content</div>
  </section>
</template>

<script>
	export default {
		name: 'framework',
		props: {
			loading: Boolean,
			content: String,
		},
		methods: {
			goto(title, href) {
				window.history.pushState({}, title, href);
			},
		},
	};
</script>

<style scoped>
  .appContainer {
    margin-top: 50px;
  }
</style>
