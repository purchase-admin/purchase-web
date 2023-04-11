<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="68px">
      <el-form-item label="项目id"
                    prop="projectId">
        <el-input v-model="queryParams.projectId"
                  placeholder="关联预算中对应项目id"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="年份"
                    prop="budgetYear">
        <el-input v-model="queryParams.budgetYear"
                  placeholder="关联预算中对应的年份"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-table-column type="selection"
                       width="55"
                       align="center" /> -->
    <el-table v-loading="loading"
              :data="applyList">
      <el-table-column label="序号"
                       align="center"
                       type="index"
                       fixed
                       width="55"/>
      <el-table-column label="id"
                       align="center"
                       width="360px"
                       prop="id" />
      <el-table-column label="流程名称"
                       align="center"
                       prop="name" />
       <el-table-column label="流程key"
                       align="center"
                       prop="key" />
      <el-table-column label="当前版本号"
                       align="center"
                       prop="version" />
      <!-- <el-table-column label="已修改版本号"
                       align="center"
                       prop="latestVersion" />   -->
      <el-table-column label="状态"
                       align="center"
                       prop="deploymentId">
          <template slot-scope="scope">
            {{scope.row.deploymentId ? "已部署":"未部署"}}
          </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间"
                       align="center"
                       prop="createTime"
                       width="180">
        <template slot-scope="scope">
          {{scope.row.createTime}}
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作"
                       align="center"
                       width="100"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button size="mini"
                     type="text"
                     icon="el-icon-s-platform"
                     @click="handleDeployment(scope.row)">启用版本</el-button> -->
          <el-button size="mini"
                     type="text"
                     icon="el-icon-view"
                     @click="handleView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

  </div>
</template>

<script>
import { listHistoryApply, deployBpmnModelApply } from "@/api/purchase/workflow";

export default {
  name: "Apply",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 采购申请 表格数据
      applyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        budgetYear: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询采购申请 列表 */
    getList() {
      this.loading = true;
      listHistoryApply(this.$route.params.id,this.queryParams).then(response => {
        this.applyList = response.rows;
        this.total = response.total;
        this.loading = false;
        console.log('返回值',response)
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        projectId: null,
        budgetYear: null,
        deptId: null,
        userId: null,
        userPhone: null,
        num: null,
        budgetMoeny: null,
        deliveryDay: null,
        reason: null,
        specification: null,
        supplier: null,
        supplierUsername: null,
        supplierPhone: null,
        budgetType: null,
        isOk: null,
        purchaseOperator: null,
        status: "0",
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /**选择当前版本 */
    handleDeployment(row) {
       this.$confirm(`是否要设置当前版本为新版本：${row.name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return deployBpmnModelApply(row.id);
      }).then(() => {
        this.getList();
        this.msgSuccess("部署成功");
      })
    },
    /**查看详情 */
    handleView(row) {
      this.$router.push(`/workflow/manageEditor/${row.deploymentId}/${row.resource}`)
    },
  }
};
</script>
