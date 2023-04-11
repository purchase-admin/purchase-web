<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="68px">
      <el-form-item label="预算年份"
                    prop="year">
        <el-date-picker v-model="queryParams.year"
                        type="year"
                        value-format="yyyy"
                        placeholder="选择预算年份">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="填报部门"
                    prop="deptId">
        <el-cascader
            v-model="queryParams.deptId"
            :options="cascaderDeptOptions"
            :props="cascaderProps"
            @change="handleCascaderChangeThree"></el-cascader>
      </el-form-item> -->

      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索
        </el-button>
        <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd">新增
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   >删除
        </el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                  >导出
        </el-button>
      </el-col> -->
    </el-row>
    <!-- @selection-change="handleSelectionChange" -->
    <el-table v-loading="loading"
              :data="budgetList">
      <!-- <el-table-column type="selection"
                       width="55"
                       align="center" /> -->
      <el-table-column label="序号"
                       align="center"
                       width="55"
                       type="index" />
      <el-table-column label="标题"
                       align="center"
                       min-width="200"
                       show-overflow-tooltip
                       prop="title" />
      <el-table-column label="填报部门"
                       align="center"
                       min-width="100"
                       show-overflow-tooltip
                       prop="deptName" />
      <el-table-column label="年份"
                       align="center"
                       width="80"
                       prop="year" />
      <el-table-column label="预算条数"
                       align="center"
                       width="80"
                       prop="budgetNum" />
      <el-table-column label="预算金额(元)"
                       align="center"
                       prop="totalMoney" />
      <el-table-column label="申报人"
                       align="center"
                       prop="createBy" />
      <el-table-column label="申报时间"
                       align="center"
                       width="150"
                       prop="createTime" />
      <el-table-column label="当前审批环节"
                       align="center"
                       prop="taskName" />
      <el-table-column label="当前办理人"
                       align="center"
                       prop="assignee" />
      <el-table-column label="流程状态"
                       align="center"
                       prop="status">
        <template slot-scope="scope">
          {{ statusNames[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="160"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-search"
                     @click="handleSee(scope.row)">查看
          </el-button>
          <el-button size="mini"
                     type="text"
                     v-show="scope.row.status=='0' && scope.row.budgetNum > 0"
                     icon="el-icon-s-promotion"
                     @click="handleSubmitFlow(scope.row)">提交
          </el-button>
          <el-button size="mini"
                     type="text"
                     style="color: #F56C6C"
                     icon="el-icon-delete"
                     v-show="scope.row.status=='0'"
                     @click="handleDelete(scope.row)">删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改采购预算 对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               label-width="80px">
        <el-form-item label="填报部门"
                      prop="deptId">
          <!-- <el-input v-model="form.deptId"
                    placeholder="请输入填报部门" /> -->
          <el-cascader clearable
                       :show-all-levels="false"
                       style="width:100%"
                       v-model="form.deptId"
                       :options="cascaderDeptOptions"
                       :props="cascaderProps"
                       disabled></el-cascader>
        </el-form-item>
        <el-form-item label="填写年份"
                      prop="year">
          <!-- <el-input v-model="form.budgetYear"
                    placeholder="请输入预算年份" /> -->
          <el-date-picker v-model="form.year"
                          type="year"
                          format="yyyy"
                          value-format="yyyy"
                          placeholder="选择年">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import defaultSettings from '@/settings'
import { list, add, del } from '@/api/budget/budgetBatch'
import { mapState } from 'vuex'
import { treeselect as deptTreeselect } from '@/api/system/dept'
import { startBudgetBatchProcess } from '@/api/budget/budgetBatch'

export default {
  name: 'Budget',
  components: {},
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
      // 采购预算 表格数据
      budgetList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      statusNames: {},
      // 表单参数
      form: {},
      queryParams: {},
      cascaderDeptOptions: [],//部门
      cascaderProps: { expandTrigger: 'hover', value: 'id', label: 'label' }
    }
  },
  computed: {
    ...mapState({
      'deptId': state => state.user.deptId,
      'userId': state => state.user.userId
    })
  },
  created() {
    this.statusNames = defaultSettings.states;
    this.getList()
    this.getSelectOneThree()
  },
  methods: {
    /**获取部门分类树节点 */
    getSelectOneThree() {
      deptTreeselect().then(response => {
        console.log(response.data)
        this.cascaderDeptOptions = response.data
      })
    },
    //  提交勾选的数据走流程
    handleSubmitFlow(row) {
      // 预算条数大于0，提交确认
      this.$confirm('确认提交吗?', "确认", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const startParams = {}
        startParams.processDefinitionKey = this.$route.meta.params.KEY
        startParams.businessKey = row.id
        startParams.title = row.title
        return startBudgetBatchProcess(startParams);
      }).then((res) => {
        this.msgSuccess(res.msg)
        this.getList()
      })
    },
    /** 查询采购预算 列表 */
    getList() {
      this.loading = true
      list(this.queryParams).then(response => {
        this.budgetList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        year: null,
        deptId: this.deptId
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加部门采购预算 '
    },
    /** 查看按钮操作 */
    handleSee(row) {
      this.$router.push('/purchaseProject/budgetManagement/budget/detail/' + row.id + '/' + row.status)
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) return true;
          add(this.form).then(response => {
            this.msgSuccess('新增成功')
            this.open = false
            this.getList()
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除部门采购预算 编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return del(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
  }
}
</script>
