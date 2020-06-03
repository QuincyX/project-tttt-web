<template lang="pug">
  .jwtwrap
    div.string.box
      textarea.str( v-model="str" placeholder="请输入你要解析的内容")
      div(style="display:flex; justify-content:flex-end;padding:10px;")
       el-button(type="success"  @click="handleToken") 生成json
    div.json.box
      textarea.str( v-model="json" placeholder="解析后的json" disabled)
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
const jwt = require('jsonwebtoken')

@Component({
  components: {},
})
export default class extends Vue {
  str: any = ''
  json: any = ''
  handleToken() {
    const a = jwt.decode(this.str)
    this.json = this.formatJson(JSON.stringify(a))
  }
  formatJson(json: any) {
    var outStr = '', //转换后的json字符串
      padIdx = 0, //换行后是否增减PADDING的标识
      space = '    ' //4个空格符
    if (typeof json !== 'string') {
      json = JSON.stringify(json)
    }
    json = json
      .replace(/([\{\}\[\]])/g, '\r\n$1\r\n')
      .replace(/(\,)/g, '$1\r\n')
      .replace(/(\r\n\r\n)/g, '\r\n')
    json.split('\r\n').forEach(function(node: any, index: any) {
      var indent = 0,
        padding = ''
      if (node.match(/[\{\[]/)) {
        indent = 1
      } else if (node.match(/[\}\]]/)) {
        padIdx = padIdx !== 0 ? --padIdx : padIdx
      } else {
        indent = 0
      }
      for (var i = 0; i < padIdx; i++) {
        padding += space
      }
      outStr += padding + node + '\r\n'
      padIdx += indent
    })
    return outStr
  }
  mounted(): void {}
}
</script>

<style lang="less" scoped>
.jwtwrap {
  height: calc(100vh - 92px);
  overflow: hidden;
  padding: 20px;
  min-width: 900px;
  max-width: 1100px;
  margin: auto;
}
.box {
  border-radius: 5px;
  box-shadow: inset 0 0 15px #c592ff;
  background: rgba(47, 3, 77, 0.6);
  overflow: auto;
  margin: 15px 10px;
  box-sizing: border-box;
  padding: 20px;
}
.string {
  float: left;
  width: 60%;
}
.json {
  float: right;
  width: 35%;
  min-width: 250px;
  .str {
    min-height: 350px;
  }
}
.str {
  min-height: 300px;
  width: 100%;
  resize: none;
  background: rgba(0, 0, 0, 0.5);
  outline: none;
  border: 1px solid #c592ff;
  border-radius: 8px;
  padding: 8px;
  color: #c592ff;
}
</style>
