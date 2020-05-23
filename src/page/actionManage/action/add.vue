<template lang="pug">
.page
  el-card
    el-row(:gutter="20")
      el-col(:span="8")
        .columnContainer
          .header select project
          .list
            .item(v-for="(i,n) in projectList" :key="n" :class="{active:(currentProjectId===i._id)}" @click="handleChangeProject(i)") {{i.title}}
      el-col(:span="8")
        .columnContainer
          .header select group
          .list
            .item(v-for="(i,n) in groupList" :key="n" :class="{active:(currentGroupId===i._id)}" @click="handleChangeGroup(i)") {{i.name}}
      el-col(:span="8")
        .columnContainer
          .header select api
          .list
            .item(v-for="(i,n) in apiList" :key="n" :class="{active:(currentApiId===i._id)}" @click="handleChangeApi(i)") {{i.name}}

  el-card(v-if="apiDetail._id")
    div(slot="header")
      .cardHeader {{apiDetail._id}}
      el-button.headerRightButton(type="success") Submit
    el-form(label-width="8em" size="medium")
      el-form-item(label="name") {{apiDetail.name}}
      el-form-item(label="description" v-if="apiDetail.description") {{apiDetail.description}}
      el-form-item(label="url" inline) {{apiDetail.method}} http://{{baseUrl}}{{apiDetail.url}}
      el-form-item(label="query" v-if="apiDetail.query.length")
        paramItem(v-for="(i,n) in apiDetail.query" :key="n" :detail="i")
      el-form-item(label="body" v-if="apiDetail.body.length")
        paramItem(v-for="(i,n) in apiDetail.body" :key="n" :detail="i")
      el-form-item(label="path" v-if="apiDetail.path.length")
        paramItem(v-for="(i,n) in apiDetail.path" :key="n" :detail="i")
      el-form-item(label="header" v-if="apiDetail.header.length")
        paramItem(v-for="(i,n) in apiDetail.header" :key="n" :detail="i")

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import paramItem from '@/component/action/paramItem.vue'

@Component({
  components: { paramItem }
})
export default class extends Vue {
  projectList: any[] = []
  currentProjectId: string = ''
  groupList: any[] = []
  currentGroupId: string = ''
  apiList: any[] = []
  currentApiId: string = ''
  apiDetail: any = {
    _id: '',
    name: '',
    method: '',
    url: '',
    description: '',
    query: [],
    path: [],
    body: [],
    header: []
  }
  get baseUrl(): string {
    const currentProject = this.projectList.find(
      (o) => o._id === this.currentProjectId
    )
    return currentProject.host
  }
  handleChangeProject(item: any) {
    this.currentProjectId = item._id
    this.getGroupList()
  }
  handleChangeGroup(item: any) {
    this.currentGroupId = item._id
    this.getApiList()
  }
  handleChangeApi(item: any) {
    this.currentApiId = item._id
    this.apiDetail = { ...item }
  }
  async getProjectList() {
    this.projectList = await this.$http.get('/project?size=0')
    this.handleChangeProject(this.projectList[0])
  }
  async getGroupList() {
    this.groupList = await this.$http.get(
      `/apiGroup?size=0&project=${this.currentProjectId}`
    )
    this.handleChangeGroup(this.groupList[0])
  }
  async getApiList() {
    this.apiList = await this.$http.get(
      `/apiItem?size=0&apiGroup=${this.currentGroupId}`
    )
    this.handleChangeApi(this.apiList[0])
  }
  mounted(): void {
    this.getProjectList()
  }
}
</script>

<style lang="less" scoped>
.columnContainer {
  .border;
  .radius;
  .boxShadow;
  .header {
    .center;
    background: @border;
    color: @primary;
    padding: 10px;
  }
  .list {
    height: 300px;
    overflow-y: auto;
    .item {
      padding: 7px 10px;
      .borderBottom;
      .trans;
      .pointer;
      &.active {
        background: @green;
        color: @primary;
      }
      &:hover {
        background: @black;
        color: @green;
      }
      &:last-child {
        .borderNone;
      }
    }
  }
}
</style>
