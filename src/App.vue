<template>
  <div id="app" >
    <HandSonTable />
  </div>
</template>

<script>
import HandSonTable from './components/HandSonTable.vue'

export default {
  name: 'App',
  components: {
    HandSonTable,
  }
}
</script>

<style>
#app {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #1283da;
}
body{
  background: #1283da;
}
</style>
