<template lang="pug">
.page.cardList
  el-card
    el-form(inline label-width="7em")
      el-form-item(label="名称")
        el-input(v-model="filter.name")
      el-form-item(label="类型")
        el-select(v-model="filter.type")
          el-option(value="") 全部
          el-option(v-for="i in ['单例','循环']" :key="i" :value="i")
    el-form(label-width="5em")
      el-form-item
        el-button(type="primary" @click="handleSearch") 搜索
        el-button(type="success" @click="handleAdd") 添加

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
            el-form-item(label="caseList")
              .actionList.actionListInTable
                .item(v-for="(i,n) in scoped.row.caseList" :key="n")
                  .name {{n+1}}. {{i.name}}
                  .description 描述：{{i.description}}
                  .description 动作：
                    el-button(type="warning" plain size="mini" v-for="(action,actionIndex) in i.actionList") {{action.name}}
      el-table-column(label="id" prop="_id")
      el-table-column(label="name" prop="name")
      el-table-column(label="description" prop="description")
      el-table-column(label="type" prop="type")
      el-table-column(label="isEnable" prop="isEnable")
        template(v-slot="scoped")
          el-button(v-if="scoped.row.isEnable" size="mini" type="success" icon="el-icon-check")
          el-button(v-else size="mini" type="warning" icon="el-icon-close")
      el-table-column(label="createAt" prop="createAt")
        template(v-slot="scoped")
          span {{scoped.row.createAt | formatLastDate}}
      el-table-column(label="操作" width="140" align="center")
        template(v-slot="scoped")
          el-button(type="success" icon="el-icon-magic-stick" circle @click="handleTriggerStory(scoped.row)")
          el-button(type="warning" icon="el-icon-edit" circle @click="handleEdit(scoped.row)")
          el-button(type="danger" icon="el-icon-delete" circle @click="handleDelete(scoped.row)")

  el-dialog(:title="editDialogData._id?'编辑':'添加'" :visible.sync="isShowEditDialog")
    el-form(label-width="6em")
      el-form-item(label="id" v-if="editDialogData._id")
        el-input(v-model="editDialogData._id" disabled)
      el-form-item(label="name")
        el-input(v-model="editDialogData.name")
      el-form-item(label="描述")
        el-input(v-model="editDialogData.description")
      el-form-item(label="caseList")
        .actionList(v-if="$store.getters['case/pickedList'].length")
          .item(v-for="(i,n) in $store.getters['case/pickedList']" :key="n")
            .name {{n+1}}. {{i.name}}
            .description 描述：{{i.description}}
            .description 动作：
              el-button(type="warning" plain size="mini" v-for="(action,actionIndex) in i.actionList") {{action.name||action}}
            .actionBar
              el-button-group
                el-button(type="warning" :disabled="n===0" icon="el-icon-top" size="mini" @click="$store.commit('case/moveUpPicked', i)")
                el-button(type="warning" :disabled="n===$store.getters['case/pickedList'].length-1" icon="el-icon-bottom" size="mini" @click="$store.commit('case/moveDownPicked', i)")
              el-button.rightBtn(type="danger" icon="el-icon-delete" size="mini" @click="$store.commit('case/deletePicked', i)")
        .actionList(v-else)
          el-button(type="warning" @click="$router.push('/actionManage/case')") 先去选择用例
    div(slot="footer")
      el-button(type="default" @click="isShowEditDialog=false") 取消
      el-button(type="primary" @click="handleSubmitEditDialog") 确定

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
    name: ''
  }
  isShowEditDialog: boolean = false
  editDialogData: any = {
    _id: '',
    name: '',
    description: '',
    caseList: [],
    type: '单例'
  }
  handleAdd() {
    this.editDialogData._id = ''
    this.editDialogData.name = ''
    this.editDialogData.description = ''
    this.isShowEditDialog = true
  }
  handleEdit(item: any) {
    this.editDialogData._id = item._id
    this.editDialogData.name = item.name
    this.editDialogData.description = item.description
    this.$store.commit('case/setPickedList', item.caseList)
    this.isShowEditDialog = true
  }
  handleSubmitEditDialog() {
    if (this.editDialogData._id) {
      this.$http
        .put(`/story/${this.editDialogData._id}`, {
          name: this.editDialogData.name,
          description: this.editDialogData.description,
          caseList: this.$store.getters['case/pickedList'].map(
            (o: any) => o._id
          ),
          type: '单例'
        })
        .then((res) => {
          this.$store.commit('case/clearPickedList')
          this.isShowEditDialog = false
          this.getList()
        })
    } else {
      this.$http
        .post('/story', {
          name: this.editDialogData.name,
          description: this.editDialogData.description,
          caseList: this.$store.getters['case/pickedList'].map(
            (o: any) => o._id
          ),
          type: '单例'
        })
        .then((res) => {
          this.$store.commit('case/clearPickedList')
          this.isShowEditDialog = false
          this.getList()
        })
    }
  }
  handleTriggerStory(item: any) {
    this.$prompt('请输入任务备注', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(({ value }: any) => {
        return this.$http.post('/job', {
          name: `【${item.name}】的执行任务`,
          description: value,
          story: item._id,
          trigger: '手动',
          type: '单次'
        })
      })
      .then(() => {
        this.$router.push('/job')
      })
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
      .get('/story', {
        params: { ...this.page, ...this.filter, relate: true }
      })
      .then(({ page, list }: any) => {
        this.page = page
        this.list = list
      })
  }
  mounted(): void {
    this.getList()
    if (this.$route.query.action === 'add') {
      this.isShowEditDialog = true
    }
  }
}
</script>

<style lang="less" scoped>
.actionList {
  .item {
    .border(@green);
    .marginBottom;
    .radius;
    .boxShadow(@green);
    background: @black;
    .name {
      color: @green;
      padding: 0 @gutter;
      .size(@l);
    }
    .description {
      color: @yellow;
      padding: 0 @gutter;
      .size(@s);
    }
    .actionBar {
      padding: 3px @gutter;
      display: flex;
      justify-content: space-between;
      .rightBtn {
        display: none;
      }
    }
    &:hover {
      .actionBar {
        .rightBtn {
          display: block;
        }
      }
    }
  }
}
.actionListInTable {
  display: flex;
  flex-wrap: wrap;
  .item {
    flex-shrink: 0;
    flex-basis: 400px;
    .marginRight;
  }
}
</style>
