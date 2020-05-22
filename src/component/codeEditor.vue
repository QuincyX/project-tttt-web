<template lang="pug">
.monacoContainer
  .monacoEditor(ref="codeEditor")


</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import * as monaco from 'monaco-editor'

@Component({
  components: {}
})
export default class extends Vue {
  editorInstance: any = null
  mounted(): void {
    this.editorInstance = monaco.editor.create(
      <HTMLElement>this.$refs.codeEditor,
      {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
          '\n'
        ),
        theme: 'vs-dark',
        language: 'typescript'
      }
    )
  }
}
</script>

<style lang="less" scoped>
.monacoEditor {
  width: 800px;
  height: 300px;
}
</style>
