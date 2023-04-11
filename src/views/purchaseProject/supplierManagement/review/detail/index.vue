<template>
  <!-- 供应商待办详情 -->
  <div class="app-container taskMain">
    <el-page-header @back="backRouter"
                    content="详情页面"
                    v-if="!outer" />
    <div v-if="outer"
         style="font-size: 18px; color: #303133;">供应商待办详情</div>
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
        <el-col :span="8"
                v-if="basicInfoForm.deptName">
          <span style="font-size: 15px;margin-left: 50px">填报部门: {{ basicInfoForm.deptName }}</span>
        </el-col>
        <el-col :span="8">
          <span style="font-size: 15px;margin-left: 50px">发起时间: {{ basicInfoForm.startTime }}</span>
        </el-col>

      </el-row>
      <el-row style="margin-bottom: 30px"
              :gutter="24">
        <el-col :span="8">
          <span style="font-size: 15px;margin-left: 50px">流程名称: {{ basicInfoForm.processInstanceName }}</span>
        </el-col>
        <!-- <el-col :span="8">
          <span style="font-size: 15px;margin-left: 50px">预算总额: {{ basicInfoForm.totalMoney }}</span>
        </el-col>
        <el-col :span="8">
          <span style="font-size: 15px;margin-left: 50px">备注: {{ basicInfoForm.comment }}</span>
        </el-col> -->
      </el-row>
    </div>
    <div class="taskTitleMobile">
      <el-row style="margin-bottom: 30px"
              :gutter="24">
        <el-col :span="24">
          <span style="font-size: 15px;margin-left: 50px">发起人:{{ this.basicInfoForm.nickName }}</span>
        </el-col>
        <el-col :span="24"
                v-if="basicInfoForm.deptName">
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
        <!-- <el-col :span="24">
          <span style="font-size: 15px;margin-left: 50px">预算总额: {{ basicInfoForm.totalMoney }}</span>
        </el-col>
        <el-col :span="24">
          <span style="font-size: 15px;margin-left: 50px">备注: {{ basicInfoForm.comment }}</span>
        </el-col> -->
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
                 @click="goContent('add')">新增
      </el-button>
    </el-col>
    <el-table v-loading="loading"
              :data="supplierList">
      <!-- <el-table-column type="selection"
                       width="55"
                       align="center" /> -->
      <el-table-column label="序号"
                       align="center"
                       type="index" />
      <el-table-column label="公司名称"
                       align="center"
                       prop="companyName">
        <!-- <template slot-scope="scope">
            <el-button type="text" @click="goContent('see',scope.row)">{{scope.row.companyName}}</el-button>
        </template> -->
      </el-table-column>
      <el-table-column label="企业性质"
                       align="center"
                       prop="nature" />
      <el-table-column label="法人代表"
                       align="center"
                       prop="corporateRep" />
      <el-table-column label="业务联系人"
                       align="center"
                       prop="businessContact" />
      <el-table-column label="联系电话"
                       align="center"
                       prop="phone" />
      <el-table-column label="经营范围和主要产品及服务"
                       align="center"
                       prop="businessScope" />
      <el-table-column label="结算方式"
                       align="center"
                       prop="settlementModes" />
      <!-- :formatter="supplierTypeFormat"  -->
      <el-table-column label="供应商类型"
                       align="center"
                       prop="supplierType" />
      <el-table-column label="操作"
                       align="center"
                       width="200px"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="goContent('see',scope.row)">查看</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="goContent('update',scope.row)">修改</el-button>
          <!-- <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['supplier:supplier:remove']">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total>0"
                :total="total"
                :page.sync="pageNum"
                :limit.sync="pageSize" /> -->

    <!--    流程进度-->
    <el-divider content-position="left"
                class="text">流程进度</el-divider>
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
            {{ processInstanceData.processInstanceName }} 于 {{ processInstanceData.endTime }} 结束
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
import { getSupplier, delSupplier } from "@/api/supplier/supplier";
import { getById } from '@/api/budget/budgetBatch'
import { listRecord, listRecordByTask } from '@/api/budget/review'
import { projectTypeTreeselect } from '@/api/system/projectType'
import { treeselect as deptTreeselect } from '@/api/system/dept'
import { mapState } from 'vuex'
export default {
  name: 'SupplierReviewDetail',
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
        comment: 'XXXXX'
      },
      // 遮罩层
      loading: true,
      recordLoading: true,
      // 总条数
      total: 0,
      //供货商 表格数据
      supplierList: [],
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
      rules: {
        projectId: [
          { required: true, message: '项目不能为空', trigger: 'change' }
        ],
        budgetYear: [
          { required: true, message: '预算年份不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '填报部门不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '填报人不能为空', trigger: 'blur' }
        ],
        moneyFrom: [
          { required: true, message: '资金来源不能为空', trigger: 'change' }
        ],
        budgetMoney: [
          { required: true, message: '预算金额不能为空', trigger: 'blur' }
        ]
      },
      taskRules: {
        comment: [
          { required: true, message: '审批意见不能为空', trigger: 'change' }
        ],
      },
      //级联配置
      cascaderOptions: [],//项目
      cascaderDeptOptions: [],//部门
      cascaderProps: { expandTrigger: 'hover', value: 'id', label: 'label' },
      outer: false, //是否是外部项目打开
    }
  },
  created() {
    this.getRecordList()
    this.getBatchDataById()
    this.getList()
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
      getById(this.$route.params.bizId).then(res => {
        if (res.data) {
          this.basicInfoForm.totalMoney = res.data.totalMoney
        }
      })
    },
    /** 查询登录日志列表 */
    getList() {
      this.loading = true
      console.log('页面参数--------------', this.$route.params)
      getSupplier(this.$route.params.bizId).then(response => {
        this.supplierList.push(response.data)
        this.total = response.total
        this.loading = false
      })
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
    //跳转公司详情页
    goContent(type, data) {
      console.log(type, data)
      switch (type) {
        case 'add':
          this.$router.push(`/purchaseProject/supplierManagement/supplier/detail/空/update`)
          break;
        case 'update':
          this.$router.push(`/purchaseProject/supplierManagement/supplier/detail/${data.id}/update`)
          break;
        case 'see':
          this.$router.push(`/purchaseProject/supplierManagement/supplier/detail/${data.id}/空`)
          break;
        default:
          console.log('无匹配', type)
          break;
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除采购预算 编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delSupplier(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
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
      let view = this.$route;
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
  },
  computed: {
    ...mapState({
      'deptId': state => state.user.deptId,
      'userId': state => state.user.userId,
      'nickName': state => state.user.nickName
    })
  },
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
