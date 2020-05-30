<template lang="pug">
.page
  .section
    .sectionHeader 测试用例的爸爸叫测试故事
    .storyList
      .item(v-for="(story,storyIndex) in storyList" :key="storyIndex")
        .info
          .name {{story.name}}
          .description {{story.description}}
        .actionBar(@click="handleDispatch(story)") Test Ta！
  .section
    .sectionHeader 最近完成的测试任务
    .storyList.jobList
      .item(v-for="(job,jobIndex) in jobList" :key="jobIndex")
        .info
          .name {{job.name}}
          .description {{job.description}}
        .actionBar(@click="$router.push(`/log?job=${job._id}`)") 查看报告


</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class extends Vue {
  handleDispatch(story: any) {
    this.$prompt('请输入任务备注', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(({ value }: any) => {
        if (value) {
          return this.$http.post('/job', {
            name: `【${story.name}】的执行任务`,
            description: value,
            targetType: 'story',
            targetId: story._id,
            trigger: '手动',
            type: '单次'
          })
        } else {
          return Promise.reject()
        }
      })
      .then(() => {
        this.$router.push('/job')
      })
  }
  storyList: any[] = []
  jobList: any[] = []
  async getStoryList() {
    this.storyList = await this.$http.get('/story?size=0&isEnable=true')
  }
  async getJobList() {
    this.$http.get('/job?size=10&status=已完成').then((res: any) => {
      this.jobList = res.list
    })
  }
  mounted() {
    this.getStoryList()
    this.getJobList()
  }
}
</script>

<style lang="less" scoped>
.page {
  height: calc(100vh - 91px);
  color: @success;
}
.section {
  // .border(@success);
  width: 1000px;
  margin: 0 auto;
  .marginBottom(30px);
  .sectionHeader {
    .center;
    .padding;
    text-shadow: 0 0 2px @green;
  }
}
.storyList {
  display: flex;
  flex-wrap: wrap;
  .item {
    flex-basis: calc(20% - @gutter * 3);
    .square(200px, 150px);
    .marginRight(@gutter*3);
    .marginBottom(@gutter*3);
    .padding;
    .radius;
    .border(@primary);
    .boxShadow(@primary);
    background: @primary;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .info {
      .name {
        color: @green;
        .marginBottom;
      }
      .description {
        color: @info;
        .size(@s);
      }
    }
    .actionBar {
      background: @black;
      color: @green;
      .radius(20px);
      .center;
      .pointer;
      .boxShadow(@green);
      padding: 5px;
      &:hover {
        background: @green;
        color: @black;
      }
    }
    &:hover {
      .border(@green);
      .boxShadow(@green);
      background: @black;
    }
  }
}
.jobList {
  .item {
    .info {
      .name {
        color: @blue;
      }
    }
    .actionBar {
      background: @black;
      color: @blue;
      .boxShadow(@blue);
      &:hover {
        background: @blue;
        color: @black;
      }
    }
    &:hover {
      .border(@blue);
      .boxShadow(@blue);
    }
  }
}
</style>
