<template>
  <!-- 采购任务 -->
  <div class="app-container">
    <task-select-filter @searchFun="emitHandleQuery"
                        :tabType="queryParams.isEnd"
                        searchPage="采购任务"></task-select-filter>
    <el-tabs v-model="queryParams.isEnd"
             type="card"
             @tab-click="tabChange">
      <el-tab-pane label="进行中"
                   name="2">
      </el-tab-pane>
      <el-tab-pane label="已过期"
                   name="3">
      </el-tab-pane>
    </el-tabs>
    <el-table v-loading="loading"
              :data="taskList">
      <el-table-column label="序号"
                       type="index"
                       width="55"
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
                       width="100"
                       align="center"
                       prop="deliveryDate" />
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
      <el-table-column label="是否中标"
                       v-if="queryParams.isEnd === '3'"
                       align="center"
                       prop="isCheck">
        <template slot-scope="scope">
          {{scope.row.endTime ? scope.row.isCheck : '未设置'}}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     v-if="!scope.row.executor"
                     @click="handleShow(scope.row)"
                     v-hasPermi="['task:edit']">指派</el-button>
          <el-button size="mini"
                     type="text"
                     v-else
                     @click="handleShow(scope.row)">查看</el-button>
          <el-button size="mini"
                     type="text"
                     v-show="scope.row.isCheck==='未定标' && queryParams.isEnd === '3'"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['purchase:apply:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改采购任务 对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="580px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="100px">
        <el-form-item label="项目"
                      prop="projectId">
          <el-input v-model="form.projectId"
                    placeholder="请输入项目" />
        </el-form-item>
        <el-form-item label="申请ID"
                      prop="applyId">
          <el-input v-model="form.applyId"
                    placeholder="请输入申请ID" />
        </el-form-item>
        <el-form-item label="执行人"
                      prop="executor">
          <el-input v-model="form.executor"
                    placeholder="请输入执行人" />
        </el-form-item>
        <el-form-item label="采购类型"
                      prop="purchaseType">
          <el-select v-model="form.purchaseType"
                     class="selectDefault"
                     placeholder="请选择采购类型">
            <el-option v-for="dict in purchaseTypeOptions"
                       :key="dict.dictValue"
                       :label="dict.dictLabel"
                       :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门ID"
                      prop="deptId">
          <el-input v-model="form.deptId"
                    placeholder="请输入部门ID" />
        </el-form-item>
        <el-form-item label="是否中标"
                      prop="isCheck">
          <el-select v-model="form.isCheck"
                     class="selectDefault"
                     placeholder="请选择是否中标">
            <el-option v-for="dict in isCheckOptions"
                       :key="dict.dictValue"
                       :label="dict.dictLabel"
                       :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中标供应商"
                      prop="checkedSupplierId">
          <el-input v-model="form.checkedSupplierId"
                    placeholder="请输入中标供应商" />
        </el-form-item>
        <el-form-item label="创建人"
                      prop="createdBy">
          <el-input v-model="form.createdBy"
                    placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="创建时间"
                      prop="createdTime">
          <el-date-picker clearable
                          size="small"
                          v-model="form.createdTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新人"
                      prop="updatedBy">
          <el-input v-model="form.updatedBy"
                    placeholder="请输入更新人" />
        </el-form-item>
        <el-form-item label="更新时间"
                      prop="updatedTime">
          <el-date-picker clearable
                          size="small"
                          v-model="form.updatedTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择更新时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTask, getTask, delTask, addTask, updateTask, exportTask } from "@/api/purchaseTask/task";
import TaskSelectFilter from '@/components/TaskSelectFilter';
export default {
  name: "Task",
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
      // 采购类型字典
      purchaseTypeOptions: [],
      // 是否中标字典
      isCheckOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        executor: null,
        purchaseType: null,
        deptId: null,
        isCheck: null,
        isEnd: '2',
        budgetType: '预算内',
        projectName: '',
      },
      mixinsParams: {},
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      cascaderProps: { expandTrigger: 'hover', value: 'id', label: 'label' },
    };
  },
  created() {
    this.getList();
    this.getDicts("budget_type").then(response => {
      this.purchaseTypeOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.isCheckOptions = response.data;
    });
  },
  methods: {
    tabChange() {
      // 只有状态是进行中的时候触发
      // 如果不是已过期，把这个是否定标属性去掉，免得影响查询，未过期中没有定标状态
      if (this.queryParams.isEnd != '3') {
        // this.queryParams.isCheck = null;
        this.mixinsParams.isCheck = null;
        this.handleQuery();
      }
    },
    /**打开指派详情 */
    handleShow(row) {
      console.log('点击勒')
      this.$router.push(`/purchaseProject/task/detail/${row.id}`)
    },
    /** 查询采购任务 列表 */
    getList() {
      this.loading = true;
      let params = Object.assign({}, this.queryParams, this.mixinsParams);
      listTask(params).then(response => {
        this.taskList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 采购类型字典翻译
    purchaseTypeFormat(row, column) {
      return this.selectDictLabel(this.purchaseTypeOptions, row.purchaseType);
    },
    // 是否中标字典翻译
    isCheckFormat(row, column) {
      return this.selectDictLabel(this.isCheckOptions, row.isCheck);
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
      const ids = row.taskId || this.ids;
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