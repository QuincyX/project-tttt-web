<template lang="pug">
el-tooltip.paramItemContainer(placement="top")
  el-button(:type="detail.required?'danger':'info'" @click="$emit('click',detail)") {{detail.name}}
  div(slot="content")
    div(v-if="detail.type") 类型: {{detail.type}}
    div(v-if="detail.description") 描述: {{detail.description}}
    div(v-if="detail.default") 默认: {{detail.default}}
    div(v-if="detail.mock") Mock: {{detail.mock}}

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class extends Vue {
  @Prop({}) detail: any
  mounted(): void {}
}
</script>

<style lang="less" scoped></style>
