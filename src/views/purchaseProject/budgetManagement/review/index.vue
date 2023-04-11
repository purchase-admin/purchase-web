<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="68px">
      <el-form-item label="标题"
                    prop="processInstanceName">
        <el-input v-model="queryParams.processInstanceName"
                  placeholder="请输入标题"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
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
    <el-tabs v-model="queryParams.state"
             type="card"
             @tab-click="handleTabsClick">
      <el-tab-pane label="待办"
                   name="running">
        <el-table v-loading="loading"
                  :data="budgetList">
          <el-table-column label="序号"
                           align="center"
                           width="75px"
                           type="index" />
          <!--      <el-table-column label="任务ID" align="center" show-overflow-tooltip prop="id"/>-->
          <el-table-column label="流程标题"
                           align="center"
                           prop="processInstanceName" />
          <!--      <el-table-column label="流程名称" align="center" show-overflow-tooltip prop="processDefinitionName"/>-->
          <el-table-column label="任务节点名称"
                           align="center"
                           prop="name" />
          <el-table-column label="任务到达时间"
                           align="center"
                           prop="created" />
          <!--          <el-table-column label="办理人" align="center" prop="assignee.nickName"/>-->
          <!--      <el-table-column label="流程实例ID" align="center" show-overflow-tooltip prop="processInstanceId"/>-->
          <el-table-column label="操作"
                           align="center"
                           class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="text"
                         icon="el-icon-s-promotion"
                         @click="handleSee(scope.row)">
                办理
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已办"
                   name="completed">
        <el-table v-loading="loading"
                  :data="budgetList">
          <el-table-column label="序号"
                           align="center"
                           width="75px"
                           type="index" />
          <!--      <el-table-column label="任务ID" align="center" show-overflow-tooltip prop="id"/>-->
          <!--          <el-table-column label="流程标题" align="center" prop="name"/>-->
          <el-table-column label="流程标题"
                           align="center"
                           prop="processInstanceName" />
          <!--      <el-table-column label="流程名称" align="center" show-overflow-tooltip prop="processDefinitionName"/>-->
          <!--          <el-table-column label="节点名称" align="center" prop="name"/>-->
          <el-table-column label="发起人"
                           align="center"
                           prop="processStartUser.nickName" />
          <el-table-column label="发起时间"
                           align="center"
                           prop="startTime" />
          <el-table-column label="结束时间"
                           align="center"
                           prop="endTime" />
          <!--      <el-table-column label="流程实例ID" align="center" show-overflow-tooltip prop="processInstanceId"/>-->
          <el-table-column label="操作"
                           align="center"
                           class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="text"
                         icon="el-icon-search"
                         @click="handleSee(scope.row)">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />
  </div>
</template>

<script>
import { list } from '@/api/budget/review'

export default {
  name: 'Review',
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
        // state: 'all',
        state: 'running',
        processInstanceName: '',
        processDefinitionKey: this.$route.meta.params.KEY
      },
      //数据字典-资金来源
      //级联配置
      cascaderOptions: [],//项目
      cascaderDeptOptions: [],//部门
      cascaderProps: { expandTrigger: 'hover', value: 'id', label: 'label' },
      // 表单参数
      form: {}
    }
  },
  computed: {},
  methods: {
    // 表单重置
    reset() {
      this.form = {
        year: null,
        deptId: this.deptId
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加部门采购预算 '
    },
    handleTabsClick(tab, event) {
      console.log(tab, event)
      this.handleQuery()
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      console.log(this.queryParams)
      this.handleQuery()
    },
    // 点击查看
    handleSee(row) {
      let id = 'running' === this.queryParams.state ? row.id : row.processInstanceId;
      //正常跳转
      this.$router.push(`/purchaseProject/budgetManagement/review/detail/` + id + '/' + row.businessKey + '/' + this.queryParams.state)
      //外部跳转-pc
      // this.$router.push(`/outer/budgetManagement/review/detail/` + id + '/' + row.businessKey + '/' + this.queryParams.state)
      //外部跳转-mobile
      // this.$router.push(`/outer/mobile/budgetManagement/review/detail/` + id + '/' + row.businessKey + '/' + this.queryParams.state)
    }
  },
  created() {
    this.getList()
    console.log(this.$route)
    console.log(this.$router)
  }
}
</script>
