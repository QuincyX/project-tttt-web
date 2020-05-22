<template lang="pug">
.page.cardList
  el-card
    el-form(inline label-width="7em")
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
      el-table-column(label="name" prop="name")
      //- el-table-column(type="expand")
      //-   template(v-slot="scoped")
      //-     el-form(label-width="7em")
      //-       el-form-item(label="id") {{scoped.row._id}}
      //-       el-form-item(label="content") {{scoped.row.content}}
      el-table-column(label="url" prop="url")
      el-table-column(label="method" prop="method")
      el-table-column(label="description" prop="description")
      el-table-column(label="operationId" prop="operationId")
      el-table-column(label="apiGroup" prop="apiGroup")
      el-table-column(label="project" prop="project")
      el-table-column(label="isEnable" prop="isEnable")
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
    url: '',
    method:'',
    apiGroup: '',
    project: '',
    isEnable: ''
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
      .get('/apiItem', {
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
