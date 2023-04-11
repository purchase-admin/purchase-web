<template>
  <div class="app-container">
    <div class="com_title">待审核</div>
    <el-tabs v-model="queryReviewParams.processDefinitionKeyName"
             type="card"
             @tab-click="handleReviewQuery">
      <el-tab-pane label="全部"
                   name="ALL">
      </el-tab-pane>
      <el-tab-pane label="预算审核"
                   name="CGYS">
      </el-tab-pane>
      <el-tab-pane label="年度预算汇总审核"
                   name="YSHJSP">
      </el-tab-pane>
      <el-tab-pane label="采购申请审核(预算内)"
                   name="CGSQ">
      </el-tab-pane>
      <el-tab-pane label="采购申请审核(预算外)"
                   name="CGSQYSW">
      </el-tab-pane>
      <el-tab-pane label="供应商审核"
                   name="GYSZC">
      </el-tab-pane>
    </el-tabs>
    <el-table v-loading="review.loading"
              :data="review.list">
      <el-table-column label="序号"
                       align="center"
                       width="75px"
                       type="index" />
      <!--      <el-table-column label="任务ID" align="center" show-overflow-tooltip prop="id"/>-->
      <el-table-column label="流程标题"
                       align="center"
                       prop="processInstanceName" />
      <!--      <el-table-column label="流程名称" align="center" show-overflow-tooltip prop="processDefinitionName"/>-->
      <el-table-column label="任务节点名称"
                       align="center"
                       prop="name" />
      <el-table-column label="任务到达时间"
                       align="center"
                       prop="created" />
      <!--          <el-table-column label="办理人" align="center" prop="assignee.nickName"/>-->
      <!--      <el-table-column label="流程实例ID" align="center" show-overflow-tooltip prop="processInstanceId"/>-->
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-s-promotion"
                     @click="handleReviewSee(scope.row)">
            办理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="review.total>0"
                :total="review.total"
                :page.sync="queryReviewParams.pageNum"
                :limit.sync="queryReviewParams.pageSize"
                @pagination="getReviewList" />
  </div>
</template>

<script>
import { list as reviewList } from '@/api/budget/review'
export default {
  name: "index",
  data() {
    return {
      queryReviewParams: {
        pageNum: 1,
        pageSize: 10,
        state: 'running',
        processDefinitionKeyName: 'ALL',
      },
      review: {
        list: [],
        total: 0,
        loading: true,
      },
    };
  },
  mounted() {
    this.handleReviewQuery();
  },
  methods: {
    /** 待办查询tab选项卡操作 */
    handleReviewQuery() {
      this.queryReviewParams.pageNum = 1;
      this.getReviewList();
    },
    /** 查询待办 列表 */
    getReviewList() {
      this.review.loading = true;
      if (this.queryReviewParams.processDefinitionKeyName == 'ALL') {
        this.queryReviewParams.processDefinitionKey = '';
      } else {
        this.queryReviewParams.processDefinitionKey = this.queryReviewParams.processDefinitionKeyName;
      }
      reviewList(this.queryReviewParams).then(response => {
        this.review.list = response.rows;
        this.review.total = response.total;
        this.review.loading = false;
      })
    },
    handleReviewSee(row) {
      let id = 'running' === this.queryReviewParams.state ? row.id : row.processInstanceId;
      let keyRouter = row.processDefinitionKey;
      let routers = {
        CGYS: "/purchaseProject/budgetManagement/review/detail/",
        YSHJSP: "/purchaseProject/budgetManagement/summaryReview/detail/",
        CGSQ: "/purchaseProject/applyManagement/review/detail/",
        CGSQYSW: "/purchaseProject/applyManagement/review/detail/",
        GYSZC: "/purchaseProject/supplierManagement/review/detail/"
      };
      //正常跳转
      this.$router.push(`${routers[keyRouter]}` + id + '/' + row.businessKey + '/' + this.queryReviewParams.state)
      //外部跳转-pc
      // this.$router.push(`/outer/budgetManagement/review/detail/` + id + '/' + row.businessKey + '/' + this.queryParams.state)
      //外部跳转-mobile
      // this.$router.push(`/outer/mobile/budgetManagement/review/detail/` + id + '/' + row.businessKey + '/' + this.queryParams.state)
    },

  },
};
</script>

<style scoped lang="scss">
.com_title {
  padding-bottom: 20px;
  font-size: 20px;
}
</style>

