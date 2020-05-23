<template lang="pug">
.page.cardList
  el-card
    el-form(inline label-width="7em")
      el-form-item(label="name")
        el-input(v-model="filter.name")
      el-form-item(label="api")
        el-input(v-model="filter.api")
      el-form-item(label="type")
       el-input(v-model="filter.type")
      el-form-item(label="isEnable")
        el-select(v-model='filter.isEnable')
          el-option(value="") 全部
          el-option(v-for="i in ['true','false']" :key="i" :value="i")
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
            el-form-item(label="body") {{scoped.row.body}}
            el-form-item(label="output")
              div(v-for="obj in scoped.row.output")
                span name : {{obj.name}}
                span source : {{obj.source}}
                span target : {{obj.target}}
            el-form-item(label="header")
              div(v-for="item in scoped.row.header")
                span mock : {{item.mock}}
                span name : {{item.name}}
      el-table-column(label="id" prop="_id")
      el-table-column(label="name" prop="name")
      el-table-column(label="description" prop="description")
      el-table-column(label="api" prop="api")
      el-table-column(label="query" prop="query")
      el-table-column(label="path" prop="path")
      el-table-column(label="type" prop="type")
      el-table-column(label="rule" prop="rule")
      el-table-column(label="isEnable" prop="isEnable")
      el-table-column(label="createAt" prop="createAt")
        template(v-slot="scoped")
          span {{scoped.row.createAt | formatLastDate}}
      el-table-column(label="操作" width="120")
        template(v-slot="scoped")
          el-button(type="warning" icon="el-icon-edit" circle)
          el-button(type="danger" icon="el-icon-delete" circle @click="handleDelete(scoped.row)")

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
    name: '',
    api: '',
    type: '',
    isEnable: ''
  }
  handleDelete(item: any) {
    this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      type: 'warning'
    })
      .then(() => {
        return this.$http.delete(`/job/${item._id}`)
      })
      .then(() => {
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
      .get('/action', {
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
