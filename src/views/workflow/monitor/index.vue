<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="流程名称" prop="processInstanceName">
        <el-input
            v-model="queryParams.processInstanceName"
            placeholder="请输入流程名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发起人" prop="starterBy">
        <el-input
            v-model="queryParams.starterBy"
            placeholder="请输入发起人"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label-width="100px" label="流程定义Key" prop="ProcessDefinitionKey">
        <el-tooltip content="区分大小写" :hide-after="2000" placement="top">
          <el-input
              v-model="queryParams.ProcessDefinitionKey"
              placeholder="请输入流程定义Key"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="版本号" prop="processDefinitionVersion">
        <el-input
            v-model="queryParams.processDefinitionVersion"
            placeholder="请输入版本号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="finished">
        <el-select v-model="queryParams.finished" placeholder="请选择状态" @change="handleQuery">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              clearable
              size="small"
          >
          </el-option>
        </el-select>
        <!--        <el-input-->
        <!--            v-model="queryParams.finished"-->
        <!--            placeholder="请输入版本号"-->
        <!--            clearable-->
        <!--            size="small"-->
        <!--            @keyup.enter.native="handleQuery"-->
        <!--        />-->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="序号" fixed type="index" align="center"/>
      <el-table-column label="实例ID" align="center" width="300x" prop="id"/>
      <el-table-column label="流程定义名称" align="center" width="200px" prop="processDefinitionName"/>
      <el-table-column label="流程定义Key" align="center" width="120px" prop="processDefinitionKey"/>
      <el-table-column label="版本号" align="center" width="60px" prop="processDefinitionVersion"/>
      <el-table-column label="流程标题" align="center" width="360px" prop="name"/>
      <el-table-column label="业务数据ID" align="center" width="260px" prop="businessKey"/>
      <el-table-column label="发起人" align="center" width="120px" prop="startedBy.nickName"/>
      <el-table-column label="发起时间" align="center" width="240px" prop="started"/>
      <el-table-column label="结束时间" align="center" width="240px" prop="ended"/>

      <el-table-column label="操作" align="center" width="180px" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              style="color: #1ab394"
              @click="detail(scope.row)"
              v-hasPermi="['monitor:online:forceLogout']"
          >详情
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-refresh"
              style="color: red"
              @click="migrate(scope.row)"
              v-hasPermi="['monitor:online:forceLogout']"
          >迁移版本
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />


    <!-- migrate model -->
    <el-dialog :title="title"
               :visible.sync="migrationFormVisible"
               width="600px"
               append-to-body
    >
      <el-form ref="migrationForm"
               :model="migrationForm"
               :rules="migrationFormRules"
               label-width="120px"
      >
        <el-form-item label="当前流程实例ID"
                      prop="processInstanceId"
        >
          <el-input
              v-model="migrationForm.processInstanceId"
              disabled
          />
        </el-form-item>
        <el-form-item label="当前流程定义ID"
                      prop="processDefinitionId"
        >
          <el-input
              v-model="migrationForm.processDefinitionId"
              disabled
          />
        </el-form-item>
        <el-form-item label="迁移版本" prop="migrationDefinitionId">
          <el-input
              v-model="migrationForm.migrationDefinitionId"
              placeholder="请输入迁移版本"
              clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer"
      >
        <el-button type="primary"
                   @click="confirmMigrationForm"
        >确 定
        </el-button>
        <el-button @click="cancelMigration">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, migrationProcessInstance } from '@/api/workflow/monitor'

export default {
  name: 'monitor',
  data() {
    return {
      // 表单校验
      migrationFormRules: {
        migrationDefinitionId: [
          { required: true, message: '请填写迁移版本', trigger: 'blur' }
        ]
      },
      migrationFormVisible: false,
      title: '流程迁移',
      migrationForm: {
        processDefinitionId: '',
        processInstanceId: '',
        migrationDefinitionId: ''
      },
      options: [
        {
          value: false,
          label: '运行中'
        },
        {
          value: true,
          label: '已完成'
        }
      ],
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      pageNum: 1,
      pageSize: 10,
      // 查询参数
      queryParams: {
        processInstanceName: '',
        ProcessDefinitionKey: '',
        processDefinitionVersion: '',
        finished: false,
        version: '',
        starterBy: '',
        assignee: '',
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    confirmMigrationForm() {
      this.$refs['migrationForm'].validate(valid => {
        if (!valid) return
        migrationProcessInstance(this.migrationForm).then(res => {
          this.msgSuccess(res.msg)
          this.migrationFormVisible = false
          this.getList()
        })
      })
    },
    migrate(row) {
      this.reset()
      this.migrationFormVisible = true
      this.migrationForm.processInstanceId = row.id
      this.migrationForm.processDefinitionId = row.processDefinitionId
    },
    reset() {
      this.migrationForm.processInstanceId = ''
      this.migrationForm.migrationDefinitionId = ''
      this.resetForm('migrationForm')
    },
    // 取消按钮
    cancelMigration() {
      this.migrationFormVisible = false
      this.reset()
    },
    /** 查询登录日志列表 */
    getList() {
      this.loading = true
      list(this.queryParams).then(response => {
        this.list = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 强退按钮操作 */
    handleForceLogout(row) {
      this.$confirm('是否确认强退名称为"' + row.userName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return forceLogout(row.tokenId)
      }).then(() => {
        this.getList()
        this.msgSuccess('强退成功')
      })
    },

    /** 强退按钮操作 */
    detail(row) {
      this.$router.push('/workflow/monitor/detail/' + row.id)
    }
  }
}
</script>

