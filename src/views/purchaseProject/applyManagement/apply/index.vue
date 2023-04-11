<template>
  <!-- 采购申请批处理界面 -->
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="80px">
      <el-form-item label="经办人"
                    prop="userId">
        <!-- <el-input v-model="queryParams.userId"
                  placeholder="请输入经办人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" /> -->

        <el-input ref="input1"
                  v-model="queryParams.userName"
                  clearable
                  @focus="selectUser"
                  placeholder="请选择经办人" />
      </el-form-item>
      <el-form-item label="联系电话"
                    prop="userPhone">
        <el-input v-model="queryParams.userPhone"
                  placeholder="请输入经办人联系电话"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
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
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd(1)">新增采购申请（预算内-普通预算）</el-button>
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd(3)">新增采购申请（预算内-应急预算）</el-button>
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd(2)">新增采购申请（预算外）</el-button>
         
      </el-col>
    </el-row>
    <el-tabs v-model="queryParams.budgetType"
             type="card"
             @tab-click="handleQuery">
      <el-tab-pane label="预算内-普通预算"
                   name="预算内-普通预算">
      </el-tab-pane>
      <el-tab-pane label="预算内-应急预算"
                   name="预算内-应急预算">
      </el-tab-pane>
      <el-tab-pane label="预算外"
                   name="预算外">
      </el-tab-pane>
    </el-tabs>

    <el-table v-loading="loading"
              :data="applyList">
      <el-table-column label="序号"
                       align="center"
                       width="55"
                       type="index" />
      <el-table-column label="年份"
                       align="center"
                       prop="budgetYear" />
      <el-table-column label="申购部门"
                       align="center"
                       prop="deptName" />
      <el-table-column label="申购项目条数"
                       align="center"
                       width="100"
                       prop="projectNum" />
      <el-table-column label="经办人"
                       align="center"
                       prop="userName" />
      <el-table-column label="经办人联系电话"
                       align="center"
                       prop="userPhone" />
      <el-table-column label="创建时间"
                       align="center"
                       width="180"
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
          {{statusNames[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="160"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleSee(scope.row)">详情</el-button>
          <el-button size="mini"
                     type="text"
                     v-show="scope.row.status=='0' && scope.row.projectNum > 0"
                     icon="el-icon-s-promotion"
                     @click="handleSubmitFlow(scope.row)">提交</el-button>
          <el-button size="mini"
                     type="text"
                     v-show="scope.row.status=='0'"
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
    <select-user-com :open.sync="userOpen"
                     @handleSelect="selectUserFun"></select-user-com>
    <!-- 添加采购申请 对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="400px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               label-width="80px">
        <el-form-item label="预算类型"
                      prop="budgetType">
          <el-select v-model="form.budgetType"
                     placeholder="请选择">
            <el-option v-for="item in budgetTypes"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
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
import { listApply, getApply, delApply, addApply, updateApply, exportApply, startApplyProcess as startProcess } from "@/api/purchase/apply";
import selectUserCom from "@/components/selectUser/bf";
export default {
  name: "Apply",
  components: {
    selectUserCom
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
      // 采购申请 表格数据
      applyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // projectId: null,
        // budgetYear: null,
        // deptId: null,
        userId: null,
        userPhone: null,
        userName: null,
        budgetType: '预算内'
        // status: null,
      },
      // 表单参数
      budgetTypes: [{ label: '预算内', value: '预算内' }, { label: '预算外', value: '预算外' }],
      form: {
        budgetType: '预算内'
      },
      // 表单校验
      rules: {
      },
      statusNames: {}, //执行状态0,1,2编译中文. 已提交和已审核点击详情只能查看，未提交可以编辑详情
      userOpen: false,
    };
  },
  created() {
    // this.getDicts("CGSQYSLX").then(response => {
    //   console.log('获取到了预算类型字典',response)
    //   this.budgetTypes = response.data;
    // });
    this.getList();
    this.statusNames = defaultSettings.states;
  },
  methods: {
    // 弹层 选择经办人
    selectUser() {
      this.$refs.input1.blur();
      this.userOpen = true
    },
    selectUserFun(res) {
      console.log(res)
      this.queryParams.userId = res.id;
      this.queryParams.userName = res.label;
    },
    /** 查询采购申请 列表 */
    getList() {
      this.loading = true;
      let obj = Object.assign({},this.queryParams);
      if (obj.budgetType.includes('预算内')) {
        if (obj.budgetType === '预算内-应急预算') {
          obj.isUrgencyType = 1;
        } else {
          obj.isUrgencyType = 0;
        }
        obj.budgetType = '预算内'
      } 
      listApply(obj).then(response => {
        this.applyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
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
    /** 新增按钮操作 */
    handleAdd(type) {
      let obj = {};
      if (type === 2) {
        //预算外
        obj.budgetType = '预算外';
      } else {
        // 预算内
        obj.budgetType = '预算内';
        // 应急预算  isUrgencyType
        if (type === 1) {
          //普通预算 isUrgencyType 0
          obj.isUrgencyType = 0;
        } else {
          //应急预算 isUrgencyType 1
          obj.isUrgencyType = 1;
        }
      }
      this.submitForm(obj);
      // this.open = true
      // this.title = '添加采购申请 '
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    submitForm(data) {
      addApply(data).then(response => {
        this.msgSuccess("新增成功");
        // this.open = false;
        this.getList();
      });
    },
    /** 查看详情按钮操作 */
    handleSee(row) {
      const id = row.id || this.ids;
      this.$router.push(`/purchaseProject/applyManagement/apply/detail/${id}/${row.status}/${row.budgetYear}/${this.queryParams.budgetType.includes('预算内') ? '预算内' : '预算外'}`)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除采购申请 编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delApply(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有采购申请 数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportApply(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    //  提交勾选的数据走流程
    handleSubmitFlow(row) {
      // 申购条数大于0，提交确认
      this.$confirm('确认提交吗?', "确认", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const startParams = {}
        startParams.processDefinitionKey = this.queryParams.budgetType.includes('预算内') ? this.$route.meta.params.KEY : this.$route.meta.params.KEY2;
        startParams.businessKey = row.id
        startParams.title = row.title
        return startProcess(startParams);
      }).then((res) => {
        this.msgSuccess(res.msg)
        this.getList()
      })
    },
  }
};
</script>
