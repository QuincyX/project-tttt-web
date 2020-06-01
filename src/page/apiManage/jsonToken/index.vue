<template lang="pug">
  .jwtwrap
    div.string.box
      el-input.str(type="textarea" v-model="str")
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
    const secret = 'token test' // 指定生成token密钥的字符串
    const token = jwt.sign({ name: 'stone', age: 18 }, secret, {
      expiresIn: 15,
    }) // 传入元数据和密钥 并指定过期时间  单独数字是秒， 1h：一个小时  1d：一天
    console.log(`token is ${token}`)
    setTimeout(() => {
      jwt.verify(token, secret, (err: any, decoded: any) => {
        // 校验
        if (err) {
          console.log('token 已经失效')
        } else {
          console.log(`token data ${JSON.stringify(decoded)}`)
        }
      })
    }, 6000)
  }
  mounted(): void {
    this.handleToken()
  }
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
