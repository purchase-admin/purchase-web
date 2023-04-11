<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="68px">
      <el-form-item label="项目"
                    prop="projectId">
        <!-- <el-select v-model="queryParams.projectId"
                   placeholder="请选择项目"
                   clearable
                   size="small">
          <el-option label="请选择字典生成"
                     value="" />
        </el-select> -->
        <el-cascader clearable
                     :show-all-levels="false"
                     v-model="queryParams.projectId"
                     :options="cascaderOptions"
                     :props="cascaderProps"
                     @change="handleCascaderChangeOne"></el-cascader>
      </el-form-item>
      <!-- <el-form-item label="填报部门"
                    prop="deptId">
        <el-cascader
            v-model="queryParams.deptId"
            :options="cascaderDeptOptions"
            :props="cascaderProps"
            @change="handleCascaderChangeThree"></el-cascader>
      </el-form-item> -->
      <el-form-item label="填报人"
                    prop="nickName">
        <el-input v-model="queryParams.nickName"
                  placeholder="请输入填报人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="规格型号"
                    prop="specification">
        <el-input v-model="queryParams.specification"
                  placeholder="请输入规格型号、技术要求"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="资金来源"
                    prop="moneyFrom">
        <el-select v-model="queryParams.moneyFrom"
                   placeholder="请选择资金来源"
                   clearable
                   size="small">
          <el-option v-for="dict in moneyFromOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue" />
        </el-select>
      </el-form-item>
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
                   v-if="params.status === '0'"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   plain
                   v-if="params.status === '0'"
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   v-if="params.status === '0'"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete">删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch"
                     @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              :data="budgetList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="序号"
                       align="center"
                       width="55"
                       type="index" />
      <!-- <el-table-column label="预算编号"
                       align="center"
                       prop="id"
      /> -->
      <el-table-column label="项目"
                       align="center"
                       min-width="200"
                       show-overflow-tooltip
                       prop="projectName" />
      <el-table-column label="预算年份"
                       align="center"
                       prop="batchYear" />
      <el-table-column label="填报部门"
                       align="center"
                       min-width="100px"
                       show-overflow-tooltip
                       prop="deptName" />
      <el-table-column label="填报人"
                       align="center"
                       prop="nickName" />
      <el-table-column label="规格型号"
                       align="center"
                       show-overflow-tooltip
                       prop="specification" />
      <el-table-column label="资金来源"
                       align="center"
                       :formatter="moneyFromFormat"
                       prop="moneyFrom" />
      <el-table-column label="预算金额"
                       align="center"
                       prop="budgetMoney" />
      <el-table-column label="数量"
                       align="center"
                       prop="num" />
      <el-table-column label="备注"
                       align="center"
                       prop="remark"
                       min-width="80"
                       show-overflow-tooltip />
      <!-- <el-table-column label="创建人"
                       align="center"
                       prop="createBy"
      /> -->
      <el-table-column label="填报日期"
                       align="center"
                       prop="createTime"
                       width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="100"
                       v-if="params.status === '0'"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)">修改
          </el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
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
               :rules="rules"
               label-width="102px">
        <el-form-item label="填报部门"
                      prop="deptId">
          <el-cascader clearable
                       :show-all-levels="false"
                       style="width:100%"
                       v-model="form.deptId"
                       :options="cascaderDeptOptions"
                       :props="cascaderProps"
                       disabled
                       @change="handleCascaderChangeFour"></el-cascader>
        </el-form-item>
        <el-form-item label="填报人">
          <el-input v-model="nickName"
                    disabled
                    placeholder="请输入填报人" />
        </el-form-item>
        <el-form-item label="项目"
                      prop="projectId">
          <el-cascader clearable
                       :show-all-levels="false"
                       style="width:100%"
                       v-model="form.projectId"
                       :options="cascaderOptions"
                       :props="cascaderProps"
                       @change="handleCascaderChangeTwo"></el-cascader>
        </el-form-item>
        <el-form-item label="规格型号"
                      prop="specification">
          <el-input v-model="form.specification"
                    placeholder="请输入规格型号、技术要求" />
        </el-form-item>
        <el-form-item label="资金来源"
                      prop="moneyFrom">
          <el-select v-model="form.moneyFrom"
                     placeholder="请选择资金来源">
            <el-option v-for="dict in moneyFromOptions"
                       :key="dict.dictValue"
                       :label="dict.dictLabel"
                       :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="预算金额(元)"
                      prop="budgetMoney">
          <el-input type="number"
                    v-model.number="form.budgetMoney"
                    placeholder="请输入预算金额" />
        </el-form-item>
        <el-form-item label="数量"
                      prop="num">
          <el-input type="number"
                    v-model.number="form.num"
                    placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="备注"
                      prop="remark">
          <el-input v-model="form.remark"
                    type="textarea"
                    placeholder="请输入内容" />
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
import {
  listBudget,
  getBudget,
  delBudget,
  addBudget,
  updateBudget,
  exportBudget
} from '@/api/budget/budget'
import { projectTypeTreeselect } from '@/api/system/projectType'
import { treeselect as deptTreeselect } from '@/api/system/dept'
import { mapState } from 'vuex'

export default {
  name: 'BudgetDetail',
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        budgetYear: null,
        deptId: null,
        nickName: null,
        specification: null,
        moneyFrom: null,
        batchId: null,
      },
      //数据字典-资金来源
      moneyFromOptions: [],
      //级联配置
      cascaderOptions: [],//项目
      cascaderDeptOptions: [],//部门
      cascaderProps: { expandTrigger: 'hover', value: 'id', label: 'label' },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        projectId: [
          { required: true, message: '项目不能为空', trigger: 'change' }
        ],
        budgetYear: [
          { required: true, message: '预算年份不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '填报部门不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '填报人不能为空', trigger: 'blur' }
        ],
        moneyFrom: [
          { required: true, message: '资金来源不能为空', trigger: 'change' }
        ],
        budgetMoney: [
          { required: true, message: '预算金额不能为空', trigger: 'blur' },
          { type: 'number', min: 1, message: '预算金额不能小于1', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '数量不能为空', trigger: 'blur' },
          { type: 'number', min: 1, message: '数量不能小于1', trigger: 'blur' }
        ],

      },
      // 父页面传来的值
      params: null
    }
  },
  computed: {
    ...mapState({
      'deptId': state => state.user.deptId,
      'userId': state => state.user.userId,
      'nickName': state => state.user.nickName
    })
  },
  created() {
    this.params = this.$route.params;
    this.getList();
    this.getSelectThree();
    this.getSelectOneThree();
    this.getDicts("ZJLY").then((response) => {
      this.moneyFromOptions = response.data;
    });
    // console.log(this.$store.state.user,this.deptId,this.userId)

  },
  methods: {
    // 资金来源字典翻译
    moneyFromFormat(row, column) {
      return this.selectDictLabel(this.moneyFromOptions, row.moneyFrom)
    },
    /**项目级联选择触发 */
    handleCascaderChangeOne(value) {
      // console.log('级联选择触发-项目-查询条件', value, value[value.length - 1])
      this.queryParams.projectId = value.length >= 1 ? value[value.length - 1] : "";
    },
    handleCascaderChangeTwo(value) {
      // console.log('级联选择触发-项目-编辑', value)
      this.form.projectId = value.length >= 1 ? value[value.length - 1] : "";
    },
    handleCascaderChangeThree(value) {
      // console.log('级联选择触发-部门-查询条件', value, value[value.length - 1])
      this.queryParams.deptId = value.length >= 1 ? value[value.length - 1] : "";
    },
    handleCascaderChangeFour(value) {
      // console.log('级联选择触发-部门-编辑', value)
      this.form.deptId = value.length >= 1 ? value[value.length - 1] : "";
    },
    /**获取项目分类树节点 */
    getSelectThree() {
      projectTypeTreeselect().then(response => {
        console.log(response.data)
        this.cascaderOptions = response.data
      })
    },
    /**获取部门分类树节点 */
    getSelectOneThree() {
      deptTreeselect().then(response => {
        console.log(response.data)
        this.cascaderDeptOptions = response.data
      })
    },
    /** 查询采购预算 列表 */
    getList() {
      this.loading = true
      this.queryParams.batchId = this.params.id;
      this.queryParams.deptId = this.deptId;
      console.log(this.params, this.deptId)
      listBudget(this.queryParams).then(response => {
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
        id: null,
        projectId: null,
        budgetYear: null,
        deptId: this.deptId,
        userId: this.userId,
        specification: null,
        moneyFrom: null,
        budgetMoney: null,
        remark: null,
        num: null
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
      this.title = '添加采购预算 '
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBudget(id).then(response => {
        let obj = response.data;
        obj.budgetMoney = +(response.data.budgetMoney);
        this.form = obj;
        this.open = true;
        this.title = '修改采购预算';
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.batchId = this.params.id;
          if (this.form.id != null) {
            updateBudget(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBudget(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除采购预算 编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delBudget(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有采购预算 数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return exportBudget(queryParams)
      }).then(response => {
        this.download(response.msg)
      })
    }
  }
}
</script>
