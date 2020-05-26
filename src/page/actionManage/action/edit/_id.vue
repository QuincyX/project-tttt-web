<template lang="pug">
  <div>
    el-card
      div.slot_header(slot="header")
        .cardHeader API: {{actionDetail.api}}
        el-button.headerRightButton(type="success" @click="handleSubmitAddAction") Submit
      el-form(label-width="8em" size="medium")
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

        el-form-item(label="Query" v-if="copyApiDetail.query.length || actionDetail.query.length")
          .paramListContainer
            .paramList.picked
              .paramListHeader 已添加
              .list
                paramItem(v-for="(i,n) in actionDetail.query" :key="n" :detail="i" @click="handleDeleteMock(i,n,'query')")
            .paramList.waiting(v-if="copyApiDetail.query.length")
              .paramListHeader 待添加字段
              .list
                paramItem(v-for="(i,n) in copyApiDetail.query" :key="n" :detail="i" @click="handleAddMock(i,'query')")

        el-form-item(label="Body" v-if="copyApiDetail.body.length || actionDetail.body.length")
          .paramListContainer
            .paramList.picked
              .paramListHeader 已添加
              .list
                paramItem(v-for="(i,n) in actionDetail.body" :key="n" :detail="i" @click="handleDeleteMock(i,n,'body')")
            .paramList.waiting()
              .paramListHeader 待添加字段
              .list
                paramItem(v-for="(i,n) in copyApiDetail.body" :key="n" :detail="i" @click="handleAddMock(i,'body')")

        el-form-item(label="Path" v-if="copyApiDetail.path.length || actionDetail.path.length")
          .paramListContainer
            .paramList.picked
              .paramListHeader 已添加
              .list
                paramItem(v-for="(i,n) in actionDetail.path" :key="n" :detail="i" @click="handleDeleteMock(i,n,'query')")
            .paramList.waiting()
              .paramListHeader 待添加字段
              .list
                paramItem(v-for="(i,n) in copyApiDetail.path" :key="n" :detail="i" @click="handleAddMock(i,'path')")

        el-form-item(label="Header" v-if="copyApiDetail.header.length || actionDetail.header.length")
          .paramListContainer
            .paramList.picked
              .paramListHeader 已添加
              .list
                paramItem(v-for="(i,n) in actionDetail.header" :key="n" :detail="i" @click="handleDeleteMock(i,n,'header')")
            .paramList.waiting(v-if="copyApiDetail.header.length")
              .paramListHeader 待添加字段
              .list
                paramItem(v-for="(i,n) in copyApiDetail.header" :key="n" :detail="i" @click="handleAddMock(i,'header')")
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

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import paramItem from '@/component/action/paramItem.vue'
@Component({
  components: {
    paramItem,
  },
})
export default class extends Vue {
  // projectList: any[] = []
  // currentProjectId: string = ''
  // groupList: any[] = []
  // currentGroupId: string = ''
  apiList: any[] = []
  currentApiId: string = ''
  showArray: any[] = ['body', 'query', 'header', 'path']
  copyApiDetail: any = {
    _id: '',
    name: '',
    method: '',
    url: '',
    description: '',
    query: [],
    path: [],
    body: [],
    header: [],
  }
  apiDetail: any = {
    _id: '',
    name: '',
    method: '',
    url: '',
    description: '',
    query: [],
    path: [],
    body: [],
    header: [],
  }
  actionDetail: any = {
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
    output: <Array<any>>[],
  }
  addRuleData = {
    name: '',
    rule: '',
  }
  addOutputData = {
    name: '',
    source: '',
    target: '',
    targetType: '',
  }
  ruleList: any[] = []
  isShowAddRuleDialog: boolean = false
  isShowAddOutputDialog: boolean = false
  mockList: any[] = []
  isShowMockPickDialog: boolean = false
  addMockData: any = {
    name: '',
    type: '',
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
        name: this.addMockData.name,
      },
    })
  }

  handleUnique(a: any, b: any) {
    let arr = [...a]
    let arr1 = [...b]
    arr = arr.filter((item: any) => {
      return arr1.findIndex((o) => o.name === item.name) < 0
    })
    return arr
  }
  handlePickMock(mockItem: any) {
    // @ts-ignore
    this.actionDetail[this.addMockData.type].push({
      name: this.addMockData.name,
      mock: mockItem._id,
    })
    // @ts-ignore
    const paramIndexForApiDetail = this.apiDetail[
      this.addMockData.type
    ].findIndex((o: any) => o.name === this.addMockData.name)
    // @ts-ignore
    this.copyApiDetail[this.addMockData.type].splice(paramIndexForApiDetail, 1)
    this.copyApiDetail[this.addMockData.type] = this.handleUnique(
      this.copyApiDetail[this.addMockData.type],
      this.actionDetail[this.addMockData.type]
    )
    this.addMockData = {
      name: '',
      type: '',
    }

    this.isShowMockPickDialog = false
  }
  async handleAddMock(item: any, type: string) {
    this.addMockData = { name: item.name, type }
    this.mockList = await this.$http.get('/mock', {
      params: { size: 0, type: 'global', name: item.name },
    })
    this.isShowMockPickDialog = true
  }
  handleDeleteMock(item: any, index: any, type: string) {
    let arr = this.apiDetail[type]
    let arr1 = [item]
    const newArr = arr.filter((item: any) => {
      let arrlist = arr1.map((v) => v.name)
      return arrlist.includes(item.name)
    })
    this.copyApiDetail[type] = [...this.copyApiDetail[type], ...newArr]
    this.actionDetail[type].splice(index, 1)
  }
  handleSubmitAddAction() {
    this.$http
      .put(`/action/${this.actionDetail._id}`, this.actionDetail)
      .then(() => {
        this.$router.push('/actionManage/action')
      })
  }
  async handleAddRule() {
    await this.getRuleList()
    this.addRuleData = {
      name: '',
      rule: '',
    }
    this.isShowAddRuleDialog = true
  }
  handleDeleteRule(index: number) {
    this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
      type: 'warning',
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
      targetType: '',
    }
    this.isShowAddOutputDialog = true
  }
  handleDeleteOutput(index: number) {
    this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
      type: 'warning',
    }).then(() => {
      this.actionDetail.output.splice(index, 1)
    })
  }
  handleSubmitAddOutput() {
    this.actionDetail.output.push({ ...this.addOutputData })
    this.isShowAddOutputDialog = false
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

  async getApiList() {
    this.apiList = await this.$http.get(
      `/apiItem?size=0&apiGroup=${this.currentGroupId}`
    )
    this.handleChangeApi(this.apiList[0])
  }
  async mounted() {
    this.actionDetail = await this.$http.get(`/action/${this.$route.params.id}`)
    this.apiDetail = await this.$http.get(`/apiItem/${this.actionDetail.api}`)
    this.copyApiDetail = JSON.parse(JSON.stringify(this.apiDetail))
    this.showArray.map((item) => {
      this.copyApiDetail[item] = this.handleUnique(
        this.copyApiDetail[item],
        this.actionDetail[item]
      )
    })
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
.slot_header {
  display: flex;
  justify-content: space-between;
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
