<template lang="pug">
.page.cardList
  el-card
    el-form(inline label-width="7em")
      el-form-item(label="title")
        el-input(v-model="filter.title")
      el-form-item(label="type")
        el-input(v-model="filter.type")
      el-form-item(label="description")
        el-input(v-model="filter.description")
      el-form-item(label="host")
        el-input(v-model="filter.host")
    el-form(label-width="5em")
      el-form-item
        el-button(type="primary" @click="handleSearch") search
        el-button(type="success" icon="el-icon-plus" @click="handleAddUrl") add
  el-card.fullCard
    el-pagination(
      slot="header"
      background
      layout="total,sizes,prev,pager,next"
      :current-page.sync="page.page"
      :page-size="page.size"
      :total="page.total"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    )
    el-table(:data="list")
      el-table-column(label="id" prop="_id")
      el-table-column(label="title" prop="title")
      el-table-column(label="type" prop="type")
      el-table-column(label="version" prop="version")
      el-table-column(label="description" prop="description")
      el-table-column(label="host" prop="host")
      el-table-column(label="basePath" prop="basePath")
      el-table-column(label="createAt" prop="createAt")
      el-table-column(label="操作" width="280")
        template(v-slot="scoped")
          el-button(type="warning" icon="el-icon-edit" circle @click="handleEdit(scoped.row)")
          el-button(type="danger" icon="el-icon-delete" circle @click="handleDelete(scoped.row)")
          el-button(type="primary" size="mini" round @click="handleAddGroup(scoped.row)") 添加分组
          el-button(type="success" size="mini" round @click="handleRefresh(scoped.row)" v-loading.fullscreen.lock="isLoading") 更新数据

  el-dialog(:title="'添加'" :visible.sync="isShowAddDialog")
    el-form(label-width="6em")
      el-form-item(label="URL")
        el-input(v-model="addDialogData.url")
    div(slot="footer")
      el-button(type="default" @click="isShowAddDialog=false") 取消
      el-button(type="primary" @click="handleSubmitDialog") 确定

  el-dialog(:title="'编辑'" :visible.sync="isShowEditDialog")
    el-form(label-width="6em")
      el-form-item(label="id" v-if="editDialogData._id")
        el-input(v-model="editDialogData._id" disabled)
      el-form-item(label="title")
        el-input(v-model="editDialogData.title")
      el-form-item(label="描述")
        el-input(v-model="editDialogData.description")
      el-form-item(label="host")
        el-input(v-model="editDialogData.host")
    div(slot="footer")
      el-button(type="default" @click="isShowEditDialog=false") 取消
      el-button(type="primary" @click="handleSubmitEditDialog") 确定

  el-dialog(:title="'添加分组'" :visible.sync="isShowAddGroupDialog")
    el-form(label-width="6em")
      el-form-item(label="name")
        el-input(v-model="addGroupDialogData.name")
      el-form-item(label="描述")
        el-input(v-model="addGroupDialogData.description")
      el-form-item(label="project")
        el-input(v-model="addGroupDialogData.project" disabled)
    div(slot="footer")
      el-button(type="default" @click="isShowAddGroupDialog=false") 取消
      el-button(type="primary" @click="submitAddGroupDialog") 确定
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class extends Vue {
  list = []
  page = {
    page: 1,
    size: 10,
    total: 100
  }
  filter = {
    title: '',
    type: '',
    version: '',
    description: '',
    host: '',
    basePath: ''
  }
  isShowAddDialog: boolean = false
  isShowEditDialog: boolean = false
  addDialogData = {
    url: ''
  }
  editDialogData = {
    _id: '',
    url: '',
    name: '',
    host: '',
    type: ''
  }
  isShowAddGroupDialog: boolean = false
  addGroupDialogData = {
    name: '',
    description: '',
    project: ''
  }
  isLoading: boolean = false
  handleRefresh(project: any) {
    const loading = this.$loading({ background: 'rgba(0, 0, 0, 0.7)' })
    this.$http.put(`/project/${project._id}/refresh`).finally(() => {
      loading.close()
    })
  }
  handleSearch() {
    this.page.page = 1
    this.page.size = 10
    this.getList()
  }
  handleAddUrl() {
    this.isShowAddDialog = true
  }
  handleSubmitDialog() {
    if (this.addDialogData.url) {
      this.$http.post('/project', this.addDialogData).then((res) => {
        this.isShowAddDialog = false
        this.page.page = 1
        this.getList()
      })
    }
  }
  handleEdit(item: any) {
    this.editDialogData = { ...item }
    this.isShowEditDialog = true
  }
  handleSubmitEditDialog() {
    this.$http
      .put(`/project/${this.editDialogData._id}`, {
        ...this.editDialogData
      })
      .then((res) => {
        this.isShowEditDialog = false
        this.page.page = 1
        // console.log(this.page.page)
        this.getList()
      })
  }
  handleDelete(item: any) {
    this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      type: 'warning'
    })
      .then(() => {
        return this.$http.delete(`/project/${item._id}`)
        this.getList()
      })
      .then(() => {
        this.getList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
  }
  handleAddGroup(projectItem: any) {
    this.isShowAddGroupDialog = true
    this.addGroupDialogData.project = projectItem._id
  }
  submitAddGroupDialog() {
    this.$http
      .post(`/apiGroup`, {
        ...this.addGroupDialogData
      })
      .then((res) => {
        this.isShowAddGroupDialog = false
        this.$router.push(
          `/apiManage/group?project=${this.addGroupDialogData.project}`
        )
      })
  }
  handleSizeChange(val: number) {
    this.page.size = val
    this.page.page = 1
    this.getList()
  }
  handleCurrentChange(val: number) {
    this.page.page = val
    this.getList()
  }
  getList() {
    this.$http
      .get('/project', {
        params: { ...this.page, ...this.filter }
      })
      .then(({ page, list, ...res }: any) => {
        this.page = page
        this.list = list
      })
  }
  mounted(): void {
    this.getList()
  }
}
</script>

<style lang="less" scoped></style>
