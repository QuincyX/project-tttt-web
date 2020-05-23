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
      el-form-item(label="Query" v-if="actionDetail.query.length")
        paramItem(v-for="(i,n) in actionDetail.query" :key="n" :detail="i")
      el-form-item(label="Body" v-if="actionDetail.body.length")
        paramItem(v-for="(i,n) in actionDetail.body" :key="n" :detail="i")
      el-form-item(label="Path" v-if="actionDetail.path.length")
        paramItem(v-for="(i,n) in actionDetail.path" :key="n" :detail="i")
      el-form-item(label="Header" v-if="actionDetail.header.length")
        paramItem(v-for="(i,n) in actionDetail.header" :key="n" :detail="i" @click="handleAddHeaderMock(i)")
      el-form-item(label="验证规则")
        el-button(v-for="(i,n) in actionDetail.rule" :key="n" type="success" @click="handleDeleteRule(n)") {{i.name}}
        el-button(type="success" icon="el-icon-plus" @click="handleAddRule")
      el-form-item(label="输出规则")
        el-button(v-for="(i,n) in actionDetail.output" :key="n" type="success" @click="handleDeleteOutput(n)") {{i.name}}
        el-button(type="success" icon="el-icon-plus" @click="handleAddOutput")

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

  el-dialog(title="选择数据定义" :visible.sync="isShowMockPickDialog")
    .mockList
      .item(v-for="(i,n) in mockList" :key="n") {{i}}


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
  get baseUrl(): string {
    const currentProject = this.projectList.find(
      (o) => o._id === this.currentProjectId
    )
    return currentProject.host
  }
  handleAddHeaderMock(item:any){
    console.log('>>>>>>>> ',item)
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
    this.actionDetail.query = item.query
    this.actionDetail.header = item.header
    this.actionDetail.path = item.path
    this.actionDetail.body = item.body
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
