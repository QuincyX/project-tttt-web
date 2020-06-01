<template lang="pug">
  .jwtwrap
    div.string.box
      el-input.str(type="textarea" v-model="str" @blur="handleToken")
    div.json.box
      el-input.str(type="textarea" v-model="json")
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
  display: flex;
  justify-content: center;
  .box {
    border-radius: 5px;
    box-shadow: 0 0 5px #666;
    background: rgba(68, 28, 73, 0.808);
    color: #fff;
  }
}
.string {
  width: 50%;
  height: 600px;
  overflow: auto;
  background: #fff;
  margin: 15px 10px;
}
.json {
  width: 40%;
  height: 600px;
  overflow: auto;
  background: #fff;
  margin: 15px 10px;
}
.str {
  width: 100%;
  height: 600px;
  display: flex;
  textarea {
    height: 600px;
    flex: 1;
  }
}
</style>
