<template>
  <el-dialog title="查看预算项目"
                :visible.sync="dialogShow"
                :width="dialogWidth"
                append-to-body>
    <div class="app-container">
        <!--用户数据-->
          <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="用户名称" prop="userName">
              <el-input
                v-model="queryParams.userName"
                placeholder="请输入用户名称"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form> -->
          <el-table ref="_tables" v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="项目"
                              align="center"
                              min-width="180"
                              show-overflow-tooltip
                              prop="projectName" />
              <el-table-column label="预算年份"
                              align="center"
                              prop="batchYear" />
              <el-table-column label="填报部门"
                              align="center"
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
              <el-table-column label="剩余预算金额"
                              align="center"
                              prop="restMoney" />
              <el-table-column label="预算数量"
                              align="center"
                              prop="num" />
              <el-table-column label="剩余预算数量"
                              align="center"
                              prop="restNum" />
              <el-table-column label="备注"
                              align="center"
                              min-width="80"
                              show-overflow-tooltip
                              prop="remark" />
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
    </div>
    <div slot="footer"
              class="dialog-footer">
      <el-button type="primary"
                  @click="handleSelect">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listBudget} from "@/api/budget/budget";
import dialogMixins from "@/utils/mixins/dialog"
import { mapState } from "vuex";
export default {
  name: "ViewListData",
  props:['open','deptId','year'],
  mixins: [dialogMixins],
  data() {
    return {
      // 遮罩层
      loading: false,
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
      // 表格数据
      dataList: null,
      // 弹出层标题
      title: "",
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      //数据字典-资金来源
      moneyFromOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // userName: undefined,
        // phonenumber: undefined,
        // status: undefined,
        // deptId: undefined
      },
    };
  },
  mounted() {
    console.log('组件进入勒')
    this.getDicts("ZJLY").then((response) => {
      this.moneyFromOptions = response.data;
    });
  },
  computed: {
    ...mapState({
        "dialogWidth": state => state.settings.dialogWidth,
    }),
    dialogShow: {
      set(){
        this.cancel()
      },
      get(){
        return this.open
      }
    },
  },
  watch: {
    'open'(){
      if(this.open){
        this.getList();
      }
    }
  },
  methods: {
    // 资金来源字典翻译
    moneyFromFormat(row, column) {
      return this.selectDictLabel(this.moneyFromOptions, row.moneyFrom);
    },
    /** 查询部门列表 */
    getList() {
      console.log('组件执行勒')
      this.loading = true;
      this.queryParams.deptId = this.deptId;
      this.queryParams.approveStatus = 9;
      this.queryParams.budgetYear = this.year;
      listBudget(this.queryParams).then(response => {
          this.dataList = response.rows;
          this.total = response.total;
          this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /**确认选择操作 */
    handleSelect() {
     if(this.ids.length !== 1){
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        });
      }else{
        this.$emit('handleSelect',this.ids[0])
        this.cancel()
      }
    },
    // 取消按钮
    cancel() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.$emit('update:open', false)
      // 清除多选的值
      this.$refs._tables.clearSelection()
    },
     // 多选框选中数据
    handleSelectionChange(selection) {
      // .map(item => { return item})
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      if(this.ids.length > 1){
        // 多选框-切换单选操作toggleRowSelection。选中一行
        this.$refs._tables.toggleRowSelection(selection[0])
      }
    },
  }
};
</script>