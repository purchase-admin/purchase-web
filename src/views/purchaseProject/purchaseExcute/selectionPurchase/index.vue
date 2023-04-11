<template>
  <!--评选采购 -->
  <div class="app-container">
    <task-select-filter @searchFun="emitHandleQuery" searchPage="评选采购"></task-select-filter>
    <el-tabs v-model="queryParams.isCheck"
             type="card"
             @tab-click="handleQuery">
      <el-tab-pane label="未定标"
                   name="未定标">
      </el-tab-pane>
      <el-tab-pane label="已定标"
                   name="已定标">
      </el-tab-pane>
    </el-tabs>
    <el-table v-loading="loading"
              :data="taskList">
      <el-table-column label="序号"
                       type="index"
                       align="center" />
      <el-table-column label="项目"
                       align="center"
                       show-overflow-tooltip
                       min-width="200px"
                       prop="projectName" />
      <el-table-column label="是否预算内"
                       align="center"
                       prop="budgetType">
        <template slot-scope="scope">
          {{scope.row.budgetType ? scope.row.budgetType : '未设置'}}
        </template>
      </el-table-column>
      <el-table-column label="预算金额"
                       align="center"
                       prop="budgetCost" />
      <el-table-column label="交付日期"
                       align="center"
                       width="96"
                       prop="deliveryDate" />
      <el-table-column label="询价截止日期"
                       align="center"
                       width="160"
                       prop="endTime">
        <template slot-scope="scope">
          {{scope.row.endTime ? scope.row.endTime : '未设置'}}
        </template>
      </el-table-column>
      <el-table-column label="推荐品牌"
                       align="center"
                       prop="supplier">
        <template slot-scope="scope">
          {{scope.row.supplier ? scope.row.supplier : '未设置'}}
        </template>
      </el-table-column>
      <el-table-column label="申购部门"
                       align="center"
                       prop="deptName" />
      <el-table-column label="部门联系人"
                       align="center"
                       prop="userName" />
      <el-table-column label="部门联系人电话"
                       align="center"
                       prop="userPhone" />
      <el-table-column label="操作"
                       align="center"
                       width="100"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleShow(scope.row)">评选</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     v-if="scope.row.endTime"
                     @click="handleShow(scope.row, 'updated')">编辑</el-button>
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
import TaskSelectFilter from '@/components/TaskSelectFilter';
import { listPurchaseTaskToDolistTask as listTask, getTask, delTask, addTask, updateTask, exportTask } from "@/api/purchaseTask/task";
export default {
  name: "SelectionPurchase",
  components: {
    TaskSelectFilter
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
      // 总条数
      total: 0,
      // 采购任务 表格数据
      taskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        executor: null,
        purchaseType: null,
        deptId: null,
        type: null,
        isCheck: '未定标',
        budgetType: '预算内',
      },
      mixinsParams: {},
      // 表单参数
      form: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**打开指派详情 */
    handleShow(row, updated) {
      console.log('row', row, `/purchaseExcute/selectionPurchase/${row.id}`)
      if (updated) {
        this.$router.push(`/purchaseProject/purchaseExcute/selectionPurchase/detail/${row.id}/${updated}`)
        return;
      }
      this.$router.push(`/purchaseProject/purchaseExcute/selectionPurchase/detail/${row.id}/空`)
    },
    /** 查询采购任务 列表 */
    getList() {
      this.loading = true;
      this.queryParams.purchaseType = '2';
      listTask(Object.assign({}, this.queryParams, this.mixinsParams)).then(response => {
        this.taskList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        applyId: null,
        executor: null,
        purchaseType: null,
        deptId: null,
        isCheck: null,
        checkedSupplierId: null,
        createdBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    emitHandleQuery(data) {
      console.log('传递过来的值', data)
      this.mixinsParams = data;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加采购任务 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTask(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改采购任务 ";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTask(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTask(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除采购任务 编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delTask(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
  }
};
</script>
<style lang="scss">
.selectDefault {
  width: 100%;
}
</style>