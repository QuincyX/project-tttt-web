<template lang="pug">
el-menu.menuContainer(mode="horizontal" router background-color="#100d23" text-color="#c592ff" active-text-color="#ff4081")
  el-menu-item.menuLeft(index="/")
    .leftContainer TTT 测试平台
  el-submenu(index="1")
    template(slot="title") 接口管理
    el-menu-item(index="/apiManage/project") 项目
    el-menu-item(index="/apiManage/group") 分组
    el-menu-item(index="/apiManage/model") 数据模型
    el-menu-item(index="/apiManage/api") 接口
  el-submenu(index="2")
    template(slot="title") 测试用例
    el-menu-item(index="/actionManage/action/add") 添加动作
    el-menu-item(index="/actionManage/action") 动作管理
    el-menu-item(index="/actionManage/case") 用例
    el-menu-item(index="/actionManage/story") 故事
  el-submenu(index="3")
    template(slot="title") 系统管理
    el-menu-item(index="/mock") Mock数据
    el-menu-item(index="/rule") 验证规则
    el-menu-item(index="/job") 任务
    el-menu-item(index="/log") 日志
    el-menu-item(index="/trigger") 触发器
    el-menu-item(index="/config") 系统配置
  el-submenu(index="4")
    template(slot="title") 工具包
    el-menu-item(index="/apiManage/apiTest") API测试
    el-menu-item(index="/apiManage/jsonToken") JWT调试

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class extends Vue {
  mounted(): void {}
}
</script>

<style lang="less" scoped>
.menuContainer {
  .borderBottom;
}
.menuLeft {
  padding: 0;
}
.leftContainer {
  .vTop;
  .flexCenter;
  .size(@xxl);
  .bold;
  width: 200px;
  height: 60px;
  background: @primary;
}
</style>
