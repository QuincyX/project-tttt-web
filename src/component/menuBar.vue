<template lang="pug">
el-menu.menuContainer(mode="horizontal" router background-color="#100d23" text-color="#c592ff" active-text-color="#ff4081")
  el-menu-item.menuLeft(index="/")
    .leftContainer TTT 测试平台
  el-submenu(index="1")
    template(slot="title") API信息
    el-menu-item(index="/apiManage/project") 项目管理
    el-menu-item(index="/apiManage/group") API分组
    el-menu-item(index="/apiManage/model") 数据模型
    el-menu-item(index="/apiManage/api") API列表
  el-submenu(index="2")
    template(slot="title") 测试用例
    el-menu-item(index="/actionManage/action") 动作管理
    el-menu-item(index="/actionManage/action/add") 添加动作
    el-menu-item(index="/actionManage/case") 用例管理
    el-menu-item(index="/actionManage/story") 故事管理
  el-menu-item(index="/mock") 数据管理
  el-menu-item(index="/rule") 验证规则管理
  el-menu-item(index="/job") 任务列表
  el-menu-item(index="/log") 日志列表
  el-menu-item(index="/trigger") 触发规则
  el-menu-item(index="/config") 系统配置

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {}
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
