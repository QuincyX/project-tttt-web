<template lang="pug">
.page.cardList
  el-card
    el-form(inline label-width="7em")
      el-form-item(label="id")
        el-input(v-model="filter._id")
      el-form-item(label="method")
        el-select(v-model="filter.method")
          el-option(value="") 全部
          el-option(v-for="i in ['get','post','put','delete']" :value="i")
      el-form-item(label="url")
        el-input(v-model="filter.url")
      el-form-item(label="apiGroup")
       el-input(v-model="filter.apiGroup")
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
      el-table-column(type="expand")
        template(v-slot="scoped")
          el-form(label-width="10em")
            el-form-item(v-if="scoped.row.body.length" label="body")
              paramItem(v-for="(i,n) in scoped.row.body" :key="n" :detail="i")
            el-form-item(label="header")
              paramItem(v-for="(i,n) in scoped.row.header" :key="n" :detail="i")
            el-form-item(v-if="scoped.row.path.length" label="path")
              paramItem(v-for="(i,n) in scoped.row.path" :key="n" :detail="i")
            el-form-item(v-if="scoped.row.query.length" label="query")
              paramItem(v-for="(i,n) in scoped.row.query" :key="n" :detail="i")
      el-table-column(label="name" prop="name")
      el-table-column(label="url" prop="url")
      el-table-column(label="method" prop="method")
      el-table-column(label="description" prop="description")
      el-table-column(label="operationId" prop="operationId")
      el-table-column(label="apiGroup" prop="apiGroup")
      el-table-column(label="project" prop="project")
      el-table-column(label="isEnable" prop="isEnable")
        template(v-slot="scoped")
          div {{scoped.row.isEnable? 'true': 'false'}}
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
      el-form-item(label="url")
        el-input(v-model="editDialogData.url")
    div(slot="footer")
      el-button(type="default" @click="isShowEditDialog=false") 取消
      el-button(type="primary" @click="handleSubmitDialog") 确定
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
  list = []
  page = {
    page: 1,
    size: 10,
    total: 100,
  }
  filter = {
    _id: '',
    url: '',
    method: '',
    apiGroup: '',
    project: '',
    isEnable: '',
  }
  isShowEditDialog: boolean = false
  editDialogData: any = {
    url: '',
    name: '',
    id: '',
    method: '',
    apiGroup: '',
    project: '',
    host: '',
    type: '',
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
      type: 'warning',
    })
      .then(() => {
        return this.$http.delete(`/apiItem/${item._id}`)
      })
      .then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
        this.getList()
      })
  }
  handleSubmitDialog() {
    this.$http
      .put(`/apiItem/${this.editDialogData._id}`, {
        ...this.editDialogData,
      })
      .then((res) => {
        this.isShowEditDialog = false
        this.page.page = 1
        this.getList()
      })
  }
  getList() {
    this.$http
      .get('/apiItem', {
        params: { ...this.page, ...this.filter },
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
.flex {
  display: flex;
  .item {
    padding: 5px 10px;
    border: 1px solid #7b7575;
    margin: 5px 10px;
    border-radius: 5px;
  }
}
</style>
