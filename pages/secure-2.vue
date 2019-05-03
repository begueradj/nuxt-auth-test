<template>
  <div>
    <h1>Protected page 2</h1>
    
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
