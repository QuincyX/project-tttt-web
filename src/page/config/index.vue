<template lang="pug">
.page.cardList
  el-card.fullCard
    el-button(slot="header" type="success" @click="isShowEditDialog=true") 添加配置
    el-table(:data="list")
      el-table-column(label="ID" prop="_id")
      el-table-column(label="名称" prop="name")
      el-table-column(label="备注" prop="description")
      el-table-column(label="内容" prop="content")
      el-table-column(label="状态" prop="isEnable")
        template(v-slot="scoped")
          el-button(v-if="scoped.row.isEnable" size="mini" type="success" icon="el-icon-check") 启用
          el-button(v-else size="mini" type="warning") 禁用
      el-table-column(label="创建时间" prop="createAt")
        template(v-slot="scoped")
          span {{scoped.row.createAt | formatLastDate}}
      el-table-column(label="操作" width="240" align="center")
        template(v-slot="scoped")
          el-button(type="success" size="mini" icon="el-icon-view" @click="handleEdit(scoped.row)") 编辑配置
          el-button(type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scoped.row)") 删除配置

  el-dialog(:title="editDialogData._id?'编辑':'添加'" :visible.sync="isShowEditDialog")
    el-form(label-width="6em")
      el-form-item(label="ID")
        el-input(v-model="editDialogData._id")
      el-form-item(label="名称")
        el-input(v-model="editDialogData.name")
      el-form-item(label="描述")
        el-input(v-model="editDialogData.description")
      el-form-item(label="内容")
        el-input(v-model="editDialogData.content")
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
  isShowEditDialog: boolean = false
  editDialogData: any = {
    _id: '',
    name: '',
    description: '',
    content: ''
  }
  handleSubmitDialog() {
    if (this.editDialogData._id) {
      this.$http
        .put(`/config/${this.editDialogData._id}`, {
          ...this.editDialogData
        })
        .then((res) => {
          this.isShowEditDialog = false
          this.getList()
        })
    } else {
      this.$http
        .post(`/config`, {
          ...this.editDialogData
        })
        .then((res) => {
          this.isShowEditDialog = false
          this.getList()
        })
    }
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
        return this.$http.delete(`/job/${item._id}`)
      })
      .then(({ message }: any) => {
        this.$message({
          type: 'success',
          message
        })
        this.getList()
      })
  }
  async getList() {
    this.list = await this.$http.get('/config')
  }
  mounted(): void {
    this.getList()
  }
}
</script>

<style lang="less" scoped></style>
