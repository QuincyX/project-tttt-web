<template lang="pug">
#app
  router-view

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class AppHome extends Vue {
  mounted(): void {}
}
</script>

<style lang="less" scoped>
@import './style/reset.less';
@import './style/global.less';
</style>
