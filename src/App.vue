<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">
        Home
      </router-link>
      |
      <router-link to="/about">
        About
      </router-link>
    </div>
    <router-view/>
    <div
      class="sw-update-dialog"
      v-show="showSwUpdate"
    >
      <button @click="handleRefresh">
        更新123
      </button>
    </div>
  </div>
</template>
<script>
let refreshing = false

export default {
  name: 'App',
  data () {
    return {
      showSwUpdate: false
    }
  },
  mounted () {
    window.addEventListener('sw.update', this.handleUpdate)
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('controllerchange', this.handleSWChange)
    }
  },
  beforeDestroy () {
    window.removeEventListener('sw.update', this.handleUpdate)
    if (navigator.serviceWorker) {
      navigator.serviceWorker.removeEventListener('controllerchange', this.handleSWChange)
    }
  },
  methods: {
    handleUpdate (event) {
      this.showSwUpdate = true
    },
    handleRefresh () {
      try {
        navigator.serviceWorker.getRegistration().then(reg => {
          reg.waiting.postMessage('skipWaiting')
        })
      } catch (e) {
        window.location.reload()
      }
    },
    handleSWChange () {
      if (refreshing) {
        return
      }
      refreshing = true
      window.location.reload()
    }
  }
}
</script>
<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  .sw-update-dialog {
    position: fixed;
    bottom: 50px;
    right: 50px;
    background-color: #fff;
    border: 1px solid #42b983;
  }

  .sw-update-dialog button {
    padding: 6px 10px;
    margin: 15px 30px;
    font-size: 16px;
  }
</style>
