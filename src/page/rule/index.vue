<template lang="pug">
.page.cardList
  el-card
    el-form(inline label-width="7em")
      el-form-item(label="type")
        el-select(v-model="filter.type")
          el-option(value="") 全部
          el-option(v-for="i in ['相等', '存在', '包含', '属于', '长度大于', '类型']" :key="i" :value="i")
      el-form-item(label="name")
        el-input(v-model="filter.name")
    el-form(label-width="5em")
      el-form-item
        el-button(type="primary" icon="el-icon-search" @click="handleSearch") search
        el-button(type="success" icon="el-icon-plus" @click="handleAdd") add

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
      el-table-column(label="name" prop="name")
      el-table-column(label="description" prop="description")
      el-table-column(label="type" prop="type")
      el-table-column(label="standard" prop="standard")
      el-table-column(label="createAt" prop="createAt")
        template(v-slot="scoped")
          span {{scoped.row.createAt | formatLastDate}}
      el-table-column(label="操作" width="120")
        template(v-slot="scoped")
          el-button(type="warning" icon="el-icon-edit" circle @click="handleEdit(scoped.row)")
          el-button(type="danger" icon="el-icon-delete" circle @click="handleDelete(scoped.row)")

  el-dialog(:title="editDialogData._id?'编辑':'添加'" :visible.sync="isShowEditDialog")
    el-form(label-width="6em")
      el-form-item(label="id" v-if="editDialogData._id")
        el-input(v-model="editDialogData._id" disabled)
      el-form-item(label="name")
        el-input(v-model="editDialogData.name")
      el-form-item(label="描述")
        el-input(v-model="editDialogData.description")
      el-form-item(label="type")
        el-select(v-model="editDialogData.type")
          el-option(v-for="i in ['相等', '存在', '包含', '属于', '长度大于', '类型']" :key="i" :value="i")
      el-form-item(label="standard")
        el-input(v-model="editDialogData.standard")
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
    type: '',
    target: ''
  }
  isShowEditDialog: boolean = false
  editDialogData = {
    _id: '',
    name: '',
    description: '',
    type: '',
    standard: ''
  }
  handleSubmitDialog() {
    if (this.editDialogData._id) {
      this.$http
        .put(`/rule/${this.editDialogData._id}`, {
          ...this.editDialogData
        })
        .then((res) => {
          this.isShowEditDialog = false
          this.getList()
        })
    } else {
      this.$http
        .post(`/rule`, {
          ...this.editDialogData
        })
        .then((res) => {
          this.isShowEditDialog = false
          this.getList()
        })
    }
  }
  handleAdd() {
    this.editDialogData = {
      _id: '',
      name: '',
      description: '',
      type: '',
      standard: ''
    }
    this.isShowEditDialog = true
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
        return this.$http.delete(`/rule/${item._id}`)
      })
      .then(() => {
        this.getList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
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
  getList() {
    this.$http
      .get('/rule', {
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

<style lang="less" scoped></style>
