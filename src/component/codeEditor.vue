<template lang="pug">
.monacoContainer
  .monacoEditor(ref="codeEditor")

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import * as monaco from 'monaco-editor'

@Component({})
export default class extends Vue {
  editorInstance: any = null
  @Prop() value!: string
  mounted(): void {
    // @ts-ignore
    this.editorInstance = monaco.editor.create(this.$refs.codeEditor, {
      value: this.value || `{\n}`,
      theme: 'vs-dark',
      language: 'json'
    })
    this.editorInstance.onDidChangeModelContent((event: any) => {
      const newValue = this.editorInstance.getValue()
      this.$emit('input', newValue)
    })
  }
  beforeDestroy() {
    this.editorInstance?.dispose()
  }
}
</script>

<style lang="less" scoped>
.monacoEditor {
  width: 500px;
  min-height: 200px;
}
</style>
