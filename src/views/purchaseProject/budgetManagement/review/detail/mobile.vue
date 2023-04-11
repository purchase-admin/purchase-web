<template>
  <!--外部项目跳转的预算审核详情-移动端  -->
  <div class="app-container taskMain">
    <div style="font-size: 18px; color: #303133;">预算审核详情</div>
    <div v-if="processInstanceData.isFirst"
         style="color: #ff4949">移动端不可对填报数据进行编辑，请去电脑端进行操作！</div>
    <el-row :gutter="24">
      <el-col :span="10"
              :offset="14"
              style="border-radius: 4px;margin-right: 4px; text-align: right;">
        <el-button-group>
          <el-button type="primary"
                     size="mini"
                     v-show="showSubmitActionButton()"
                     @click="showSubmitForm"
                     icon="el-icon-edit">办理
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <!--    基本信息-->
    <el-divider content-position="left">基本信息</el-divider>
    <el-row style="margin-bottom: 20px"
            :gutter="24">
      <el-col :span="24">
        <span class="text-el-col">发起人:{{ this.basicInfoForm.nickName }}</span>
      </el-col>
      <el-col :span="24">
        <span class="text-el-col">填报部门: {{ basicInfoForm.deptName }}</span>
      </el-col>
      <el-col :span="24">
        <span class="text-el-col">发起时间: {{ basicInfoForm.startTime }}</span>
      </el-col>
      <el-col :span="24">
        <span class="text-el-col">流程名称: {{ basicInfoForm.processInstanceName }}</span>
      </el-col>
      <el-col :span="24">
        <span class="text-el-col">预算总额: {{ basicInfoForm.totalMoney }}</span>
      </el-col>
    </el-row>
    <!--    填报数据-->
    <el-divider content-position="left">填报数据</el-divider>
    <!-- <el-col :span="1.5">
      <el-button type="primary"
                 plain
                 icon="el-icon-plus"
                 size="mini"
                 v-if="processInstanceData.isFirst"
                 @click="handleAdd"
                 >新增
      </el-button>
    </el-col> -->

    <el-table v-loading="loading"
              :data="budgetList">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left"
                   inline
                   class="table-expand">
            <el-form-item label="规格型号">
              <span>{{ props.row.specification }}</span>
            </el-form-item>
            <el-form-item label="资金来源">
              <span>{{moneyFromFormat(props.row)}}</span>
            </el-form-item>
            <el-form-item label="预算金额">
              <span>{{ props.row.budgetMoney }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号"
                       width="55"
                       type="index" />
      <el-table-column label="项目"
                       min-width="200px"
                       prop="projectName" />
      <!--      <el-table-column label="预算年份" prop="budgetYear"/>-->
      <!--      <el-table-column label="填报部门" min-width="100px" show-overflow-tooltip prop="deptName"/>-->
      <!--      <el-table-column label="填报人" prop="nickName"/>-->
      <!-- <el-table-column v-if="processInstanceData.isFirst"
                       label="操作"
                       align="center"
                       width="100"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     >修改
          </el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     >删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination v-show="total>0"
                :total="total"
                small
                style="margin: 0;height: 38px;"
                :page.sync="pageNum"
                :limit.sync="pageSize"
                @pagination="getList" />
    <!--    流程进度-->
    <el-divider content-position="left"
                class="text">流程进度</el-divider>
    <el-steps style="width: 100%;"
              align-center
              direction="vertical"
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
                class="text">审批详情</el-divider>
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
          <div v-if="record.endTime">
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
                   @click="submitFormAction()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { submitTask } from '@/api/processAction/taskAction'
import {
  listBudget,
  getBudget,
  delBudget,
  addBudget,
  updateBudget,
} from '@/api/budget/budget'
import { getById } from '@/api/budget/budgetBatch'
import { listRecord, listRecordByTask } from '@/api/budget/review'
export default {
  name: 'BudgetReviewDetailMobile',
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
        comment: ''
      },
      // 遮罩层
      loading: true,
      recordLoading: true,
      // 总条数
      total: 0,
      // 采购预算 表格数据
      budgetList: [],
      //数据字典-资金来源
      moneyFromOptions: [],
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
      // 表单校验
      taskRules: {
        comment: [
          { required: true, message: '审批意见不能为空', trigger: 'change' }
        ],
      },
      baseForm: {},
      outer: false, //是否是外部项目打开
    }
  },
  created() {
    this.getRecordList()
    this.getList()
    this.getDicts(this.$DICT_TYPE.ZJLY).then((response) => {
      this.moneyFromOptions = response.data
    })
    this.outer = this.$route.path.includes('/outer/');
  },
  methods: {
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
              // 如果提交流程成功，发送postMessage给iframe父页面，让他关闭这个页面
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
      getById(this.$route.params.bizId).then(res => {
        if (res.data) {
          console.log('-----------当前待办信息', res.data)
          this.baseForm = res.data;
          this.basicInfoForm.totalMoney = res.data.totalMoney
        }
      })
    },
    /**  查询采购预算 列表 */
    getList() {
      this.loading = true
      this.queryParams.batchId = this.$route.params.bizId
      listBudget(this.queryParams).then(response => {
        this.getBatchDataById()
        this.budgetList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    getRecordList() {
      this.recordLoading = true
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
    // 资金来源字典翻译
    moneyFromFormat(row, column) {
      console.log('---------------------', row)
      return this.selectDictLabel(this.moneyFromOptions, row.moneyFrom)
    },
  },
}
</script>

<style lang="scss">
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
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
