<template>
  <!-- 年度预算汇总 -->
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="68px">
      <!-- <el-form-item label="项目"
                    prop="projectId">
        <el-cascader
            v-model="queryParams.projectId"
            :options="cascaderOptions"
            :props="cascaderProps"
            @change="handleCascaderChangeOne"></el-cascader>
      </el-form-item> -->
      <el-form-item label="预算年份"
                    prop="budgetYear">
        <el-date-picker v-model="queryParams.year"
                        type="year"
                        value-format="yyyy"
                        placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="填报部门"
                    prop="deptId">
        <el-cascader
            clearable
            :show-all-levels="false"
            v-model="queryParams.deptId"
            :options="cascaderDeptOptions"
            :props="cascaderProps"
            @change="handleCascaderChangeThree"></el-cascader>
      </el-form-item> -->
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
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleOpen('add')">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete">删除
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                  >导出
        </el-button>
      </el-col> -->
      <!-- <right-toolbar :showSearch.sync="showSearch"
                     @queryTable="getList"></right-toolbar> -->
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
      <el-table-column label="标题"
                       align="center"
                       prop="deptName">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="handleOpen('see',scope.row)">{{scope.row.title}}</el-button>
        </template>
      </el-table-column>
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
          {{statusNames[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     v-show="scope.row.status=='0'"
                     icon="el-icon-s-promotion"
                     @click="handleSubmitFlow(scope.row)">提交</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     v-show="scope.row.status=='0'"
                     @click="handleOpen('update',scope.row)">修改</el-button>
          <el-button size="mini"
                     type="text"
                     v-show="scope.row.status=='0'"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)">删除</el-button>
          <span v-if="scope.row.status !=='0'">暂无操作</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />
    <view-list-data @update-list="getList"
                    @updateOpen="updateFun"
                    :dYear="cYear"
                    :dIds="cIds"
                    :open="cDataOpen"
                    :dId="cId"
                    :dType="cType"></view-list-data>
  </div>
</template>

<script>
import defaultSettings from '@/settings'
import { listCollectBudget, exportBudget, deleteListCollectBudget } from "@/api/budget/budget";
import { startSummaryProcess } from '@/api/budget/summary'
import { treeselect as deptTreeselect } from "@/api/system/dept";
import { mapState } from "vuex";
import viewListData from "./components/viewListData"
export default {
  name: "Summary",
  components: {viewListData},
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
      // 采购预算汇总 表格数据
      budgetList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // projectId: null,
        year: null,
        deptId: null,
        // nickName: null,
        // specification: null,
        // moneyFrom: null,
      },
      //级联配置
      cascaderOptions: [],//项目
      cascaderDeptOptions: [],//部门
      cascaderProps: { expandTrigger: 'hover', value: 'id', label: 'label' },
      // 表单参数
      form: {},
      // 弹层显示的数据值
      cDataOpen: false,
      cId: '',
      cType: '',
      cIds: '',
      cYear: '',
      cParams: {},
      statusNames: {},
     
    };
  },
  computed: {
    ...mapState({
      "deptId": state => state.user.deptId,
      "userId": state => state.user.userId,
      "nickName": state => state.user.nickName
    })
  },
  created() {
    this.statusNames = defaultSettings.states;
    this.getList();
    // this.getSelectOneThree();
  },
  methods: {
    /**项目级联选择触发 */
    handleCascaderChangeThree(value) {
      // console.log('级联选择触发-部门-查询条件', value, value[value.length - 1])
      this.queryParams.deptId = value.length >= 1 ? value[value.length - 1] : "";
    },
    /**获取部门分类树节点 */
    getSelectOneThree() {
      deptTreeselect().then(response => {
        console.log(response.data)
        this.cascaderDeptOptions = response.data;
      });
    },
    /** 查询采购预算汇总 列表 */
    getList() {
      this.cType = '';
      this.loading = false;
      console.log('666666666', this.queryParams)
      // this.queryParams.budgetYear = (this.queryParams.budgetYear)
      listCollectBudget(this.queryParams).then(response => {
        console.log('预算汇总列表接口', response)
        this.budgetList = response.rows.map(ele => {
          ele.visible = false
          return ele
        });
        console.log('映射后', this.budgetList)
        this.loading = false;
        this.total = response.total;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      // this.queryParams.deptId = this.deptId;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 清除弹层数据操作,flag true表示查看，其他状态表示新增-修改
    updateFun() {
      console.log('清除数据关闭弹层')
      this.cId = '';
      this.cIds = '';
      this.cYear = '';
      this.cDataOpen = false;
    },
    /** 弹层编辑操作 */
    handleOpen(type, row = {}) {
      console.log(type, row)
      this.cType = type;
      if (row && row.id) {
        this.cId = row.id;
        this.cIds = row.budgetBatchIds;
        this.cYear = row.year;
      } else {
        this.cYear = new Date().getFullYear() + '';
      }
      this.cDataOpen = true;
    },
    //  提交勾选的数据走流程
    handleSubmitFlow(row) {
      this.$confirm('确认提交吗?', "确认", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const startParams = {}
        startParams.processDefinitionKey = this.$route.meta.params.KEY
        startParams.businessKey = row.id
        startParams.title = row.title
        return startSummaryProcess(startParams);
      }).then((res) => {
        this.msgSuccess(res.msg)
        this.getList()
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
      const ids = row.id || this.ids
      this.$confirm('是否确认删除年度预算汇总 id为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return deleteListCollectBudget(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
  }
};
</script>
