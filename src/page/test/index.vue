<template lang="pug">
.page
  p this is a test page
  codeEditor


</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import codeEditor from '@/component/codeEditor.vue'

@Component({
  components: { codeEditor }
})
export default class extends Vue {
  mounted(): void {}
}
</script>

<style lang="less" scoped></style>
