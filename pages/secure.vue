<template>
  <div>
    Protected page
   
    <br>
    {{ $auth.user }}
  </div>
</template>

<script>
export default {
  middleware: 'auth'
}
</script>

<style lang="scss" scoped>
</style>
