<template>
  <!-- 采购申请 内页 详情列表页-->
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="68px">
      <el-form-item label="项目名称"
                    prop="projectName">
        <el-input v-model="queryParams.projectName"
                  placeholder="请输入项目名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="交付日期"
                    prop="deliveryDate">
        <el-date-picker clearable
                        size="small"
                        v-model="queryParams.deliveryDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择交付日期">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="预算类型"
                    prop="budgetType">
        <el-select v-model="queryParams.budgetType"
                   placeholder="请选择项目预算类型"
                   clearable
                   size="small">
          <el-option v-for="item in budgetTypeOptions" :key="item.label" :label="item.label"
                     :value="item.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="预算项目"
                    prop="projectId">
        <el-cascader clearable
                     :show-all-levels="false"
                     v-model="queryParams.projectId"
                     :options="cascaderOptions"
                     :props="cascaderProps"
                     @change="handleCascaderChangeOne"></el-cascader>
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

    <el-row :gutter="10"
            v-if="paramsState"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   plain
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport">导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading"
              :data="purchaseProjectsList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="序号"
                       align="center"
                       type="index" />
      <el-table-column label="项目名称"
                       align="center"
                       min-width="150px"
                       show-overflow-tooltip
                       prop="projectName" />
      <el-table-column label="数量"
                       align="center"
                       prop="num" />
      <el-table-column label="预算金额"
                       align="center"
                       prop="budgetCost" />
      <el-table-column label="交付日期"
                       align="center"
                       width="100px"
                       prop="deliveryDate" />
      <el-table-column label="规格型号"
                       align="center"
                       prop="specification" />
      <el-table-column label="推荐品牌"
                       align="center"
                       prop="supplier" />
      <el-table-column label="申购原因"
                       align="center"
                       prop="reason" />
      <!-- <el-table-column label="供应商联系人"
                       align="center"
                       prop="supplierContactName" />
      <el-table-column label="供应商联系电话"
                       align="center"
                       prop="supplierContactPhone" /> -->
      <!-- <el-table-column label="预算类型"
                       align="center"
                       prop="budgetType" /> -->
      <el-table-column label="操作"
                       align="center"
                       width="100"
                       v-if="paramsState"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改采购申请项目 对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="560px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="paramsType == '预算内' ? rules : rules1"
               label-width="100px">
        <el-form-item label="项目名称"
                      prop="projectName">
          <el-input v-model="form.projectName"
                    key="预算内"
                    v-if="paramsType == '预算内'"
                    @focus="openBudget"
                    ref="budget"
                    placeholder="请选择预算项目" />
          <el-input v-model="form.projectName"
                    key="预算外"
                    v-if="paramsType == '预算外'"
                    placeholder="请输入预算项目" />
        </el-form-item>
        <el-form-item label="数量"
                      prop="num">
          <el-input v-model.number="form.num"
                    type="number"
                    :placeholder="paramsType == '预算内' ? '剩余预算数量：'+restNum :'请输入预算数量' " />
        </el-form-item>
        <el-form-item label="预算金额"
                      prop="budgetCost">
          <el-input v-model.number="form.budgetCost"
                    type="number"
                    :placeholder="paramsType == '预算内' ? '剩余预算金额：'+restMoney :'请输入预算金额' " />
        </el-form-item>
        <el-form-item label="交付日期"
                      prop="deliveryDate">
          <el-date-picker clearable
                          size="small"
                          v-model="form.deliveryDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择交付日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="规格型号"
                      prop="specification">
          <el-input v-model="form.specification"
                    type="textarea"
                    placeholder="请输入规格型号参数及要求" />
        </el-form-item>
        <!-- @focus="openSupplier" -->
        <el-form-item label="推荐品牌"
                      prop="supplier">
          <el-input v-model="form.supplier"
                    ref="supplier"
                    placeholder="请输入推荐品牌" />
        </el-form-item>
        <!-- <el-form-item label="供应商联系人"
                      v-show="supplierFlag"
                      prop="supplierContactName">
          <el-input v-model="form.supplierContactName"
                    placeholder="请输入推荐供应商联系人" />
        </el-form-item>
        <el-form-item label="供应商电话"
                      v-show="supplierFlag"
                      prop="supplierContactPhone">
          <el-input v-model="form.supplierContactPhone"
                    placeholder="请输入推荐供应商联系电话" />
        </el-form-item> -->
        <el-form-item label="申购原因"
                      prop="reason">
          <el-input v-model="form.reason"
                    type="textarea"
                    placeholder="请输入申购原因" />
        </el-form-item>
        <!-- <el-form-item label="项目预算"
                    prop="budgetType">
          <el-select v-model="form.budgetType"
                   placeholder=""
                   clearable
                   disabled
                   size="small">
          <el-option v-for="item in budgetTypeOptions" :key="item.label" :label="item.label"
                     :value="item.value" />
        </el-select>
      </el-form-item> -->
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <selectSupplier :open.sync="supplierOpen"
                    @handleSelect="handleSelectSupplier" /> -->
    <selectBudget :year="paramsYear"
                  :open.sync="budgetOpen"
                  :deptId="deptId"
                  @handleSelect="handleSelectBudget" />
  </div>
</template>

<script>
import {
  listPurchaseProjects,
  getPurchaseProjects,
  delPurchaseProjects,
  addPurchaseProjects,
  updatePurchaseProjects,
  exportPurchaseProjects,
} from '@/api/purchaseProject/purchaseProjects';
import { projectTypeTreeselect } from '@/api/system/projectType';
import selectBudget from '@/components/selectBudget';
// import selectSupplier from '@/components/selectSupplier';
import { mapState } from 'vuex';
export default {
  name: 'PurchaseProjects',
  components: {
    selectBudget,
    // selectSupplier,
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
      // 采购申请项目 表格数据
      purchaseProjectsList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: null,
        applyId: null,
        deliveryDate: null,
        budgetType: null,
        projectId: null,
        createdBy: null,
        createdTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules1: {
        projectName: [
          { required: true, message: '预算项目不能为空', trigger: 'blur' },
        ],
        deliveryDate: [
          { required: true, message: '交付日期不能为空', trigger: 'blur' },
        ],
        budgetType: [
          { required: true, message: '项目预算不能为空', trigger: 'blur' },
        ],
        num: [
          { required: true, message: '数量不能为空', trigger: 'blur' },
          { type: 'number', min: 1, message: '数量不能小于1', trigger: 'blur' },
        ],
        budgetCost: [
          { required: true, message: '预算金额不能为空', trigger: 'blur' },
          {
            type: 'number',
            min: 1,
            message: '预算金额不能小于1',
            trigger: 'blur',
          },
        ],
        reason: [
          { required: true, message: '申购原因不能为空', trigger: 'blur' },
        ],
      },
      rules: {
        projectName: [
          { required: true, message: '预算项目不能为空', trigger: 'blur' },
        ],
        deliveryDate: [
          { required: true, message: '交付日期不能为空', trigger: 'blur' },
        ],
        budgetType: [
          { required: true, message: '项目预算不能为空', trigger: 'blur' },
        ],
        num: [
          { required: true, message: '数量不能为空', trigger: 'blur' },
          { type: 'number', min: 1, message: '数量不能小于1', trigger: 'blur' },
        ],
        budgetCost: [
          { required: true, message: '预算金额不能为空', trigger: 'blur' },
          {
            type: 'number',
            min: 1,
            message: '预算金额不能小于1',
            trigger: 'blur',
          },
        ],
      },
      // 弹层显示状态
      budgetOpen: false,
      // supplierOpen: false,
      //级联配置
      cascaderOptions: [], //项目
      cascaderProps: { expandTrigger: 'hover', value: 'id', label: 'label' },
      // 当前编辑弹层的附属信息显示状态,
      budgetFlag: false, //true为显示，false为不显示
      supplierFlag: false,
      restMoney: '0', // 剩余预算金额（存储当前操作项目中的值）
      restNum: '0', // 剩余预算数量（存储当前操作项目中的值）
      budgetTypeOptions: [
        { label: '预算内', value: '预算内' },
        { label: '预算外', value: '预算外' },
      ], // 当前剩余预算类型，预算内，预算外（存储当前操作项目中的值）
      paramsId: '', //上级页面传进来的的id
      paramsState: true, //上级页面传进来的页面状态
      paramsYear: null,
      paramsType: null,
    };
  },
  created() {
    this.paramsYear = this.$route.params.year;
    this.paramsId = this.$route.params.id;
    this.paramsState = this.$route.params.state === '0' ? true : false;
    this.paramsType = this.$route.params.type;
    this.getList();
    this.getSelectThree();
  },
  computed: {
    ...mapState({
      deptId: (state) => state.user.deptId,
    }),
  },
  methods: {
    /**项目级联选择触发 */
    handleCascaderChangeOne(value) {
      // console.log('级联选择触发-项目-查询条件', value, value[value.length - 1])
      this.queryParams.projectId =
        value.length >= 1 ? value[value.length - 1] : '';
    },
    /**获取项目分类树节点 */
    getSelectThree() {
      projectTypeTreeselect().then((response) => {
        console.log(response.data);
        this.cascaderOptions = response.data;
      });
    },
    /** 查询采购申请项目 列表 */
    getList() {
      this.loading = true;
      listPurchaseProjects(
        Object.assign(this.queryParams, { applyId: this.paramsId })
      ).then((response) => {
        this.purchaseProjectsList = response.rows;
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
        projectName: null,
        applyId: null,
        num: null,
        budgetCost: null,
        deliveryDate: null,
        reason: null,
        specification: null,
        supplier: null,
        supplierContactName: null,
        supplierContactPhone: null,
        budgetType: null,
        projectId: null,
        revision: null,
        createdBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
      };
      // this.budgetFlag = false;
      // this.supplierFlag = false;
      this.restMoney = '0';
      this.restNum = '0';
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 选择预算*/
    handleSelectBudget(data) {
      setTimeout(() => {
        let form = this.form;
        console.log('接受选择的预算值', data);
        form.projectId = data.id;
        form.projectName = data.projectName;
        form.deptId = data.deptId;
        form.deptName = data.deptName;
        form.budgetYear = data.budgetYear;
        // form.id = data.id;
        form.nickName = data.nickName;
        form.specification = data.specification;
        form.moneyFrom = data.moneyFrom;
        // 单独触发效验
        this.$refs.form.validateField('projectName');
      });
      this.restMoney = data.restMoney;
      this.restNum = data.restNum || '0';
      this.budgetFlag = true;
      // data.restMoney === 0 || data.restNum === 0 ? this.form.budgetType = '预算外': this.form.budgetType = '预算内'
    },
    /** 新增按钮操作 选择供应商*/
    handleSelectSupplier(data) {
      console.log('接受选择的部门值', data);
      setTimeout(() => {
        let form = this.form;
        form.supplier = data.companyName;
        form.supplierContactPhone = data.phone;
        form.supplierContactName = data.businessContact;
      });
      // this.supplierFlag = true;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加采购申请项目 ';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getPurchaseProjects(id).then((response) => {
        this.form = response.data;
        this.form.budgetCost = +response.data.budgetCost;
        this.form.num = +response.data.num;
        this.open = true;
        this.title = '修改采购申请项目 ';
        // this.budgetFlag = true;
        // this.supplierFlag = true;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('提交的id', this.paramsId, this.paramsType);
          this.form.applyId = this.paramsId;
          this.form.budgetType = this.paramsType;
          if (this.form.id != null) {
            updatePurchaseProjects(this.form).then((response) => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addPurchaseProjects(this.form).then((response) => {
              this.msgSuccess('新增成功');
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
      this.$confirm(
        '是否确认删除采购申请项目 编号为"' + ids + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delPurchaseProjects(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess('删除成功');
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有采购申请项目 数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return exportPurchaseProjects(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
    // openSupplier() {
    //   this.supplierOpen = true;
    //   this.$refs.supplier.blur()
    // },
    openBudget() {
      this.budgetOpen = true;
      this.$refs.budget.blur();
    },
  },
};
</script>
