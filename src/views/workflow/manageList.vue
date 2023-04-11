<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="68px"
    >
      <el-form-item label="项目id"
                    prop="projectId"
      >
        <el-input v-model="queryParams.projectId"
                  placeholder="关联预算中对应项目id"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="年份"
                    prop="budgetYear"
      >
        <el-input v-model="queryParams.budgetYear"
                  placeholder="关联预算中对应的年份"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery"
        >搜索
        </el-button>
        <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery"
        >重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10"
            class="mb8"
    >
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['purchase:apply:add']"
        >新增
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="success"
                   plain
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['purchase:apply:edit']">修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['purchase:apply:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['purchase:apply:export']">导出</el-button>
      </el-col> -->
      <!-- <right-toolbar :showSearch.sync="showSearch"
                     @queryTable="getList"></right-toolbar> -->
    </el-row>

    <!-- @selection-change="handleSelectionChange" -->
    <!-- <el-table-column type="selection"
                    width="55"
                    align="center" /> -->
    <el-table v-loading="loading"
              :data="applyList"
    >

      <el-table-column label="序号"
                       align="center"
                       type="index"
                       width="55"
      />
      <!-- <el-table-column label="id"
                       align="center"
                       prop="id" /> -->
      <el-table-column label="流程名称"
                       align="center"
                       prop="name"
      />
      <el-table-column label="流程key"
                       align="center"
                       prop="key"
      />
      <el-table-column label="最新定义ID"
                       align="center"
                       width="360px"
                       prop="latestDefinitionId"
      />
      <el-table-column label="当前部署版本号"
                       align="center"
                       prop="version"
      />
      <el-table-column label="已修改版本号"
                       align="center"
                       prop="latestVersion"
      />
      <el-table-column label="状态"
                       align="center"
                       prop="deploymentId"
      >
        <template slot-scope="scope">
          {{ scope.row.deploymentId ? '已部署' : '未部署' }}
        </template>
      </el-table-column>
      <el-table-column label="最近修改时间"
                       align="center"
                       prop="lastUpdateTime"
                       width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.lastUpdateTime }}
          <!-- <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="创建时间"
                       align="center"
                       prop="createTime"
                       width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime }}
          <!-- <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="200"
                       class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">

          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
          >修改
          </el-button>

          <el-button size="mini"
                     type="text"
                     icon="el-icon-share"
                     style="color:#67C23A;"
                     @click="handleDeployment (scope.row)"
          >部署
          </el-button>


          <el-button size="mini"
                     type="text"
                     icon="el-icon-notebook-2"
                     style="color:#1ab394;"
                     @click="handleSelect(scope.row)"
          >版本

          </el-button>

          <el-button size="mini"
                     type="text"
                     style="color: #F56C6C"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList"
    />

    <!-- 添加或修改采购申请 对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               append-to-body
    >
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px"
      >
        <el-form-item label="关联预算中对应项目id"
                      prop="projectId"
        >
          <el-input v-model="form.projectId"
                    placeholder="请输入关联预算中对应项目id"
          />
        </el-form-item>
        <el-form-item label="关联预算中对应的年份"
                      prop="budgetYear"
        >
          <el-input v-model="form.budgetYear"
                    placeholder="请输入关联预算中对应的年份"
          />
        </el-form-item>
        <el-form-item label="申购部门"
                      prop="deptId"
        >
          <el-input v-model="form.deptId"
                    placeholder="请输入申购部门"
          />
        </el-form-item>
        <el-form-item label="经办人"
                      prop="userId"
        >
          <el-input v-model="form.userId"
                    placeholder="请输入经办人"
          />
        </el-form-item>
        <el-form-item label="经办人联系电话"
                      prop="userPhone"
        >
          <el-input v-model="form.userPhone"
                    placeholder="请输入经办人联系电话"
          />
        </el-form-item>
        <el-form-item label="数量"
                      prop="num"
        >
          <el-input v-model="form.num"
                    placeholder="请输入数量"
          />
        </el-form-item>
        <el-form-item label="预算金额"
                      prop="budgetMoeny"
        >
          <el-input v-model="form.budgetMoeny"
                    placeholder="请输入预算金额"
          />
        </el-form-item>
        <el-form-item label="交付日期"
                      prop="deliveryDay"
        >
          <el-date-picker clearable
                          size="small"
                          v-model="form.deliveryDay"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择交付日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申购原因"
                      prop="reason"
        >
          <el-input v-model="form.reason"
                    type="textarea"
                    placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="规格型号、技术参数及服务要求"
                      prop="specification"
        >
          <el-input v-model="form.specification"
                    type="textarea"
                    placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="推荐品牌或者供应商"
                      prop="supplier"
        >
          <el-input v-model="form.supplier"
                    placeholder="请输入推荐品牌或者供应商"
          />
        </el-form-item>
        <el-form-item label="推荐供应商联系人"
                      prop="supplierUsername"
        >
          <el-input v-model="form.supplierUsername"
                    placeholder="请输入推荐供应商联系人"
          />
        </el-form-item>
        <el-form-item label="推荐供应商联系电话"
                      prop="supplierPhone"
        >
          <el-input v-model="form.supplierPhone"
                    placeholder="请输入推荐供应商联系电话"
          />
        </el-form-item>
        <el-form-item label="项目预算(预算内;预算外)"
                      prop="budgetType"
        >
          <el-select v-model="form.budgetType"
                     placeholder="请选择项目预算(预算内;预算外)"
          >
            <el-option label="请选择字典生成"
                       value=""
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否通过审批(0未审批，1已审批)"
                      prop="isOk"
        >
          <el-input v-model="form.isOk"
                    placeholder="请输入是否通过审批(0未审批，1已审批)"
          />
        </el-form-item>
        <el-form-item label="采购执行人"
                      prop="purchaseOperator"
        >
          <el-input v-model="form.purchaseOperator"
                    placeholder="请输入采购执行人"
          />
        </el-form-item>
        <el-form-item label="执行状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建人"
                      prop="createBy"
        >
          <el-input v-model="form.createBy"
                    placeholder="请输入创建人"
          />
        </el-form-item>
        <el-form-item label="创建时间"
                      prop="createTime"
        >
          <el-date-picker clearable
                          size="small"
                          v-model="form.createTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择创建时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新人"
                      prop="updateBy"
        >
          <el-input v-model="form.updateBy"
                    placeholder="请输入更新人"
          />
        </el-form-item>
        <el-form-item label="更新时间"
                      prop="updateTime"
        >
          <el-date-picker clearable
                          size="small"
                          v-model="form.updateTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择更新时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer"
      >
        <el-button type="primary"
                   @click="submitForm"
        >确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listApply, delApply, addApply, updateApply, exportApply, deployBpmnModelApply } from '@/api/purchase/workflow'

export default {
  name: 'Apply',
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
      // 采购申请 表格数据
      applyList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        budgetYear: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询采购申请 列表 */
    getList() {
      this.loading = true
      listApply(this.queryParams).then(response => {
        this.applyList = response.rows
        this.total = response.total
        this.loading = false
        console.log('返回值', response)
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
        deptId: null,
        userId: null,
        userPhone: null,
        num: null,
        budgetMoeny: null,
        deliveryDay: null,
        reason: null,
        specification: null,
        supplier: null,
        supplierUsername: null,
        supplierPhone: null,
        budgetType: null,
        isOk: null,
        purchaseOperator: null,
        status: '0',
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push('/workflow/manageEditor/' + '新增/空')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      this.$router.push('/workflow/manageEditor/' + id + '/空')
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateApply(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addApply(this.form).then(response => {
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
      this.$confirm('确认删除"' + row.name + '"流程模型?\n 该操作不可逆请谨慎操作!', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delApply(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /**版本管理 */
    handleSelect(row) {
      this.reset()
      const id = row.id || this.ids
      this.$router.push('/workflow/manageList/' + id)
    },
    /**部署 */
    handleDeployment(row) {
      this.$confirm(`是否要部署流程：${row.name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return deployBpmnModelApply(row.id)
      }).then(() => {
        this.getList()
        this.msgSuccess('部署成功')
      })
    }
  }
}
</script>
