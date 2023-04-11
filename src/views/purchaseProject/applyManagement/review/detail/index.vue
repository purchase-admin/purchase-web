<template>
  <!-- 采购申请 - 代办 - 详情页面 -->
  <div class="app-container taskMain">
    <el-page-header @back="backRouter"
                    content="详情页面"
                    v-if="!outer" />
    <div v-if="outer"
         style="font-size: 18px; color: #303133;">申请待办详情</div>
    <el-row :gutter="24">
      <el-col :span="10"
              :offset="14"
              style="border-radius: 4px; margin-right: 4px; text-align: right;">
        <el-button-group>
          <el-button type="primary"
                     v-show="showSubmitActionButton()"
                     @click="showSubmitForm"
                     icon="el-icon-edit">办理
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <!--    基本信息-->
    <el-divider content-position="left">基本信息</el-divider>
    <div class="taskTitlePc">
      <el-row style="margin-bottom: 30px"
              :gutter="24">
        <el-col :span="8">
          <span style="font-size: 15px;margin-left: 50px">发起人:{{ this.basicInfoForm.nickName }}</span>
        </el-col>
        <el-col :span="8">
          <span style="font-size: 15px;margin-left: 50px">填报部门: {{ basicInfoForm.deptName }}</span>
        </el-col>
        <el-col :span="8">
          <span style="font-size: 15px;margin-left: 50px">发起时间: {{ basicInfoForm.startTime }}</span>
        </el-col>

      </el-row>
      <el-row style="margin-bottom: 30px"
              :gutter="24">
        <el-col :span="24">
          <span style="font-size: 15px;margin-left: 50px">流程名称: {{ basicInfoForm.processInstanceName }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="taskTitleMobile">
      <el-row style="margin-bottom: 30px"
              :gutter="24">
        <el-col :span="24">
          <span style="font-size: 15px;margin-left: 50px">发起人:{{ this.basicInfoForm.nickName }}</span>
        </el-col>
        <el-col :span="24">
          <span style="font-size: 15px;margin-left: 50px">填报部门: {{ basicInfoForm.deptName }}</span>
        </el-col>
        <el-col :span="24">
          <span style="font-size: 15px;margin-left: 50px">发起时间: {{ basicInfoForm.startTime }}</span>
        </el-col>

      </el-row>
      <el-row style="margin-bottom: 30px"
              :gutter="24">
        <el-col :span="24">
          <span style="font-size: 15px;margin-left: 50px">流程名称: {{ basicInfoForm.processInstanceName }}</span>
        </el-col>
      </el-row>
    </div>
    <!--    填报数据-->
    <el-divider content-position="left">填报数据</el-divider>
    <el-col :span="1.5">
      <el-button type="primary"
                 plain
                 icon="el-icon-plus"
                 size="mini"
                 v-if="processInstanceData.isFirst"
                 @click="handleAdd">新增
      </el-button>
    </el-col>

    <el-table v-loading="loading"
              :data="purchaseProjectsList">
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
                       prop="supplierContactName"
      />
      <el-table-column label="供应商联系电话"
                       align="center"
                       prop="supplierContactPhone"
      /> -->
      <!-- <el-table-column label="预算类型"
                       align="center"
                       prop="budgetType"
      /> -->
      <!-- <el-table-column label="预算项目"
                       align="center"
                       prop="projectId" /> -->
      <!--  -->
      <el-table-column label="操作"
                       align="center"
                       width="100"
                       v-if="processInstanceData.isFirst"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)">修改
          </el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0"
                :total="total"
                :page.sync="pageNum"
                :limit.sync="pageSize"
                @pagination="getList" />

    <!--    流程进度-->
    <el-divider content-position="left"
                class="text">流程进度
    </el-divider>
    <el-steps style="width: 100%;"
              align-center
              v-if="this.processInstanceData.records.length>0"
              :active="processInstanceData.endTime?this.processInstanceData.records.length+2:this.processInstanceData.records.length+1"
              finish-status="success">
      <!--      发起-->
      <el-step title="发起"
               status="success" />
      <!--      审批-->
      <el-step v-for="(record ,index) in processInstanceData.records"
               :key="record.id"
               :title="record.activityName"
               :status="formatRecordStatus(record)"
               :icon="formatRecordIcon(index)">
        <!--               :icon="index===processInstanceData.records.length-1?'el-icon-loading':''"-->
      </el-step>
      <!--      更多-->
      <el-step v-if="!processInstanceData.endTime"
               icon="el-icon-more"
               status="wait" />
      <!--      结束-->
      <el-step title="结束"
               :status="processInstanceData.endTime?'success':'wait'"
               :icon="processInstanceData.endTime?'':'el-icon-circle-check'" />
    </el-steps>

    <!--    审批详情-->
    <el-divider content-position="left"
                class="text">审批详情
    </el-divider>
    <el-timeline v-loading="recordLoading"
                 :reverse=true>

      <!--        发起-->
      <el-timeline-item :color="'#909399'">
        <el-card>
          <h4 class="clearfix">环节名称:发起</h4>
          <el-divider class="divider-header" />
          <div>
            {{ processInstanceData.processStartUser.nickName }} 于 {{ processInstanceData.startTime }} 发起
            {{ processInstanceData.processInstanceName }}
          </div>
        </el-card>
      </el-timeline-item>
      <!--        审批节点-->
      <el-timeline-item v-for="(record ,index) in processInstanceData.records"
                        :key="index"
                        placement="top"
                        :color="record.endTime?'#909399':'#0bbd87'">
        <!--          :color="record.endTime?'#909399':'#0bbd87'"-->
        <el-card>
          <h4 class="clearfix">环节名称:{{ record.activityName }}</h4>
          <el-divider class="divider-header" />
          <!--            只有结束的活动才显示意见信息-->
          <div v-if="record.endTime">
            <!--              开始结束节点只显示提交时间-->
            <!--              <div v-if="record.activityType==='startEvent'">{{ processInstanceData.processStartUser.nickName }} 提交于-->
            <!--                {{ record.endTime }}-->
            <!--              </div>-->
            <!--              <div v-else>-->
            <div>
              <h4>审批意见:</h4>
              <p style="text-indent: 2em"
                 v-for="comment in record.comments"
                 :key="comment.id">
                {{ comment.message }}</p>
              <el-divider class="divider-header" />
              <div class="bottom clearfix">
                {{ record.assignee.nickName }} 于 {{ record.endTime }} 提交
              </div>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
      <!--        结束-->
      <el-timeline-item v-if="processInstanceData.endTime"
                        :color="'#0bbd87'">
        <el-card>
          <h4 class="clearfix">环节名称:结束</h4>
          <el-divider class="divider-header" />
          <div>
            <!--              {{ processInstanceData.processStartUser.nickName }} 于 {{ processInstanceData.startTime }} 结束-->
            流程 {{ processInstanceData.processInstanceName }} 于 {{ processInstanceData.endTime }} 结束
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

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
                    @focus="budgetOpen=true"
                    placeholder="请选择预算项目" />
          <el-input v-model="form.projectName"
                    key="预算外"
                    v-if="paramsType == '预算外'"
                    placeholder="请输入预算项目" />
        </el-form-item>
        <!-- <el-form-item label="预算项目"
                      prop="projectId">
          <el-input v-model="form.projectId"
                    placeholder="请输入预算项目" />
        </el-form-item> -->
        <!-- <el-form-item label="申请ID"
                      prop="applyId">
          <el-input v-model="form.applyId"
                    placeholder="请输入申请ID" />
        </el-form-item> -->
        <el-form-item label="数量"
                      prop="num">
          <el-input v-model.number="form.num"
                    type="number"
                    :placeholder="paramsType == '预算内' ? '剩余预算数量：'+restNum :'请输入预算数量' " />
        </el-form-item>
        <el-form-item label="预算金额"
                      prop="budgetCost">
          <el-input v-model.number="form.budgetCost"
                    @input="isBudgetType"
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
        <el-form-item label="推荐品牌"
                      prop="supplier">
          <el-input v-model="form.supplier"
                    ref="supplier"
                    placeholder="请输入推荐品牌" />
        </el-form-item>
        <!-- <el-form-item label="供应商联系人"
                      v-show="supplierFlag"
                      prop="supplierContactName"
        >
          <el-input v-model="form.supplierContactName"
                    placeholder="请输入推荐供应商联系人"
          />
        </el-form-item>
        <el-form-item label="供应商电话"
                      v-show="supplierFlag"
                      prop="supplierContactPhone"
        >
          <el-input v-model="form.supplierContactPhone"
                    placeholder="请输入推荐供应商联系电话"
          />
        </el-form-item> -->
        <el-form-item label="申购原因"
                      prop="reason">
          <el-input v-model="form.reason"
                    type="textarea"
                    placeholder="请输入申购原因" />
        </el-form-item>
        <!-- <el-form-item label="项目预算"
                      prop="budgetType"
        >
          <el-input disabled v-model="form.budgetType"/>
        </el-form-item> -->
        <!-- <el-form-item label="乐观锁"
                      prop="revision">
          <el-input v-model="form.revision"
                    placeholder="请输入乐观锁" />
        </el-form-item>
        <el-form-item label="创建人"
                      prop="createdBy">
          <el-input v-model="form.createdBy"
                    placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="创建时间"
                      prop="createdTime">
          <el-date-picker clearable
                          size="small"
                          v-model="form.createdTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新人"
                      prop="updatedBy">
          <el-input v-model="form.updatedBy"
                    placeholder="请输入更新人" />
        </el-form-item>
        <el-form-item label="更新时间"
                      prop="updatedTime">
          <el-date-picker clearable
                          size="small"
                          v-model="form.updatedTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择更新时间">
          </el-date-picker>
        </el-form-item> -->
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitFormList">确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <selectBudget :year="basicInfoForm.year"
                  :open.sync="budgetOpen"
                  :deptId="deptId"
                  @handleSelect="handleSelectBudget" />
    <selectSupplier :open.sync="supplierOpen"
                    @handleSelect="handleSelectSupplier" />

    <!--    审批modal-->

    <el-dialog title="任务审批"
               :visible.sync="submitFormVisible"
               class="taskModel"
               center
               @close="resetSubmitForm('submitForm')">
      <el-form ref="submitForm"
               :rules="taskRules"
               :model="submitForm"
               label-width="80px">
        <el-form-item label="是否通过"
                      prop="opinion">
          <el-radio-group v-model="submitForm.opinion">
            <el-radio :label=1>是</el-radio>
            <el-radio :label=0>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见"
                      prop="comment">
          <el-input type="textarea"
                    v-model="submitForm.comment"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="submitFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitFormAction()">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { submitTask } from '@/api/processAction/taskAction'
import {
  listPurchaseProjects,
  getPurchaseProjects,
  delPurchaseProjects,
  addPurchaseProjects,
  updatePurchaseProjects,
  exportPurchaseProjects
} from '@/api/purchaseProject/purchaseProjects'
import { listRecord, listRecordByTask } from '@/api/budget/review'
import { getApply } from '@/api/purchase/apply'
import { mapState } from 'vuex'
import selectBudget from '@/components/selectBudget'
import selectSupplier from '@/components/selectSupplier'
export default {
  name: 'ApplyReviewDetail',
  components: {
    selectBudget,
    selectSupplier
  },
  data() {
    return {
      open: false,
      submitFormVisible: false,
      submitForm: {
        comment: '',
        opinion: 1
      },
      processInstanceData: {
        records: [],
        processStartUser: {
          nickName: ''
        },
        endTime: null
      },
      basicInfoForm: {
        nickName: '',
        deptName: '',
        startTime: '',
        totalMoney: 0,
        comment: 'XXXXX',
        year: null
      },
      // 遮罩层
      loading: true,
      recordLoading: true,
      // 总条数
      total: 0,
      // 采购申请 表格数据
      purchaseProjectsList: [],
      //数据字典-资金来源
      // moneyFromOptions: [],
      // 分页
      pageNum: 1,
      pageSize: 10,
      // 查询参数
      queryParams: {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      },
      title: null,
      // 表单参数
      form: {},
      restMoney: '0',// 剩余预算金额（存储当前操作项目中的值）
      restNum: '0',// 剩余预算数量（存储当前操作项目中的值）
      budgetTypeOptions: [{ label: '预算内', value: '预算内' }, { label: '预算外', value: '预算外' }],// 当前剩余预算类型，预算内，预算外（存储当前操作项目中的值）
      supplierFlag: false,
      // 弹层显示状态
      budgetOpen: false,
      supplierOpen: false,
      // 表单校验
      rules1: {
        projectName: [
          { required: true, message: "预算项目不能为空", trigger: "blur" }
        ],
        deliveryDate: [
          { required: true, message: "交付日期不能为空", trigger: "blur" }
        ],
        budgetType: [
          { required: true, message: "项目预算不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "数量不能为空", trigger: "blur" },
          { type: 'number', min: 1, message: '数量不能小于1', trigger: 'blur' }
        ],
        budgetCost: [
          { required: true, message: "预算金额不能为空", trigger: "blur" },
          { type: 'number', min: 1, message: '预算金额不能小于1', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: "申购原因不能为空", trigger: "blur" }
        ],
      },
      rules: {
        projectName: [
          { required: true, message: "预算项目不能为空", trigger: "blur" }
        ],
        deliveryDate: [
          { required: true, message: "交付日期不能为空", trigger: "blur" }
        ],
        budgetType: [
          { required: true, message: "项目预算不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "数量不能为空", trigger: "blur" },
          { type: 'number', min: 1, message: '数量不能小于1', trigger: 'blur' }
        ],
        budgetCost: [
          { required: true, message: "预算金额不能为空", trigger: "blur" },
          { type: 'number', min: 1, message: '预算金额不能小于1', trigger: 'blur' }
        ],
      },
      taskRules: {
        comment: [
          { required: true, message: '审批意见不能为空', trigger: 'change' }
        ],
      },
      paramsType: null,
      outer: false, //是否是外部项目打开
      //级联配置
      // cascaderOptions: [],//项目
      // cascaderDeptOptions: [],//部门
      // cascaderProps: { expandTrigger: 'hover', value: 'id', label: 'label' },
    }
  },
  created() {
    this.getRecordList();
    this.getBatchDataById();
    this.getList();
    this.outer = this.$route.path.includes('/outer/');
  },
  methods: {
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
        updatedTime: null
      }
      this.budgetFlag = false
      this.supplierFlag = false
      this.restMoney = '0';
      this.restNum = '0';
      this.resetForm('form')
    },
    /** 提交按钮 */
    submitFormFun() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.batchId = this.$route.params.bizId
          if (this.form.id != null) {
            updatePurchaseProjects(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addPurchaseProjects(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getPurchaseProjects(id).then(response => {
        this.form = response.data;
        this.form.budgetCost = +(response.data.budgetCost);
        this.form.num = +(response.data.num);
        this.open = true
        this.title = '修改采购申请';
        this.supplierFlag = true;
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加采购申请 '
    },
    formatRecordIcon(index) {
      let icon = ''
      // 是当前节点
      if (index === this.processInstanceData.records.length - 1) {
        if (!this.processInstanceData.endTime) {
          icon = 'el-icon-loading'
        }
      }
      return icon
    },
    formatRecordStatus(record) {
      let status = 'success'
      if (record.endTime == null) {
        status = 'process'
      } else {
        if (record.opinion != null) {
          switch (record.opinion) {
            case 1:
              status = 'success'
              break
            case 0:
              status = 'error'
              break
          }
        }
      }
      return status
    },
    showSubmitActionButton() {
      return this.$route.params.state === 'running' && !this.processInstanceData.endTime
    },
    submitFormAction() {
      this.$refs['submitForm'].validate(valid => {
        if (valid) {
          submitTask(this.$route.params.id, this.submitForm).then(res => {
            console.log(res)
            //信息
            this.msgSuccess(res.msg)
            //弹层
            this.submitFormVisible = false
            if (res.code == '200') {
              if (this.outer) {
                // 当前是外部项目打开的页面，如果提交流程成功，发送postMessage给iframe父页面，让他关闭这个页面
              } else {
                this.backRouter();
              }
            }
          })
        }
      });
    },
    resetSubmitForm(formName) {
      this.$refs[formName].resetFields()
    },
    showSubmitForm() {
      this.submitFormVisible = true
    },
    getBatchDataById() {
      getApply(this.$route.params.bizId).then(res => {
        console.log('-----------当前待办信息', res)
        if (res.data) {
          this.basicInfoForm.year = res.data.budgetYear
          this.paramsType = res.data.budgetType
        }
      })
    },
    /** 查询登录日志列表 */
    getList() {
      this.loading = true
      this.queryParams.applyId = this.$route.params.bizId
      this.queryParams.pageNum = this.pageNum
      this.queryParams.pageSize = this.pageSize
      listPurchaseProjects(this.queryParams).then(response => {
        this.purchaseProjectsList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    initRecordData: function (res) {
      this.processInstanceData = res.data
      this.basicInfoForm.nickName = this.processInstanceData.processStartUser.nickName
      this.basicInfoForm.deptName = this.processInstanceData.processStartUser.deptName
      this.basicInfoForm.startTime = this.processInstanceData.startTime
      this.basicInfoForm.processInstanceName = this.processInstanceData.processInstanceName
      this.recordLoading = false
    },
    getRecordList() {
      this.recordLoading = true
      let data
      if ('running' === this.$route.params.state) {
        listRecordByTask(this.$route.params.id).then(res => {
          this.processInstanceData = res.data
          this.basicInfoForm.nickName = this.processInstanceData.processStartUser.nickName
          this.basicInfoForm.deptName = this.processInstanceData.processStartUser.deptName
          this.basicInfoForm.startTime = this.processInstanceData.startTime
          this.basicInfoForm.processInstanceName = this.processInstanceData.processInstanceName
          this.recordLoading = false
        })
      } else {
        listRecord(this.$route.params.id).then(res => {
          this.processInstanceData = res.data
          this.basicInfoForm.nickName = this.processInstanceData.processStartUser.nickName
          this.basicInfoForm.deptName = this.processInstanceData.processStartUser.deptName
          this.basicInfoForm.startTime = this.processInstanceData.startTime
          this.basicInfoForm.processInstanceName = this.processInstanceData.processInstanceName
          this.recordLoading = false
        })
      }

    },
    /** 列表提交按钮 */
    submitFormList() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log('提交的id', this.$route.params.bizId, this.form)
          this.form.applyId = this.$route.params.bizId
          if (this.form.id != null) {
            updatePurchaseProjects(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addPurchaseProjects(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
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
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    //  /**获取项目分类树节点 */
    //   getSelectThree() {
    //     projectTypeTreeselect().then(response => {
    //       console.log(response.data)
    //       this.cascaderOptions = response.data
    //     })
    //   },
    /**获取部门分类树节点 */
    // getSelectOneThree() {
    //   deptTreeselect().then(response => {
    //     console.log(response.data)
    //     this.cascaderDeptOptions = response.data
    //   })
    // },
    /**项目级联选择触发 */
    // handleCascaderChangeOne(value) {
    //   console.log('级联选择触发-项目-查询条件', value, value[value.length - 1])
    //   this.queryParams.projectId = value[value.length - 1]
    // },
    // handleCascaderChangeTwo(value) {
    //   console.log('级联选择触发-项目-编辑', value)
    //   this.form.projectId = value[value.length - 1]
    // },
    // handleCascaderChangeThree(value) {
    //   console.log('级联选择触发-部门-查询条件', value, value[value.length - 1])
    //   this.queryParams.deptId = value[value.length - 1]
    // },
    // handleCascaderChangeFour(value) {
    //   console.log('级联选择触发-部门-编辑', value)
    //   this.form.deptId = value[value.length - 1]
    // },
    /** 新增按钮操作 选择部门*/
    handleSelectBudget(data) {
      setTimeout(() => {
        let form = this.form
        console.log('接受选择的部门值', data)
        form.projectId = data.id
        form.projectName = data.projectName
        form.deptId = data.deptId
        form.deptName = data.deptName
        form.budgetYear = data.budgetYear
        // form.id = data.id;
        form.nickName = data.nickName
        form.specification = data.specification
        form.moneyFrom = data.moneyFrom

      })
      this.restMoney = data.restMoney
      this.restNum = data.restNum || '0';
      this.budgetFlag = true
    },
    /** 新增按钮操作 选择供应商*/
    handleSelectSupplier(data) {
      console.log('接受选择的部门值', data)
      setTimeout(() => {
        let form = this.form
        form.supplier = data.companyName
        form.supplierContactPhone = data.phone
        form.supplierContactName = data.businessContact
      })
      this.supplierFlag = true
    },
    /**预算金额类型判断 */
    isBudgetType() {
      // console.log(this.form.budgetMoney,this.restMoney)
      this.form.budgetCost > this.restMoney ? this.form.budgetType = '预算外' : this.form.budgetType = '预算内'
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除采购预算 编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delPurchaseProjects(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    openSupplier() {
      this.supplierOpen = true
      this.$refs.supplier.blur()
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    backRouter() {
      let view = this.$route
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    }
  },
  computed: {
    ...mapState({
      'deptId': state => state.user.deptId,
      'userId': state => state.user.userId,
      'nickName': state => state.user.nickName
    })
  }
}
</script>

<style lang="scss">
.divider-header {
  margin: 12px 0;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>
