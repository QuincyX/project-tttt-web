<template lang="pug">
.page.cardList
  el-card
    el-form(inline label-width="7em")
      el-form-item(label="日志类型")
        el-select(v-model="filter.type")
          el-option(value="") 全部
          el-option(value="success" label="成功")
          el-option(value="warning" label="警告")
          el-option(value="error" label="错误")
      el-form-item(label="关联任务")
        el-input(v-model="filter.job")
      el-form-item(label="关联动作")
        el-select(v-model="filter.belongType")
          el-option(value="") 全部
          el-option(v-for="i in ['job','story','case','action','http','rule','output','sys']" :key="i" :value="i")
      el-form-item(:label="`${filter.belongType} 的ID`" v-if="filter.belongType")
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
      el-table-column(type="expand")
        template(v-slot="scoped")
          el-form(label-width="7em")
            el-form-item(label="日志ID") {{scoped.row._id}}
            el-form-item(label="返回内容" v-if="scoped.row.content")
              pre {{scoped.row.content}}
            el-form-item(label="curl脚本" v-if="scoped.row.curl")
              pre {{scoped.row.curl}}
      el-table-column(label="报告类型" prop="type")
        template(v-slot="scoped")
          el-button(v-if="scoped.row.type==='success'" type="success" size="mini") 成功
          el-button(v-else-if="scoped.row.type==='warning'" type="danger" size="mini") 告警
          el-button(v-else-if="scoped.row.type==='error'" type="danger" size="mini") 错误
      el-table-column(label="标题" prop="title")
      el-table-column(label="关联动作" prop="belongType")
      el-table-column(label="动作ID" prop="belongTo")
      el-table-column(label="所属任务" prop="job")
      el-table-column(label="生成时间" prop="createAt")
        template(v-slot="scoped")
          span {{scoped.row.createAt | formatLastDate}}
      el-table-column(label="操作" width="240" align="center")
        template(v-slot="scoped")
          el-button(v-if="scoped.row.type==='error'" type="danger" size="mini" icon="el-icon-view" @click="handleSendNotice(scoped.row._id)") 发送错误通知

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
  handleSendNotice(logId: any) {
    this.$http.post('/notice/error', {
      log: logId
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
      .get('/log', {
        params: { ...this.page, ...this.filter }
      })
      .then(({ page, list }: any) => {
        this.page = page
        this.list = list
      })
  }
  mounted(): void {
    if (this.$route.query.job) {
      this.filter.job = <string>this.$route.query.job
      this.page.size = 50
    }
    this.getList()
  }
}
</script>

<style lang="less" scoped></style>
