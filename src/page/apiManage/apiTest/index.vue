<template lang="pug">
.page.cardList
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
      .cardHeader 名称: {{actionDetail.name}}
      el-button.headerRightButton(type="success" @click="handleSubmitAddAction") 执行测试
    el-form(label-width="8em" size="medium")
      el-form-item(label="请求地址") {{apiDetail.method.toUpperCase()}} http://{{baseUrl}}{{apiDetail.url}}
      el-form-item(label="请求参数")
        el-tabs(v-model="activeName" type="card" @tab-click="handleClick")
          el-tab-pane(name="Header")
            span(slot='label') Header
              i {{" "+ apiDetail.header.length}}
            div.inputItem(v-for="(i,n) in apiDetail.header" :key="n")
              el-input(placeholder="请输入内容" v-model="i.value" class="input-with-select" @blur="queryValue(i.name,n,'header')")
                el-button(slot="prepend" style = 'width:150px') {{i.name}}
                el-button(slot="append" icon="el-icon-plus"  @click="handleAddMock(i,n,'header')")

          el-tab-pane(name="Body")
            span(slot='label') Body
            div.inputItem
              el-input(type="textarea" placeholder="请输入内容" :rows="10" v-model="subItem.body" class="input-with-select")
                //- el-button(slot="append" icon="el-icon-plus"  @click="handleAddMock(i,n,'body')")
          el-tab-pane(name="Query")
            span(slot='label') Query
              i {{" "+ apiDetail.query.length}}
            div.inputItem(v-for="(i,n) in apiDetail.query" :key="n")
              el-input(placeholder="请输入内容" v-model="i.value" class="input-with-select" @blur="queryValue(i.name,n,'query')")
                el-button(slot="prepend" style = 'width:150px') {{i.query}}
                el-button(slot="append" icon="el-icon-plus"  @click="handleAddMock(i,n,'query')")

          el-tab-pane(name="Path")
            span(slot='label') Path
              i {{" "+ apiDetail.path.length}}
            div.inputItem(v-for="(i,n) in apiDetail.path" :key="n")
              el-input(placeholder="请输入内容" v-model="i.value" class="input-with-select" @blur="queryValue(i.name,n,'path')")
                el-button(slot="prepend" style = 'width:150px') {{i.name}}
                el-button(slot="append" icon="el-icon-plus"  @click="handleAddMock(i,n,'path')")
      el-form-item(label="测试信息")
        div.respone {{responeData}}
  el-drawer(title="选择数据定义" :visible.sync="isShowMockPickDialog")
    .mockListContainer
      .mockList
        .item(v-for="(i,n) in mockList" :key="n" @click="handlePickMock(i)")
          .name 【{{i.type}}】{{i.name}}
          .description 描述: {{i.description}}
          .description id: {{i._id}}
          .list
            span(v-for="(j,m) in i.list" :key="m") {{j}}

  el-dialog(:title="editDialogData._id?'编辑':'添加'" :visible.sync="isShowEditDialog")
    el-form(label-width="6em")
      el-form-item(label="id" v-if="editDialogData._id")
        el-input(v-model="editDialogData._id" disabled)
      el-form-item(label="名称*")
        el-input(v-model="editDialogData.description")
      el-form-item(label="字段名*")
        el-input(v-model="editDialogData.name" disabled)
      el-form-item(label="类型")
        el-select(v-model="editDialogData.type")
          el-option(v-for="i in ['global', 'job', 'story', 'case', 'action']" :key="i" :value="i")
      el-form-item(label="targetId" v-if="editDialogData.type!=='global'")
        el-input(v-model="editDialogData.target")
      el-form-item(label="list")
        el-button(type="info" style="max-width:120px; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-for="(i,n) in editDialogData.list" :key="n" @click="handleDeleteMockListItemInEditDialog(editDialogData,n)") {{i}}
        el-button(type="success" icon="el-icon-plus" @click="addMockList(editDialogData)")
    div(slot="footer")
      el-button(type="default" @click="isShowEditDialog=false") 取消
      el-button(type="primary" @click="handleSubmitDialog") 确定


</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import paramItem from '@/component/action/paramItem.vue'

@Component({
  components: { paramItem },
})
export default class extends Vue {
  projectList: any[] = []
  currentProjectId: string = ''
  groupList: any[] = []
  currentGroupId: string = ''
  apiList: any[] = []
  currentApiId: string = ''
  input3: any = ''
  activeName: any = 'Header'
  apiDetail = {
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
  responeData: any = ''
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
    output: <Array<any>>[],
  }
  mockList: any[] = []
  isShowMockPickDialog: boolean = false
  addMockData: any = {
    name: '',
    type: '',
  }
  subItem: any = {
    query: {},
    path: {},
    body: '',
    header: {},
  }
  isShowEditDialog: boolean = false
  editDialogData: any = {
    _id: '',
    name: '',
    description: '',
    type: 'global',
    target: '',
    list: [],
  }
  pramList: any = ['header', 'body', 'query', 'path']
  async handleSubmitDialog() {
    let _that = this
    this.$http
      .post(`/mock`, {
        ...this.editDialogData,
      })
      .then((res) => {
        return this.$http.get('/mock', {
          params: { size: 0, type: 'global', name: this.addMockData.name },
        })
      })
      .then((res: any) => {
        this.mockList = res
        this.isShowEditDialog = false
      })
  }
  get baseUrl(): string {
    const currentProject = this.projectList.find(
      (o) => o._id === this.currentProjectId
    )
    return currentProject.host
  }
  handleClick(tab: any, event: any) {
    // console.log(tab, event)
  }
  addMockList(item: any) {
    this.$prompt('请输入新的内容', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(({ value }: any) => {
      if (value && value.trim().length) {
        this.editDialogData.list.push(value)
        this.editDialogData.list = Array.from(new Set(this.editDialogData.list))
      }
    })
  }
  handlePickMock(mockItem: any) {
    // @ts-ignore
    this.apiDetail[this.addMockData.type][this.addMockData.index].value =
      mockItem.list[Math.floor(Math.random() * mockItem.list.length)]
    // @ts-ignore
    this.subItem[this.addMockData.type][this.addMockData.name] = <any>(
      this.apiDetail[this.addMockData.type][this.addMockData.index].value
    )
    this.addMockData = {
      name: '',
      type: '',
    }
    this.isShowMockPickDialog = false
  }
  queryValue(name: any, index: any, type: any) {
    this.subItem[type][name] = this.apiDetail[type][index].value
  }
  async handleAddMock(item: any, index: any, type: string) {
    this.addMockData = { name: item.name, type, index }
    this.mockList = await this.$http.get('/mock', {
      params: { size: 0, type: 'global', name: item.name },
    })
    this.isShowMockPickDialog = true
  }
  handleSubmitAddAction() {
    let bodyRaw = ''
    try {
    } catch (error) {}
    if (this.subItem.body) {
      let bodyRaw = JSON.parse(
        this.subItem.body
          .replace(/\ +/g, '')
          .replace(/\n/g, '')
          .replace(/\r/g, '')
      )
    }

    let url = this.apiDetail.url
    Object.keys(this.subItem.path).forEach((path: any) => {
      url = url.replace(`{${path}}`, this.subItem.path[path])
    })
    // @ts-ignore
    this.$curl({
      method: this.apiDetail.method.toUpperCase(),
      url: `http://${this.baseUrl}${url}`,
      query: this.subItem.query,
      headers: this.subItem.header,
      body: bodyRaw,
    }).then((res: any) => {
      this.responeData = res
    })
  }
  handleDeleteMockListItemInEditDialog(item: any, index: number) {
    this.editDialogData.list.splice(index, 1)
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
    this.apiDetail = { ...JSON.parse(JSON.stringify(item)), body: '' }
    this.actionDetail.api = item._id
    this.actionDetail.name = item.name
  }
  async getProjectList() {
    this.projectList = await this.$http.get('/project?size=0')
    if (this.projectList.length) {
      this.handleChangeProject(this.projectList[0])
    }
  }
  async getGroupList() {
    this.groupList = await this.$http.get(
      `/apiGroup?size=0&project=${this.currentProjectId}`
    )
    if (this.groupList.length) {
      this.handleChangeGroup(this.groupList[0])
    }
  }
  async getApiList() {
    this.apiList = await this.$http.get(
      `/apiItem?size=0&apiGroup=${this.currentGroupId}`
    )
    if (this.apiList.length) {
      this.pramList.map((type: any) => {
        this.addApiValue(this.apiList[0][type])
      })
      this.handleChangeApi(this.apiList[0])
    }
  }
  addApiValue(item: any) {
    item.map((obj: any) => {
      obj.value = ''
    })
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
.inputItem {
  margin: 10px 0;
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
.respone {
  padding: 5px;
  border: 1px solid #7e5db2;
  border-radius: 5px;
  min-height: 50px;
}
.token {
  display: flex;
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
