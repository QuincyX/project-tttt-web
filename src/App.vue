<template lang="pug">
#app
  .bg
  .bg
  .bg
  router-view

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class AppHome extends Vue {
  mounted(): void {}
}
</script>

<style lang="less">
@import './style/reset.less';
@import './style/global.less';

#app {
  .bg {
    z-index: -1;
    position: absolute;
    width: 0.001vmin;
    height: 0.001vmin;
    border-radius: 50%;
    opacity: 0.45;
    filter: blur(10px);
    &:nth-child(1) {
      box-shadow: 0 0 45vmax 45vmax #ff00ff;
      animation: hue 5s 0s linear infinite, move1 10s 0s linear infinite;
    }
    &:nth-child(2) {
      box-shadow: 0 0 45vmax 45vmax hsla(0, 0%, 0%, 0.5);
      animation: hue 10s 0s linear infinite, move2 15s 0s linear infinite;
    }
    &:nth-child(3) {
      box-shadow: 0 0 45vmax 45vmax #00ffff;
      animation: hue 15s 0s linear infinite, move3 20s 0s linear infinite;
      opacity: 0.2;
    }
  }
}
@keyframes hue {
  100% {
    filter: hue-rotate(360deg);
  }
}
@keyframes move1 {
  0% {
    top: 0%;
    left: 50%;
  }
  25% {
    left: 0%;
  }
  50% {
    top: 100%;
  }
  75% {
    left: 100%;
  }
  100% {
    top: 0%;
    left: 50%;
  }
}
@keyframes move2 {
  0% {
    top: 50%;
    left: 100%;
  }
  25% {
    top: 100%;
  }
  50% {
    left: 0%;
  }
  75% {
    top: 0%;
  }
  100% {
    top: 50%;
    left: 100%;
  }
}
@keyframes move3 {
  0% {
    top: 100%;
    left: 50%;
  }
  25% {
    left: 100%;
  }
  50% {
    top: 0%;
  }
  75% {
    left: 0%;
  }
  100% {
    top: 100%;
    left: 50%;
  }
}
</style>
