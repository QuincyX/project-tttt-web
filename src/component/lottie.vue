<template lang="pug">
div(:style="style" ref="svgContainer" data-animation-path="animation/" data-anim-loop="true" data-name="ninja")

</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import lottie from 'lottie-web'

@Component({
  components: {}
})
export default class extends Vue {
  @Prop({}) options: any
  @Prop(Number) height!: number
  @Prop(Number) width!: number
  @Prop(String) path!: string
  style = {
    width: this.width ? `${this.width}px` : '100%',
    height: this.height ? `${this.height}px` : '100%',
    overflow: 'hidden',
    margin: '0 auto'
  }
  anim: any
  @Watch('path')
  onPathChange(val: string) {
    this.loadAnimation(val)
  }
  loadAnimation(path: string) {
    if (this.anim) {
      lottie.destroy()
    }
    this.anim = lottie.loadAnimation({
      container: <Element>this.$refs.svgContainer,
      renderer: 'svg',
      loop: this.options.loop !== false,
      autoplay: this.options.autoplay !== false,
      path
    })
    this.$emit('animCreated', this.anim)
  }
  mounted(): void {
    this.loadAnimation(this.path)
  }
}
</script>

<style lang="less" scoped></style>
