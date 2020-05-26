<template lang="pug">
.page.cardList
  el-card
    el-form(inline label-width="7em")
      el-form-item(label="status")
        el-select(v-model="filter.status")
          el-option(value="") 全部
          el-option(value="进行中")
          el-option(value="已完成")
      el-form-item(label="storyId")
        el-input(v-model="filter.story")
      el-form-item(label="trigger")
        el-select(v-model="filter.trigger")
          el-option(value="") 全部
          el-option(v-for="i in ['手动','定时','计划','ops','git']" :key="i" :value="i")
      el-form-item(label="type")
        el-select(v-model="filter.type")
          el-option(value="") 全部
          el-option(v-for="i in ['单例','循环']" :key="i" :value="i")
      el-form-item(label="belongTo")
        el-input(v-model="filter.belongTo")
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
      el-table-column(label="ID" prop="_id")
      el-table-column(label="名称" prop="name")
      el-table-column(label="备注" prop="description")
      el-table-column(label="故事" prop="story")
      el-table-column(label="触发方式" prop="trigger")
      el-table-column(label="耗时" prop="duration")
      el-table-column(label="报告" prop="report")
      el-table-column(label="任务类型" prop="type")
      el-table-column(label="状态" prop="status")
        template(v-slot="scoped")
          el-button(v-if="scoped.row.status==='进行中'" size="mini" type="warning" icon="el-icon-loading") 进行中
          el-button(v-else-if="scoped.row.status==='已完成'" size="mini" type="primary") 已结束
      el-table-column(label="创建时间" prop="createAt")
        template(v-slot="scoped")
          span {{scoped.row.createAt | formatLastDate}}
      el-table-column(label="操作" width="240" align="center")
        template(v-slot="scoped")
          el-button(type="success" size="mini" icon="el-icon-view" @click="$router.push(`/log?job=${scoped.row._id}`)") 查看日志
          el-button(type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scoped.row)") 清空任务

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
    status: '',
    story: '',
    trigger: '',
    type: '',
    belongTo: ''
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
      .get('/job', {
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
