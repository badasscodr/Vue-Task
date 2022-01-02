<template>
  <div class="items">
    <h1>This is an items page</h1>
  </div>
</template>

<script>
export default {
  name: 'Items',
  mounted() {
    //set current page
    this.$store.dispatch("page/setPage","items")
  }
}
</script>

<style scoped>

</style>