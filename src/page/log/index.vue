<template lang="pug">
.page.cardList
  el-card
    el-form(inline label-width="7em")
      el-form-item(label="type")
        el-select(v-model="filter.type")
          el-option(value="") 全部
          el-option(value="success")
          el-option(value="error")
      el-form-item(label="jobId")
        el-input(v-model="filter.job")
      el-form-item(label="belongType")
        el-select(v-model="filter.belongType")
          el-option(value="") 全部
          el-option(value="job")
          el-option(value="story")
          el-option(value="case")
          el-option(value="action")
          el-option(value="http")
          el-option(value="rule")
          el-option(value="output")
          el-option(value="sys")
      el-form-item(label="belongTo")
        el-input(v-model="filter.belongTo")
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
      el-table-column(type="expand")
        template(v-slot="scoped")
          el-form(label-width="7em")
            el-form-item(label="id") {{scoped.row._id}}
            el-form-item(label="content") {{scoped.row.content}}

      el-table-column(label="type" prop="type")
      el-table-column(label="title" prop="title")
      el-table-column(label="job" prop="job")
      el-table-column(label="belongType" prop="belongType")
      el-table-column(label="belongTo" prop="belongTo")
      el-table-column(label="createAt" prop="createAt")

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
    job: '',
    belongType: '',
    belongTo: ''
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
      .get('/log', {
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
