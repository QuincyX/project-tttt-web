<template lang="pug">
div
  menu-bar
  router-view
  .copyRight BY's TTT ©2020

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import menuBar from '@/component/menuBar.vue'

@Component({
  components: { menuBar }
})
export default class extends Vue {
  mounted(): void {}
}
</script>

<style lang="less" scoped>
.copyRight {
  .center;
  .hh(30px);
  color: @green;
}
</style>
