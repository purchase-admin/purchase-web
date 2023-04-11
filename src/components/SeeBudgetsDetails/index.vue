<template>
  <el-dialog :title="title"
             :visible.sync="modelFlag"
             :width="dialogWidth"
             append-to-body>
    <div class="app-container">
      <el-form :model="queryParams"
               ref="queryForm"
               :inline="true"
               v-show="showSearch"
               label-width="68px">
        <el-form-item label="项目"
                      prop="projectId">
          <el-cascader clearable
                       :show-all-levels="false"
                       v-model="queryParams.projectId"
                       :options="cascaderOptions"
                       :props="cascaderProps"
                       @change="handleCascaderChangeOne"></el-cascader>
        </el-form-item>
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
      <el-table v-loading="loading"
              :data="budgetList"
              >
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="序号"
                       align="center"
                       width="55"
                       type="index" />
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
      <el-table-column label="填报日期"
                       align="center"
                       prop="createTime"
                       width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getList" />

    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="cancel">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  listBudget
} from '@/api/budget/budget'
import { projectTypeTreeselect } from '@/api/system/projectType'
import dialogMixins from "@/utils/mixins/dialog"
import { mapState } from "vuex";
export default {
  name: "SeeBudgetsDetails",
  props: ['open', 'detailsId'],
  mixins: [dialogMixins],
  data() {
    return {
      // 弹层
      modelFlag: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 采购预算 表格数据
      budgetList: [],
      // 弹出层标题
      title: "年度采购预算申报明细列表",
      // 获取row的key值
      getRowKeys(row) {
        return row.id;
      },
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
      cascaderProps: { expandTrigger: 'hover', value: 'id', label: 'label' },
    };
  },
  mounted() {
    this.getSelectThree();
    this.getDicts("ZJLY").then((response) => {
      this.moneyFromOptions = response.data;
    });
  },
  computed: {
    ...mapState({
      "dialogWidth": state => state.settings.dialogWidth,
      'deptId': state => state.user.deptId,
      'userId': state => state.user.userId,
      'nickName': state => state.user.nickName
    }),
  },
  watch: {
    'open'(val, old) {
      if (val) {
        // 监听到了开启弹层
        console.log('调我了-------------------')
        this.modelFlag = true;
        this.$nextTick(() => {
          this.getList();
        })
      } else {
        this.modelFlag = false;
      }
    },
    'modelFlag'(val, old) {
      if (!val) {
        // 监听到了关闭弹层
        console.log('弹层关闭------------------------------')
        this.cancel()
      }
    },
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit('update:open');
    },
    // 资金来源字典翻译
    moneyFromFormat(row, column) {
      return this.selectDictLabel(this.moneyFromOptions, row.moneyFrom)
    },
    /**项目级联选择触发 */
    handleCascaderChangeOne(value) {
      this.queryParams.projectId = value.length >= 1 ? value[value.length - 1] : "";
    },
    /**获取项目分类树节点 */
    getSelectThree() {
      projectTypeTreeselect().then(response => {
        console.log(response.data)
        this.cascaderOptions = response.data
      })
    },
    /** 查询采购预算 列表 */
    getList() {
      this.loading = true
      this.queryParams.batchId = this.detailsId;
      this.queryParams.deptId = this.deptId;
      listBudget(this.queryParams).then(response => {
        this.budgetList = response.rows
        this.total = response.total
        this.loading = false
      })
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
  }
};
</script>