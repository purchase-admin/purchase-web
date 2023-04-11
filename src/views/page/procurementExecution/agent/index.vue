<template>
  <div class="app">
    <div class="top">
      <div class="head-form">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="项目名称">
            <el-input v-model="form.name" placeholder="项目名称"></el-input>
          </el-form-item>
          <el-form-item label="执行人">
            <el-input v-model="form.people" placeholder="执行人"></el-input>
          </el-form-item>
          <el-form-item label="任务状态">
            <el-select v-model="form.state" placeholder="请选择">
              <el-option label="未分发" value="0"></el-option>
              <el-option label="采购执行中" value="1"></el-option>
              <el-option label="采购已完成" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              type="date"
              placeholder="时间"
              v-model="form.date"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="onRefer"
              icon="el-icon-search"
              >查询</el-button
            >
          </el-form-item>
           <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="goTochild"
              icon="el-icon-search"
              >测试跳入内页</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <!-- table列表 -->
        <div class="table">
          <el-table
            ref="table"
            :data="tableData"
            tooltip-effect="dark"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            stripe
            border
          >
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column
              type="index"
              label="序号"
              width="60"
            ></el-table-column>
            <el-table-column
              prop="xmmc"
              label="项目名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="sfysn"
              label="是否预算内"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="ysje"
              label="预算金额"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="jfrq"
              label="交付日期"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="sgbm"
              label="申购部门"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="sgbmlxr"
              label="申购部门联系人"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="zxr"
              label="任务执行人"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="sgsqb"
              label="采购申请表详情"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="zbgys"
              label="中标供应商"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="zbje"
              label="中标金额"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="cgxq"
              label="采购详情"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="footer">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10]"
        :page-size="pageSize"
        layout="total,  prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Agent",
  components: {},
  props: {},
  data() {
    return {
      //查询
      form: {
        name: "",
        people: "",
        state: "0",
        date: "",
      },
      //table列表
      tableData: [
        {
          xmmc: "",
          sfysn: "",
          ysje: "",
          jfrq: "",
          sgbm: "",
          sgbmlxr: "",
          zxr: "",
          sgsqb: "",
          zbgys: "",
          zbje: "",
          cgxq: "",
        },
      ],
      // 分页
      total: 0,
      currentPage: null,
      page: 1,
      pageSize: 10,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //查询
    onRefer() {},
    //重置
    rest() {},
    //新增/编辑
    onAdd() {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`${val} 页`);
      this.page = val;
    },
    goTochild() {
      console.log('跳入内页')
      this.$router.push('/procurementExecution/agent/'+123)
    }
  },
};
</script>
<style lang="scss" scoped>
.app {
  padding: 30px;
  .footer {
    float: right;
    margin-top: 20px;
  }
}
</style>