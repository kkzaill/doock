<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
	</div>
</template>

<script>
import 'babel-polyfill'
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.fade-enter-active{
  transition: all .2s ease;
}
.fade-leave-active{
  transition: all 0 ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
