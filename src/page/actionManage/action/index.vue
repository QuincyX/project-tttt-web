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
        el-button(type="primary" icon="el-icon-search" @click="handleSearch") search
        el-button(type="success" icon="el-icon-plus" @click="$router.push('/actionManage/action/add')") add

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
          el-form(label-width="6em")
            el-form-item(label="output" v-if="scoped.row.output.length")
              div(v-for="(obj,index) in scoped.row.output" :key="index")
                span(style="margin-right:2em") name : {{obj.name}}
                span(style="margin-right:2em") source : {{obj.source}}
                span(style="margin-right:2em") targetType : {{obj.targetType}}
                span target : {{obj.target}}
            el-form-item(label="rule" v-if="scoped.row.rule.length")
              div(v-for="(obj,index) in scoped.row.rule" :key="index")
                span(style="margin-right:2em") name : {{obj.name}}
                span rule : {{obj.rule}}
            el-form-item(label="header" v-if="scoped.row.header.length")
              div(v-for="(item,index) in scoped.row.header" :key="index")
                span(style="margin-right:2em") mock : {{item.mock}}
                span name : {{item.name}}
            el-form-item(label="body" v-if="scoped.row.body.length")
              div(v-for="(item,index) in scoped.row.body" :key="index")
                span(style="margin-right:2em") mock : {{item.mock}}
                span name : {{item.name}}
            el-form-item(label="query" v-if="scoped.row.query.length")
              div(v-for="(item,index) in scoped.row.query" :key="index")
                span(style="margin-right:2em") mock : {{item.mock}}
                span name : {{item.name}}
            el-form-item(label="path" v-if="scoped.row.path.length")
              div(v-for="(item,index) in scoped.row.path" :key="index")
                span(style="margin-right:2em") mock : {{item.mock}}
                span name : {{item.name}}
      el-table-column(label="id" prop="_id")
      el-table-column(label="name" prop="name")
      el-table-column(label="description" prop="description")
      el-table-column(label="api" prop="api")
      el-table-column(label="isEnable" prop="isEnable")
        template(v-slot="scoped")
          el-button(v-if="scoped.row.isEnable" type="success" size="mini") 正常
          el-button(v-else type="danger" size="mini") 禁用
      el-table-column(label="createAt" prop="createAt")
        template(v-slot="scoped")
          span {{scoped.row.createAt | formatLastDate}}
      el-table-column(label="操作" width="140")
        template(v-slot="scoped")
          el-button(type="success" icon="el-icon-plus" circle @click="handleAddItemToCart(scoped.row)")
          el-button(type="warning" icon="el-icon-edit" circle)
          el-button(type="danger" icon="el-icon-delete" circle @click="handleDelete(scoped.row)")

  .floatButton
    el-button(type="success" icon="el-icon-shopping-cart-1" size="large" circle @click="isShowCartDialog=true")
  el-drawer(title="已添加的动作列表" :visible.sync="isShowCartDialog")
    .drawerContainer
      .drawerList
        .item(v-for="(i,n) in $store.getters['action/pickedList']" :key="n")
          .name 【{{n+1}}】{{i.name}}
          .description {{i.description}}
          .description {{i.api}}
          .actionBar
            el-button-group
              el-button(type="warning" :disabled="n===0" icon="el-icon-top" size="mini" @click="$store.commit('action/moveUpPicked', i)")
              el-button(type="warning" :disabled="n===$store.getters['action/pickedList'].length-1" icon="el-icon-bottom" size="mini" @click="$store.commit('action/moveDownPicked', i)")
            el-button.rightBtn(type="danger" icon="el-icon-delete" size="mini" @click="$store.commit('action/deletePicked', i)")
      .extendContainer
        el-button(type="success") 生成测试用例

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
  isShowCartDialog: boolean = false

  handleAddItemToCart(item: any) {
    this.$store.commit('action/addPicked', item)
    this.isShowCartDialog = true
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
    console.log('>>>>>>>> ', this.$store.getters['action/pickedList'])
    this.getList()
  }
}
</script>

<style lang="less" scoped>
.cartContainer {
}
</style>
