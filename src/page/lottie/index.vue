<template lang="pug">
.page.cardList
  el-card
    el-input(v-model="url")
    .animList
      .item(v-for="(i,n) in animList" :key="n")
        el-button(type="primary" @click="handleChange(i)") {{i}}
  el-card
    lottie(:options="defaultOptions" :path="path" :height="400" :width="400" v-on:animCreated="handleAnimation")

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import lottie from '@/component/lottie.vue'

@Component({
  components: {
    lottie
  }
})
export default class extends Vue {
  animList = [
    'animation/lottie/navBar_discovery.json',
    'animation/lottie/navBar_movie.json'
  ]
  anim: any = null
  animationData = ''
  defaultOptions = {
    animationSpeed: 1,
    height: 400,
    width: 400
  }
  path: string = ''
  url: string = ''
  handleChange(path: string) {
    // @ts-ignore
    this.path = this.$options.filters.formatUiAssetUrl(path)
  }
  handleAnimation(anim: any) {
    this.anim = anim
  }
  stop() {
    this.anim.stop()
  }
  start() {
    this.anim.play()
  }
  pause() {
    this.anim.pause()
  }
  mounted(): void {}
}
</script>

<style lang="less" scoped>
.animList {
  .item {
    .padding;
  }
}
</style>
