<template lang="pug">
.page.cardList
  el-card
    el-form(inline label-width="7em")
      el-form-item(label="isEnable")
        el-select(v-model="filter.isEnable")
          el-option(value="") 全部
          el-option(value="true")
          el-option(value="false")
      el-form-item(label="名称")
        el-input(v-model="filter.name")
      el-form-item(label="类型")
        el-select(v-model="filter.type")
          el-option(value="") 全部
          el-option(v-for="i in ['单例','循环']" :key="i" :value="i")
      el-form-item(label="description")
        el-input(v-model="filter.description")
    el-form(label-width="5em")
      el-form-item
        el-button(type="primary" icon="el-icon-search" @click="handleSearch") Search
        el-button(type="success" icon="el-icon-plus" @click="handleAdd") Add

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
            el-form-item(label="actionList")
              .actionList.actionListInTable
                .item(v-for="(i,n) in scoped.row.actionList" :key="n")
                  .name {{n+1}}. {{i.name}}
                  .description 描述：{{i.description}}
                  .description 参数：
                    el-button(type="warning" plain size="mini" v-if="i.body.length") body: {{i.body.length}}个
                    el-button(type="warning" plain size="mini" v-if="i.query.length") query: {{i.query.length}}个
                    el-button(type="warning" plain size="mini" v-if="i.path.length") path: {{i.path.length}}个
                    el-button(type="warning" plain size="mini" v-if="i.header.length") header: {{i.header.length}}个
                  .description 验证：
                    el-button(type="warning" plain size="mini" v-for="(rule,ruleIndex) in i.rule" :key="ruleIndex") {{rule.name}}
                  .description 输出：
                    el-button(type="warning" plain size="mini" v-for="(output,outputIndex) in i.output" :key="outputIndex") {{output.name}}
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
      el-table-column(label="操作" width="500")
        template(v-slot="scoped")
          el-button(type="success" size="mini" icon="el-icon-check" @click="handleTrigger(scoped.row)") 执行
          el-button(type="success" size="mini" icon="el-icon-check" @click="handleAddItemToCart(scoped.row)") 加入购物车
          el-button(type="warning" size="mini" @click="handleAddOtherCase(scoped.row)") + otherStory
          el-button(type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scoped.row)") 编辑
          el-button(type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scoped.row)") 删除

  el-dialog(:title="editDialogData._id?'编辑':'添加'" :visible.sync="isShowEditDialog")
    el-form(label-width="6em")
      el-form-item(label="id" v-if="editDialogData._id")
        el-input(v-model="editDialogData._id" disabled)
      el-form-item(label="名称")
        el-input(v-model="editDialogData.name")
      el-form-item(label="备注")
        el-input(v-model="editDialogData.description")
      el-form-item(label="动作列表")
        .actionList(v-if="$store.getters['action/pickedList'].length")
          .item(v-for="(i,n) in $store.getters['action/pickedList']" :key="n")
            .name {{n+1}}. {{i.name}}
            .description 描述：{{i.description}}
            .description 参数：
              el-button(type="warning" plain size="mini" v-if="i.body.length") body: {{i.body.length}}个
              el-button(type="warning" plain size="mini" v-if="i.query.length") query: {{i.query.length}}个
              el-button(type="warning" plain size="mini" v-if="i.path.length") path: {{i.path.length}}个
              el-button(type="warning" plain size="mini" v-if="i.header.length") header: {{i.header.length}}个
            .description 验证：
              el-button(type="warning" plain size="mini" v-for="(rule,ruleIndex) in i.rule" :key="ruleIndex") {{rule.name}}
            .description 输出：
              el-button(type="warning" plain size="mini" v-for="(output,outputIndex) in i.output" :key="outputIndex") {{output.name}}
              el-button(type="success" plain size="mini" icon="el-icon-plus" @click="handleAddOutput(i)")
            .actionBar
              el-button-group
                el-button(type="warning" :disabled="n===0" icon="el-icon-top" size="mini" @click="$store.commit('action/moveUpPicked', i)")
                el-button(type="warning" :disabled="n===$store.getters['action/pickedList'].length-1" icon="el-icon-bottom" size="mini" @click="$store.commit('action/moveDownPicked', i)")
              div.btns
                el-button.rightBtn(type="info" icon="el-icon-edit" size="mini" @click="handleEditAction(i)")
                el-button.rightBtn(type="danger" icon="el-icon-delete" size="mini" @click="$store.commit('action/deletePicked', i)")
        .actionList(v-else)
          el-button(type="warning" @click="$router.push('/actionManage/action')") 先去选择动作
    div(slot="footer")
      el-button(type="default" @click="isShowEditDialog=false") 取消
      el-button(type="primary" @click="handleSubmitEditDialog") 确定

  el-dialog(title="编辑输出规则" :visible.sync="isShowEditOutputDialog")
    el-form(label-width="8em")
      el-form-item(label="输出字段")
        el-input(v-model="editOutputDialogData.name")
      el-form-item(label="来源字段名")
        el-input(v-model="editOutputDialogData.source")
      el-form-item(label="输出目标类型")
        el-select(v-model="editOutputDialogData.targetType")
          el-option(v-for="(i,n) in ['global','job','story','case','action']" :key="n" :value="i")
      el-form-item(label="target" v-if="!['global','case'].includes(editOutputDialogData.targetType)")
        el-input(v-model="editOutputDialogData.target")
    div(slot="footer")
      el-button(type="default" @click="isShowEditOutputDialog=false") 取消
      el-button(type="primary" @click="handleSubmitEditOutputDialog") 确定

  .floatButton
    el-button(type="success" icon="el-icon-shopping-cart-1" size="large" circle @click="isShowCartDialog=true")
  el-drawer(title="已加入购物车的用例列表" :visible.sync="isShowCartDialog")
    .drawerContainer
      .drawerList
        .item(v-for="(i,n) in $store.getters['case/pickedList']" :key="n")
          .name 【{{n+1}}】{{i.name}}
          .description {{i.description}}
          .actionBar
            el-button-group
              el-button(type="warning" :disabled="n===0" icon="el-icon-top" size="mini" @click="$store.commit('case/moveUpPicked', i)")
              el-button(type="warning" :disabled="n===$store.getters['case/pickedList'].length-1" icon="el-icon-bottom" size="mini" @click="$store.commit('case/moveDownPicked', i)")
            el-button.rightBtn(type="danger" icon="el-icon-delete" size="mini" @click="$store.commit('case/deletePicked', i)")
      .extendContainer
        el-button(type="success" @click="$router.push('/actionManage/story?action=add')") 生成故事
  el-dialog(title="添加到其他story" :visible.sync="isShowOtherCase")
      el-table(:data="storyList" )
        el-table-column(prop="name" label="name")
        el-table-column(prop="description" label="description" )
        el-table-column(label="操作" width="100")
          template(v-slot="scoped")
            el-button( size="mini" type="success" icon="el-icon-plus" @click="addHandleStory(scoped.row)") 加入
        //- el-table-column(prop="type" label="type" width="180")
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
    name: '',
    description: '',
    isEnable: '',
    type: '',
  }
  isShowEditDialog: boolean = false
  editDialogData: any = {
    _id: '',
    name: '',
    description: '',
    actionList: [],
    type: '单例',
  }
  isShowCartDialog: boolean = false
  isShowEditOutputDialog: boolean = false
  currentActionIdForEditOutput: string = ''
  editOutputDialogData: any = {
    _id: '',
    name: '',
    source: '',
    target: '',
    targetType: 'case',
  }
  storyList = []
  addStoryItem: any = {}
  isShowOtherCase: boolean = false
  handleTrigger(item: any) {
    this.$prompt('请输入任务备注', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(({ value }: any) => {
        return this.$http.post('/job', {
          name: `【${item.name}】的执行任务`,
          description: value,
          targetType: 'case',
          targetId: item._id,
          trigger: '手动',
          type: '单次',
        })
      })
      .then(() => {
        this.$router.push('/job')
      })
  }
  handleEditAction(i: any) {
    this.$router.push(`/actionManage/action/edit/${i._id}`)
  }
  handleAddOutput(action: any) {
    this.currentActionIdForEditOutput = action._id
    this.editOutputDialogData = {
      _id: '',
      name: '',
      source: '',
      target: this.editDialogData._id || '',
      targetType: 'case',
    }
    this.isShowEditOutputDialog = true
  }
  handleSubmitEditOutputDialog() {
    if (this.editOutputDialogData._id) {
      this.$store.commit('action/editOutput', {
        actionId: this.currentActionIdForEditOutput,
        output: this.editOutputDialogData,
      })
    } else {
      this.$store.dispatch('action/addOutput', {
        actionId: this.currentActionIdForEditOutput,
        output: this.editOutputDialogData,
      })
    }
    this.isShowEditOutputDialog = false
  }
  handleAddItemToCart(item: any) {
    this.$store.commit('case/addPicked', item)
    this.isShowCartDialog = true
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
    this.$store.commit('action/setPickedList', item.actionList)
    this.isShowEditDialog = true
  }
  handleSubmitEditDialog() {
    if (this.editDialogData._id) {
      this.$http
        .put(`/case/${this.editDialogData._id}`, {
          name: this.editDialogData.name,
          description: this.editDialogData.description,
          actionList: this.$store.getters['action/pickedList'].map(
            (o: any) => o._id
          ),
          type: '单例',
        })
        .then((res) => {
          this.$store.commit('action/clearPickedList')
          this.isShowEditDialog = false
          this.getList()
        })
    } else {
      this.$http
        .post('/case', {
          name: this.editDialogData.name,
          description: this.editDialogData.description,
          actionList: this.$store.getters['action/pickedList'].map(
            (o: any) => o._id
          ),
          type: '单例',
        })
        .then((res) => {
          this.$store.commit('action/clearPickedList')
          this.isShowEditDialog = false
          this.getList()
        })
    }
  }
  handleDelete(item: any) {
    this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      type: 'warning',
    })
      .then(() => {
        return this.$http.delete(`/case/${item._id}`)
      })
      .then(() => {
        this.getList()
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
      })
  }
  handleAddOtherCase(item: any) {
    this.getStoryList()
    this.addStoryItem = item
    this.isShowOtherCase = true
  }
  addHandleStory(row: any) {
    this.$http
      .put(`/story/${row._id}`, {
        name: row.name,
        description: row.description,
        caseList: [...row.caseList, this.addStoryItem._id],
      })
      .then((res) => {
        this.isShowOtherCase = false
        this.getStoryList()
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
      .get('/case', {
        params: { ...this.page, ...this.filter, relate: true },
      })
      .then(({ page, list }: any) => {
        this.page = page
        this.list = list
      })
  }
  getStoryList() {
    this.$http.get('/story', { params: { size: 0 } }).then((res: any) => {
      this.storyList = res
      // console.log(this.storyList)
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
.btns {
  display: flex;
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
