<template lang="pug">
.page
  el-card
    el-row(:gutter="20")
      el-col(:span="8")
        .columnContainer
          .header select project
          .list
            .item(v-for="(i,n) in projectList" :key="n") {{i.title}}
      el-col(:span="8")
        .columnContainer
          .header select group
          .list
            .item project name
            .item project name
            .item project name
      el-col(:span="8")
        .columnContainer
          .header select api
          .list
            .item project name
            .item project name
            .item project name

  el-card
    p this is a default page


</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class extends Vue {
  projectList: any[] = []
  groupList: any[] = []
  apiList: any[] = []
  async getProjectList() {
    this.projectList = await this.$http.get('/project?size=0')
  }
  async getGroupList() {
    this.groupList = await this.$http.get('/apiGroup?size=0')
  }
  async getApiList() {
    this.apiList = await this.$http.get('/apiItem')
  }
  mounted(): void {
    this.getProjectList()
  }
}
</script>

<style lang="less" scoped>
.columnContainer {
  .border();
  .header {
    .center;
    background: @border;
    color: @primary;
    padding: 10px;
  }
  .list {
    .item {
      padding: 7px 10px;
      .borderBottom;
      .trans;
      .pointer;
      &:hover {
        background: @green;
        color: @primary;
      }
      &:last-child {
        .borderNone;
      }
    }
  }
}
</style>
