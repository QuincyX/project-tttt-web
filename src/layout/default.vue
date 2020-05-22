<template lang="pug">
div
  menu-bar
  router-view

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import menuBar from '@/component/menuBar.vue'

@Component({
  components: {menuBar},
})
export default class extends Vue {
  mounted(): void {}
}
</script>