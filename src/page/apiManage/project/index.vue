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
      el-table-column(label="title" prop="title")
      el-table-column(label="type" prop="type")
      el-table-column(label="version" prop="version")
      el-table-column(label="description" prop="description")
      el-table-column(label="host" prop="host")
      el-table-column(label="basePath" prop="basePath")
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
    title: '',
    type: '',
    version: '',
    description: '',
    host: '',
    basePath: ''
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
      .get('/project', {
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
