<template lang="pug">
el-menu.menuContainer(mode="horizontal" router background-color="#100d23" text-color="#c592ff" active-text-color="#ff4081")
  el-menu-item.menuLeft(index="/")
    .leftContainer Project TTT
  el-submenu(index="1")
    template(slot="title") API Manage
    el-menu-item(index="/apiManage/project") API Project
    el-menu-item(index="/apiManage/api") API Item
    el-menu-item(index="/apiManage/group") API Group
    el-menu-item(index="/apiManage/model") API Model
  el-submenu(index="2")
    template(slot="title") Action Manage
    el-menu-item(index="/actionManage/action") Action
    el-menu-item(index="/actionManage/case") Case
    el-menu-item(index="/actionManage/story") Story
  el-menu-item(index="/mock") Mock Manage
  el-menu-item(index="/rule") Rule Manage
  el-menu-item(index="/job") Job Manage
  el-menu-item(index="/log") Log Manage

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
