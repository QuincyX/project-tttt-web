<template lang="pug">
.page
  p this is a 404 page


</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class extends Vue {
  mounted(): void {}
}
</script>

<style lang="less" scoped>
.page {
  .flexCenter;
  height: calc(100vh - 91px);
  color: @green;
  .size(30px);
  text-shadow: 0 0 10px @green;
}
</style>
