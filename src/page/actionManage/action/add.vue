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

  el-card(v-if="actionDetail.api")
    div(slot="header")
      .cardHeader API: {{actionDetail.api}}
      el-button.headerRightButton(type="success" @click="handleSubmitAddAction") Submit
    el-form(label-width="8em" size="medium")
      el-form-item(label="请求地址") {{apiDetail.method.toUpperCase()}} http://{{baseUrl}}{{apiDetail.url}}
      el-form-item(label="名称")
        el-input(v-model="actionDetail.name")
      el-form-item(label="描述")
        el-input(v-model="actionDetail.description")
      el-form-item(label="验证规则")
        el-button(v-for="(i,n) in actionDetail.rule" :key="n" type="success" @click="handleDeleteRule(n)") {{i.name}}
        el-button(type="success" icon="el-icon-plus" @click="handleAddRule")
      el-form-item(label="输出规则")
        el-button(v-for="(i,n) in actionDetail.output" :key="n" type="success" @click="handleDeleteOutput(n)") {{i.name}}
        el-button(type="success" icon="el-icon-plus" @click="handleAddOutput")
      el-form-item(label="Query" v-if="apiDetail.query.length || actionDetail.query.length")
        .paramListContainer
          .paramList.picked
            .paramListHeader 已添加
            .list
              paramItem(v-for="(i,n) in actionDetail.query" :key="n" :detail="i")
          .paramList.waiting(v-if="apiDetail.query.length")
            .paramListHeader 待添加字段
            .list
              paramItem(v-for="(i,n) in apiDetail.query" :key="n" :detail="i" @click="handleAddMock(i,'query')")
      el-form-item(label="Body" v-if="apiDetail.body.length || actionDetail.body.length")
        .paramListContainer
          .paramList.picked
            .paramListHeader 已添加
            .list
              paramItem(v-for="(i,n) in actionDetail.body" :key="n" :detail="i")
          .paramList.waiting(v-if="apiDetail.body.length")
            .paramListHeader 待添加字段
            .list
              paramItem(v-for="(i,n) in apiDetail.body" :key="n" :detail="i" @click="handleAddMock(i,'body')")
      el-form-item(label="Path" v-if="apiDetail.path.length || actionDetail.path.length")
        .paramListContainer
          .paramList.picked
            .paramListHeader 已添加
            .list
              paramItem(v-for="(i,n) in actionDetail.path" :key="n" :detail="i")
          .paramList.waiting(v-if="apiDetail.path.length")
            .paramListHeader 待添加字段
            .list
              paramItem(v-for="(i,n) in apiDetail.path" :key="n" :detail="i" @click="handleAddMock(i,'path')")
      el-form-item(label="Header" v-if="apiDetail.header.length || actionDetail.header.length")
        .paramListContainer
          .paramList.picked
            .paramListHeader 已添加
            .list
              paramItem(v-for="(i,n) in actionDetail.header" :key="n" :detail="i")
          .paramList.waiting(v-if="apiDetail.header.length")
            .paramListHeader 待添加字段
            .list
              paramItem(v-for="(i,n) in apiDetail.header" :key="n" :detail="i" @click="handleAddMock(i,'header')")

  el-dialog(title="添加验证规则" :visible.sync="isShowAddRuleDialog")
    el-form(label-width="8em")
      el-form-item(label="字段名")
        el-input(v-model="addRuleData.name")
      el-form-item(label="输出规则")
        el-select(v-model="addRuleData.rule")
          el-option(v-for="(i,n) in ruleList" :key="n" :label="`【${i.name}】${i.description}`" :value="i._id")
    div(slot="footer")
      el-button(type="default" @click="isShowAddRuleDialog=false") 取消
      el-button(type="primary" @click="handleSubmitAddRule") 确定

  el-dialog(title="添加输出规则" :visible.sync="isShowAddOutputDialog")
    el-form(label-width="8em")
      el-form-item(label="字段名")
        el-input(v-model="addOutputData.name")
      el-form-item(label="输出规则")
        el-input(v-model="addOutputData.source")
      el-form-item(label="输出目标")
        el-input(v-model="addOutputData.targetType")
      el-form-item(label="目标ID")
        el-input(v-model="addOutputData.target")
    div(slot="footer")
      el-button(type="default" @click="isShowAddOutputDialog=false") 取消
      el-button(type="primary" @click="handleSubmitAddOutput") 确定

  el-drawer(title="选择数据定义" :visible.sync="isShowMockPickDialog")
    .mockListContainer
      .mockList
        .item(v-for="(i,n) in mockList" :key="n" @click="handlePickMock(i)")
          .name 【{{i.type}}】{{i.name}}
          .description 描述: {{i.description}}
          .description id: {{i._id}}
          .list
            span(v-for="(j,m) in i.list" :key="m") {{j}}
      .extendContainer
        el-button(type="success" @click="handleAddNewMock") 为【{{addMockData.name}}】添加新规则


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
  apiDetail = {
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
  actionDetail = {
    api: '',
    name: '',
    method: '',
    url: '',
    description: '',
    query: <Array<any>>[],
    path: <Array<any>>[],
    body: <Array<any>>[],
    header: <Array<any>>[],
    rule: <Array<any>>[],
    output: <Array<any>>[]
  }
  addRuleData = {
    name: '',
    rule: ''
  }
  addOutputData = {
    name: '',
    source: '',
    target: '',
    targetType: ''
  }
  ruleList: any[] = []
  isShowAddRuleDialog: boolean = false
  isShowAddOutputDialog: boolean = false
  mockList: any[] = []
  isShowMockPickDialog: boolean = false
  addMockData: any = {
    name: '',
    type: ''
  }
  get baseUrl(): string {
    const currentProject = this.projectList.find(
      (o) => o._id === this.currentProjectId
    )
    return currentProject.host
  }

  handleAddNewMock() {
    this.$router.push({
      path: '/mock',
      query: {
        action: 'add',
        type: 'global',
        name: this.addMockData.name
      }
    })
  }
  handlePickMock(mockItem: any) {
    // @ts-ignore
    this.actionDetail[this.addMockData.type].push({
      name: this.addMockData.name,
      mock: mockItem._id
    })
    // @ts-ignore
    const paramIndexForApiDetail = this.apiDetail[
      this.addMockData.type
    ].findIndex((o: any) => o.name === this.addMockData.name)
    // @ts-ignore
    this.apiDetail[this.addMockData.type].splice(paramIndexForApiDetail, 1)
    this.addMockData = {
      name: '',
      type: ''
    }
    this.isShowMockPickDialog = false
  }
  async handleAddMock(item: any, type: string) {
    this.addMockData = { name: item.name, type }
    this.mockList = await this.$http.get('/mock', {
      params: { size: 0, type: 'global', name: item.name }
    })
    this.isShowMockPickDialog = true
  }
  handleSubmitAddAction() {
    this.$http.post('/action', this.actionDetail).then(() => {
      this.$router.push('/actionManage/action')
    })
  }
  async handleAddRule() {
    await this.getRuleList()
    this.addRuleData = {
      name: '',
      rule: ''
    }
    this.isShowAddRuleDialog = true
  }
  handleDeleteRule(index: number) {
    this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
      type: 'warning'
    }).then(() => {
      this.actionDetail.rule.splice(index, 1)
    })
  }
  handleSubmitAddRule() {
    this.actionDetail.rule.push({ ...this.addRuleData })
    this.isShowAddRuleDialog = false
  }
  handleAddOutput() {
    this.addOutputData = {
      name: '',
      source: '',
      target: '',
      targetType: ''
    }
    this.isShowAddOutputDialog = true
  }
  handleDeleteOutput(index: number) {
    this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
      type: 'warning'
    }).then(() => {
      this.actionDetail.output.splice(index, 1)
    })
  }
  handleSubmitAddOutput() {
    this.actionDetail.output.push({ ...this.addOutputData })
    this.isShowAddOutputDialog = false
  }
  handleChangeProject(item: any) {
    this.currentProjectId = item._id
    this.getGroupList()
  }
  handleChangeGroup(item: any) {
    this.currentGroupId = item._id
    this.getApiList()
  }
  async getRuleList() {
    this.ruleList = await this.$http.get('/rule?size=0')
  }
  handleChangeApi(item: any) {
    this.currentApiId = item._id
    this.apiDetail = { ...item }
    this.actionDetail.api = item._id
    this.actionDetail.name = item.name
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
.mockListContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  .mockList {
    flex-grow: 1;
    overflow-y: auto;
    .item {
      background: @primary;
      color: @green;
      .borderBottom;
      .pointer;
      &:first-child {
        .borderTop;
      }
      &:hover {
        background: @black;
      }
      .name {
        color: @primary;
        padding: @gutter;
        background: @info;
      }
      .description {
        color: @info;
        padding: (@gutter / 2) @gutter;
        .size(@s);
      }
      .list {
        padding: @gutter;
        span {
          margin-right: 1em;
          .wordBreak;
        }
      }
    }
  }
  .extendContainer {
    .padding;
    .center;
  }
}
.paramListContainer {
  display: flex;
  align-items: flex-start;
  .paramList {
    flex-basis: 350px;
    flex-shrink: 0;
    margin-right: @gutter;
    .radius;
    .paramListHeader {
      .padding(0 10px);
      .center;
      .size(@l);
    }
    .list {
      .padding;
      min-height: 100px;
    }
    &.picked {
      .border(@success);
      .boxShadow(@success);
      .paramListHeader {
        background: @success;
        color: @primary;
      }
    }
    &.waiting {
      .border(@yellow);
      .boxShadow(@yellow);
      .paramListHeader {
        background: @yellow;
        color: @primary;
      }
    }
  }
}
</style>
