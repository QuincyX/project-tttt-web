<template lang="pug">
.page.cardList
  el-card
    el-form(inline label-width="7em")
      el-form-item(label="字段名")
        el-input(v-model="filter.name")
      el-form-item(label="类型")
        el-select(v-model="filter.type")
          el-option(value="") 全部
          el-option(v-for="i in ['global', 'job', 'story', 'case', 'action']" :key="i" :value="i")
      el-form-item(label="目标ID" v-if="filter.type!=='global'")
        el-input(v-model="filter.target")
    el-form(label-width="5em")
      el-form-item
        el-button(type="primary" icon="el-icon-search" @click="handleSearch") 查询
        el-button(type="success" icon="el-icon-plus" @click="handleAdd") 添加

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
          el-form(label-width="7em")
            el-form-item(label="list")
              el-button(type="info" v-for="(i,n) in scoped.row.list" :key="n" @click="handleDeleteMockListItem(scoped.row,n)") {{i}}
              el-button(type="success" icon="el-icon-plus" @click="handleAddMockList(scoped.row)")

      el-table-column(label="id" prop="_id")
      el-table-column(label="描述" prop="description")
      el-table-column(label="字段名" prop="name")
      el-table-column(label="type" prop="type")
      el-table-column(label="target" prop="target")
      el-table-column(label="createAt" prop="createAt")
        template(v-slot="scoped")
          span {{scoped.row.createAt | formatLastDate}}
      el-table-column(label="操作" width="120")
        template(v-slot="scoped")
          el-button(type="warning" icon="el-icon-edit" circle @click="handleEdit(scoped.row)")
          el-button(type="danger" icon="el-icon-delete" circle @click="handleDelete(scoped.row)")

  el-dialog(:title="editDialogData._id?'编辑':'添加'" :visible.sync="isShowEditDialog" :close-on-click-modal="false" :close-on-press-escape="false")
    el-form(label-width="6em")
      el-form-item(label="id" v-if="editDialogData._id")
        el-input(v-model="editDialogData._id" disabled)
      el-form-item(label="描述*")
        el-input(v-model="editDialogData.description")
      el-form-item(label="字段名*")
        el-input(v-model="editDialogData.name")
      el-form-item(label="类型")
        el-select(v-model="editDialogData.type")
          el-option(v-for="i in ['global', 'job', 'story', 'case', 'action']" :key="i" :value="i")
      el-form-item(label="targetId" v-if="editDialogData.type!=='global'")
        el-input(v-model="editDialogData.target")
      el-form-item(label="可选的内容")
        el-button(type="info" style="max-width:120px; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-for="(i,n) in editDialogData.list" :key="n" @click="handleDeleteMockListItemInEditDialog(editDialogData,n)") {{i}}
        el-button(type="success" icon="el-icon-plus" @click="addMockList(editDialogData)")
    div(slot="footer")
      el-button(type="default" @click="isShowEditDialog=false") 取消
      el-button(type="primary" @click="handleSubmitDialog") 确定

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class extends Vue {
  list = []
  page = {
    page: 1,
    size: 10,
    total: 100,
  }
  filter = {
    type: 'global',
    target: '',
    name: '',
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
  handleSubmitDialog() {
    if (this.editDialogData._id) {
      this.$http
        .put(`/mock/${this.editDialogData._id}`, {
          ...this.editDialogData,
        })
        .then((res) => {
          this.isShowEditDialog = false
          this.getList()
        })
    } else {
      this.$http
        .post(`/mock`, {
          ...this.editDialogData,
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
      type: 'global',
      target: '',
      list: [],
    }
    this.isShowEditDialog = true
  }
  handleEdit(item: any) {
    this.editDialogData = { ...item }
    this.isShowEditDialog = true
  }
  handleDeleteMockListItemInEditDialog(item: any, index: number) {
    this.editDialogData.list.splice(index, 1)
  }
  handleDeleteMockListItem(item: any, index: number) {
    this.$confirm(
      `此操作将永久删除该数据【${item.list[index]}】, 是否继续?`,
      '提示',
      {
        type: 'warning',
      }
    )
      .then(() => {
        return this.$http.delete(
          `/mock/${item._id}/list/item/${item.list[index]}`
        )
      })
      .then(() => {
        this.getList()
      })
  }
  handleAddMockList(item: any) {
    this.$prompt('请输入新的内容', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(({ value }: any) => {
        this.editDialogData.list.push(value)
        return this.$http.post(`/mock/${item._id}/list/item`, {
          newItem: value,
        })
      })
      .then(() => {
        this.getList()
      })
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
  handleDelete(item: any) {
    this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      type: 'warning',
    })
      .then(() => {
        return this.$http.delete(`/mock/${item._id}`)
      })
      .then(() => {
        this.getList()
        this.$message({
          type: 'success',
          message: '删除成功!',
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
      .get('/mock', {
        params: { ...this.page, ...this.filter },
      })
      .then(({ page, list }: any) => {
        this.page = page
        this.list = list
      })
  }
  mounted(): void {
    this.getList()
    if (this.$route.query?.action === 'add') {
      this.editDialogData.name = this.$route.query?.name
      this.editDialogData.type = this.$route.query?.type
      this.isShowEditDialog = true
    }
  }
}
</script>

<style lang="less" scoped></style>
