<template lang="pug">
.page
  p this is a default page


</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: { }
})
export default class extends Vue {
  mounted(): void {}
}
</script>

<style lang="less" scoped>

</style>
