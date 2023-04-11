<template>
  <!-- 选择关联任务 -->
  <el-dialog title="查看关联任务"
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
                              prop="projectName" />
              <el-table-column label="是否预算内"
                              align="center"
                              prop="budgetType" />
              <el-table-column label="预算金额"
                              align="center"
                              prop="budgetCost" />
              <el-table-column label="交付日期"
                              align="center"
                              prop="deliveryDate" />
              <el-table-column label="申购部门"
                              align="center"
                              prop="deptName" />
              <el-table-column label="部门联系人"
                              align="center"
                              prop="executorName" />
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
import { mapState } from "vuex"
import { listTask } from "@/api/purchaseTask/task";
import dialogMixins  from "@/utils/mixins/dialog"
export default {
  name: "task",
  props:['open'],
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
        purchaseType: '3',
        executor: null
      },
    };
  },
  mounted() {
    console.log('组件进入勒1')
  },
  computed: {
    dialogShow: {
      set(){
        this.cancel()
      },
      get(){
        return this.open
      }
    },
    ...mapState({
        "dialogWidth": state => state.settings.dialogWidth,
        "adminName": state => state.user.name,
    }),
  },
   watch: {
    open(){
      if(this.open){
        this.getList();
      }
    }
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      console.log('组件执行勒2',this.queryParams)
      this.loading = true;
      this.queryParams.executor = this.adminName;
      listTask(this.queryParams).then(response => {
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