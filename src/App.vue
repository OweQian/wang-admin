<template>
  <router-view></router-view>
</template>

<script>
  const ENV = import.meta.env
  export default {
    name: 'App',
    setup() {
      console.log('ENV', ENV)
    }
  }
</script>
