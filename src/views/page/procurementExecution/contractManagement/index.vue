<template>
  <div class="app">
    <div class="top">
      <div class="head-form">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="合同名称">
            <el-input v-model="form.htmc" placeholder="合同名称"></el-input>
          </el-form-item>
          <el-form-item label="签订日期范围">
            <el-date-picker
              type="date"
              placeholder="时间"
              v-model="form.qdrq"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="合同金额范围">
            <el-input
              v-model="form.htjefw"
              placeholder="合同金额范围"
            ></el-input>
          </el-form-item>
          <el-form-item label="合同标的">
            <el-input v-model="form.htbd" placeholder="合同标的"></el-input>
          </el-form-item>
          <el-form-item label="合同乙方">
            <el-input v-model="form.htyf" placeholder="合同乙方"></el-input>
          </el-form-item>
          <el-form-item label="采购类别">
            <el-select v-model="form.cglb" placeholder="采购类别">
              <el-option label="全部" value="0"></el-option>
              <el-option label="询价采购" value="1"></el-option>
              <el-option label="评选采购" value="2"></el-option>
              <el-option label="代理采购" value="2"></el-option>
            </el-select>
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
              prop="htmc"
              label="合同名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="htyf"
              label="合同乙方"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="htje"
              label="合同金额"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="htqdrq"
              label="合同签订日期"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="htfj"
              label="合同附件"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="cgsqd"
              label="采购申请单"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="cglb"
              label="采购类别"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="cgxq"
              label="采购详情"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="htxq"
              label="合同详情"
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
  name: "ContractManagement",
  components: {},
  props: {},
  data() {
    return {
      //查询
      form: {
        htmc: "",
        qdrq: "",
        htjefw: "",
        htbd: "",
        htyf: "",
        cglb: "0",
      },
      //table列表
      tableData: [
        {
          htmc: "",
          htyf: "",
          htje: "",
          htqdrq: "",
          htfj: "",
          cgsqd: "",
          cglb: "",
          cgxq: "",
          htxq: "",
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