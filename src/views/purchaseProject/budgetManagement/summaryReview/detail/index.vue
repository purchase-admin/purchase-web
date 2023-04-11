<template>
  <!-- 预算汇总审批详情 -->
  <div class="app-container taskMain">
    <el-page-header @back="backRouter"
                    content="详情页面"
                    v-if="!outer" />
    <div v-if="outer"
         style="font-size: 18px; color: #303133;">预算汇总审批详情</div>
    <el-row :gutter="24">
      <el-col :span="10"
              :offset="14"
              style="border-radius: 4px;margin-right: 4px; text-align: right;">
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
                 @click="handleOpen('update')">新增
      </el-button>
    </el-col>

    <el-table v-loading="loading"
              :data="budgetList">
      <el-table-column label="序号"
                       align="center"
                       width="55"
                       type="index" />
      <el-table-column label="标题"
                       align="center"
                       min-width="200px"
                       show-overflow-tooltip
                       prop="title">
        <template slot-scope="scope"> 
            <el-button type="text" @click="detailsOpenFun(scope.row)">{{scope.row.title}}</el-button>
          </template>
      </el-table-column>
      <el-table-column label="填报部门"
                       align="center"
                       min-width="100px"
                       show-overflow-tooltip
                       prop="deptName" />
      <el-table-column label="年份"
                       align="center"
                       prop="year" />
      <el-table-column label="预算条数"
                       align="center"
                       prop="budgetNum" />
      <el-table-column label="合计预算金额"
                       align="center"
                       prop="totalMoney" />
      <el-table-column label="操作"
                       v-if="processInstanceData.isFirst"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button size="mini"
                    type="text"
                    v-show="scope.row.status=='0'"
                    icon="el-icon-s-promotion"
                    @click="handleSubmitFlow(scope.row)"
          >提交</el-button> -->
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleOpen('update',scope.row)"
          >修改</el-button> -->
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="showSubmitBackForm(scope.row)">退回
          </el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <view-list-data @update-list="getList"
                    @updateOpen="updateFun"
                    :dYear="cYear"
                    :dIds="cIds"
                    :open="cDataOpen"
                    :dId="cId"
                    :dType="cType"></view-list-data>
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

    <!-- 回退确认弹层 -->
    <el-dialog title="退回"
               :visible.sync="submitBackFormVisible"
               width="30%"
               center
               @close="resetSubmitForm('submitBackForm')">
      <el-form ref="submitBackForm"
               :model="submitBackForm"
               label-width="80px">
        <el-form-item label="退回意见"
                      prop="comment">
          <el-input type="textarea"
                    v-model="submitBackForm.comment"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="submitBackFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitBackFormAction()">确 定
        </el-button>
      </div>
    </el-dialog>
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
    <see-budgets-details :open.sync="detailsOpen" :detailsId="detailsId"></see-budgets-details>
  </div>
</template>

<script>
import viewListData from '../../summary/components/viewListData'
import SeeBudgetsDetails from "@/components/SeeBudgetsDetails"
import { submitTask } from '@/api/processAction/taskAction'
import { submitBackTask } from '@/api/budget/budgetBatch'
import {
  getById,
  listCollectBudgetList as listCollectBudget,
  deleteListCollectBudgetList as deleteListCollectBudget
} from '@/api/budget/budget'
import { listRecord, listRecordByTask } from '@/api/budget/review'
import { mapState } from 'vuex'

export default {
  name: 'BudgetSummaryReviewDetail',
  components: { viewListData, SeeBudgetsDetails },
  data() {
    return {
      open: false,
      submitFormVisible: false,
      submitForm: {
        comment: '',
        opinion: 1
      },
      // 退回弹层
      backIds: null, //当前回退的id
      submitBackFormVisible: false,
      submitBackForm: {
        comment: ''
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
        comment: 'XXXXX'
      },
      // 遮罩层
      loading: true,
      recordLoading: true,
      // 总条数
      total: 0,
      // 采购预算 表格数据
      budgetList: [],
      // 分页
      pageNum: 1,
      pageSize: 10,
      // 查询参数
      // queryParams: {
      //   pageNum: this.pageNum,
      //   pageSize: this.pageSize
      // },
      title: null,
      // 表单参数
      form: {},
      // 弹层显示的数据值
      cDataOpen: false,
      cId: '',
      cType: '',
      cIds: '',
      cYear: '',
      cParams: {},
      baseObj: {},
      taskRules: {
        comment: [
          { required: true, message: '审批意见不能为空', trigger: 'change' }
        ],
      },
      detailsOpen: false,
      detailsId: null,
      outer: false, //是否是外部项目打开
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
        projectId: null,
        budgetYear: null,
        deptId: this.deptId,
        userId: this.userId,
        specification: null,
        moneyFrom: null,
        budgetMoney: null,
        remark: null
      };
      this.resetForm('form');
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
    // 退回
    submitBackFormAction() {
      submitBackTask({
        id: this.$route.params.bizId,
        ids: this.backIds,
        comment: this.submitBackForm.comment
      }).then(res => {
        console.log(res)
        //信息
        this.msgSuccess(res.msg)
        //弹层
        this.submitBackFormVisible = false
        if (res.code == '200') {
          this.getList()
        }
      })
    },
    showSubmitBackForm(row) {
      this.backIds = row.id
      this.submitBackFormVisible = true
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
    // 获取当前流程基础信息
    getBatchDataById() {
      getById(this.$route.params.bizId).then(res => {
        if (res.data) {
          this.baseObj = res.data
          console.log('-----------当前待办信息', res.data)
          // this.cYear = res.data.year;
          // this.basicInfoForm.totalMoney = res.data.totalMoney
        }
      })
    },
    /** 查询采购预算汇总 列表 */
    getList() {
      this.cType = ''
      this.loading = false
      // this.queryParams.batchId = this.$route.params.bizId
      console.log('666666666', this.queryParams)
      // this.queryParams.budgetYear = (this.queryParams.budgetYear)
      listCollectBudget(this.$route.params.bizId, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(response => {
        console.log('预算汇总实例详情列表接口', response)
        this.budgetList = response.rows.map(ele => {
          ele.visible = false
          return ele
        })
        console.log('映射后', this.budgetList)
        this.loading = false
        this.total = response.total
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
    // 清除弹层数据操作,flag true表示查看，其他状态表示新增-修改
    updateFun() {
      this.cId = ''
      this.cIds = ''
      this.cYear = ''
      this.cDataOpen = false
      console.log('清除数据关闭弹层', this.cDataOpen)
    },
    //  提交勾选的数据走流程
    handleSubmitFlow(row) {
      const startParams = {}
      startParams.processDefinitionKey = this.$route.meta.params.KEY
      startParams.businessKey = row.id
      startParams.title = row.title
      startProcess(startParams).then((res) => {
        this.msgSuccess(res.msg)
        this.getList()
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let bizId = this.$route.params.bizId
      const ids = row.id || this.ids
      this.$confirm('是否确认删除预算汇总 编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return deleteListCollectBudget(bizId, ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 弹层编辑操作 */
    handleOpen(type, row = {}) {
      console.log(type, row)
      // this.cId = id;
      this.cType = type
      // let ids =
      // console.log('ids',ids)
      // if(row && row.id){
      this.cId = this.$route.params.bizId
      this.cIds = this.budgetList.map((item) => {
        return item.id
      }).join(',')
      this.cYear = this.baseObj.year
      // }
      // this.cParams = {
      //   type: type,
      //   id: row.id,
      //   ids: row.budgetBatchIds,
      //   year: row.year
      // }
      this.cDataOpen = true
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
    },
    detailsOpenFun(row) {
      this.detailsOpen = true;
      this.detailsId = row.id;
    },
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

<style>
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
