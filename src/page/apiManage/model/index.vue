<template lang="pug">
.page.cardList
  el-card
    el-form(inline label-width="7em")
      el-form-item(label="project")
        el-input(v-model="filter.project")
      el-form-item(label="isEnable")
        el-input(v-model="filter.isEnable")
    el-form(label-width="5em")
      el-form-item
        el-button(type="primary" @click="handleSearch") search

  el-card.fullCard
    el-pagination(
      slot="header"
      background hide-on-single-page
      layout="total,sizes,prev,pager,next"
      :current-page.sync="page.page"
      :page-size="page.size"
      :total="page.total"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    )
    el-table(:data="list")
      el-table-column(type='expand')
        template(v-slot="scoped")
          el-form(label-width="8em")
            el-form-item(v-for="(item, k) in scoped.row.properties" :key="k" :label="item.name") 
              p 描述：{{item.description}}，
              p 类型：{{item.type}}，
              p 请求：{{item.require}}
      el-table-column(label="name" prop="name")
      el-table-column(label="description" prop="description")
      el-table-column(label="type" prop="type")
      //- el-table-column(label="properties" prop="properties")
      el-table-column(label="project" prop="project")
      el-table-column(label="isEnable" prop="isEnable")
      el-table-column(label="belongTo" prop="belongTo")
      el-table-column(label="createAt" prop="createAt")
      el-table-column(label="操作" width="120")
        template(v-slot="scoped")
          el-button(type="warning" icon="el-icon-edit" circle @click="handleEdit(scoped.row)")
          el-button(type="danger" icon="el-icon-delete" circle @click="handleDelete(scoped.row)")

  el-dialog(:title="'编辑'" :visible.sync="isShowEditDialog")
    el-form(label-width="6em")
      el-form-item(label="id" v-if="editDialogData._id")
        el-input(v-model="editDialogData._id" disabled)
      el-form-item(label="name")
        el-input(v-model="editDialogData.name")
      el-form-item(label="描述")
        el-input(v-model="editDialogData.description")
      el-form-item(label="project")
        el-input(v-model="editDialogData.project")
    div(slot="footer")
      el-button(type="default" @click="isShowEditDialog=false") 取消
      el-button(type="primary" @click="handleSubmitDialog") 确定
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
    project: '',
    isEnable: ''
  }
  isShowEditDialog: boolean = false
  editDialogData = {
    _id: '',
    name: '',
    description: '',
    project: ''
  }
  handleSearch() {
    this.page.page = 1
    this.page.size = 10
    this.getList()
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
  handleEdit(item: any) {
    this.editDialogData = { ...item }
    this.isShowEditDialog = true
  }
  handleDelete(item: any) {
    this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      type: 'warning'
    })
      .then(() => {
        return this.$http.delete(`/apiModel/${item._id}`)
      })
      .then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getList()
      })
  }
  handleSubmitDialog() {
  this.$http
    .put(`/apiModel/${this.editDialogData._id}`, {
      ...this.editDialogData
    })
    .then((res) => {
      this.isShowEditDialog = false
      // this.page.page = 1
      this.getList()
    })
  }
  getList() {
    this.$http
      .get('/apiModel', {
        params: { ...this.page, ...this.filter }
      })
      .then(({ page, list }: any) => {
        this.page = page
        this.list = list
      })
  }
  mounted(): void {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
</style>
