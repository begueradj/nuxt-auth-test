<template>
  <div>
    Protected page
   
    <br>
    {{ $auth.$storage.state.user }}
  </div>
</template>

<script>
export default {
  middleware: 'auth'
}
</script>

<style lang="scss" scoped>
</style>
