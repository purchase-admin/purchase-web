<template>
  <!-- 选择合同标的 -->
  <el-dialog title="查看合同标的"
                :visible.sync="dialogShow"
                :width="dialogWidth"
                append-to-body>
    <div class="app-container">
          <el-table ref="_tables" v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="合同标的"
                              align="center"
                              prop="projectName" />
              <el-table-column label="数量"
                              align="center"
                              prop="num" />
              <el-table-column label="申请原因"
                              align="center"
                              show-overflow-tooltip
                              prop="reason" />
              <el-table-column label="预算金额"
                              align="center"
                              prop="budgetCost" />
              <el-table-column label="规格型号"
                              align="center"
                              prop="specifcation" />
              <el-table-column label="供应商名称"
                              align="center"
                              prop="supplierName" />
              <el-table-column label="供应商报价"
                              align="center"
                              prop="quotation" />
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
import { listProjects } from "@/api/purchase/apply";
import dialogMixins  from "@/utils/mixins/dialog"
import { mapState } from "vuex"
export default {
  name: "project",
  props:['open','supplier'],
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      
    };
  },
  mounted() {
    console.log('组件进入勒')
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
    'supplier'(){
      console.log('当前部门id',this.supplier)
      if(this.supplier){
       this.getList();
      }
    }
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      console.log('组件执行勒')
      this.loading = true;
      this.queryParams.supplier = this.supplier;
      listProjects(this.queryParams).then(response => {
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
     if(this.ids.length < 1){
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        });
      }else{
        this.$emit('handleSelect',this.ids)
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
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
  }
};
</script>