<template>
  <div class="app-container taskMain">
    <el-page-header @back="backRouter"
                    content="详情页面"
                    v-if="!outer" />
    <div v-if="outer"
         style="font-size: 18px; color: #303133;">预算审批详情</div>
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
        <el-col :span="16">
          <span style="font-size: 15px;margin-left: 50px">流程名称: {{ basicInfoForm.processInstanceName }}</span>
        </el-col>
        <el-col :span="8">
          <span style="font-size: 15px;margin-left: 50px">预算总额: {{ basicInfoForm.totalMoney }}</span>
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
        <el-col :span="24">
          <span style="font-size: 15px;margin-left: 50px">预算总额: {{ basicInfoForm.totalMoney }}</span>
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
              :data="budgetList">
      <!--      <el-table-column type="selection" width="55"/>-->
      <el-table-column label="序号"
                       width="55"
                       type="index" />
      <el-table-column label="项目"
                       min-width="200px"
                       show-overflow-tooltip
                       prop="projectName" />
      <!--      <el-table-column label="预算年份" prop="budgetYear"/>-->
      <!--      <el-table-column label="填报部门" min-width="100px" show-overflow-tooltip prop="deptName"/>-->
      <!--      <el-table-column label="填报人" prop="nickName"/>-->
      <el-table-column label="规格型号"
                       prop="specification" />
      <el-table-column label="资金来源"
                       :formatter="moneyFromFormat"
                       prop="moneyFrom" />
      <el-table-column label="预算金额"
                       prop="budgetMoney" />
      <el-table-column label="数量"
                       prop="num" />
      <el-table-column label="备注"
                       prop="remark" />
      <el-table-column v-if="processInstanceData.isFirst"
                       label="操作"
                       align="center"
                       width="100"
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
            流程 {{ processInstanceData.processInstanceName }} 于 {{ processInstanceData.endTime }} 结束
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <!-- 添加或修改采购预算 对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="102px">
        <el-form-item label="填报部门"
                      prop="deptId">
          <!-- <el-input v-model="form.deptId"
                    placeholder="请输入填报部门" /> -->
          <el-cascader clearable
                       :show-all-levels="false"
                       style="width:100%"
                       v-model="form.deptId"
                       :options="cascaderDeptOptions"
                       :props="cascaderProps"
                       disabled
                       @change="handleCascaderChangeFour"></el-cascader>
        </el-form-item>
        <el-form-item label="填报人">
          <el-input v-model="nickName"
                    disabled
                    placeholder="请输入填报人" />
        </el-form-item>
        <el-form-item label="项目"
                      prop="projectId">
          <el-cascader clearable
                       :show-all-levels="false"
                       style="width:100%"
                       v-model="form.projectId"
                       :options="cascaderOptions"
                       :props="cascaderProps"
                       @change="handleCascaderChangeTwo"></el-cascader>
        </el-form-item>
        <el-form-item label="预算年份"
                      prop="budgetYear">
          <!-- <el-input v-model="form.budgetYear"
                    placeholder="请输入预算年份" /> -->
          <el-date-picker v-model="form.budgetYear"
                          type="year"
                          format="yyyy"
                          disabled
                          value-format="yyyy"
                          placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="规格型号"
                      prop="specification">
          <el-input v-model="form.specification"
                    placeholder="请输入规格型号、技术要求" />
        </el-form-item>
        <el-form-item label="资金来源"
                      prop="moneyFrom">
          <el-select v-model="form.moneyFrom"
                     placeholder="请选择资金来源">
            <el-option v-for="dict in moneyFromOptions"
                       :key="dict.dictValue"
                       :label="dict.dictLabel"
                       :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="预算金额(元)"
                      prop="budgetMoney">
          <el-input v-model.number="form.budgetMoney"
                    type="number"
                    placeholder="请输入预算金额" />
        </el-form-item>
        <el-form-item label="数量"
                      prop="num">
          <el-input type="number"
                    v-model.number="form.num"
                    placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="备注"
                      prop="remark">
          <el-input v-model="form.remark"
                    type="textarea"
                    placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitFormFun">确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
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
import { projectTypeTreeselect } from '@/api/system/projectType'
import { treeselect as deptTreeselect } from '@/api/system/dept'
import { mapState } from 'vuex'
export default {
  name: 'BudgetReviewDetail',
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
      baseForm: {},
      //级联配置
      cascaderOptions: [],//项目
      cascaderDeptOptions: [],//部门
      cascaderProps: { expandTrigger: 'hover', value: 'id', label: 'label' },
      outer: false, //是否是外部项目打开
    }
  },
  created() {
    this.getRecordList()
    this.getSelectThree();
    this.getSelectOneThree();
    this.getList();
    this.getDicts(this.$DICT_TYPE.ZJLY).then((response) => {
      this.moneyFromOptions = response.data
    });
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
      }
      this.resetForm('form')
    },
    /** 提交按钮 */
    submitFormFun() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.batchId = this.$route.params.bizId
          if (this.form.id != null) {
            updateBudget(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBudget(this.form).then(response => {
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
      getBudget(id).then(response => {
        this.form = response.data
        this.form.budgetYear = this.baseForm.year
        this.open = true
        this.title = '修改采购预算 '
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.form.budgetYear = this.baseForm.year
      this.open = true
      this.title = '添加采购预算 '
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
      return this.selectDictLabel(this.moneyFromOptions, row.moneyFrom)
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
    /**获取项目分类树节点 */
    getSelectThree() {
      projectTypeTreeselect().then(response => {
        console.log(response.data)
        this.cascaderOptions = response.data
      })
    },
    /**获取部门分类树节点 */
    getSelectOneThree() {
      deptTreeselect().then(response => {
        console.log(response.data)
        this.cascaderDeptOptions = response.data
      })
    },
    /**项目级联选择触发 */
    // handleCascaderChangeOne(value) {
    //   console.log('级联选择触发-项目-查询条件', value, value[value.length - 1])
    //   this.queryParams.projectId = value[value.length - 1]
    // },
    handleCascaderChangeTwo(value) {
      console.log('级联选择触发-项目-编辑', value)
      this.form.projectId = value[value.length - 1]
    },
    // handleCascaderChangeThree(value) {
    //   console.log('级联选择触发-部门-查询条件', value, value[value.length - 1])
    //   this.queryParams.deptId = value[value.length - 1]
    // },
    handleCascaderChangeFour(value) {
      console.log('级联选择触发-部门-编辑', value)
      this.form.deptId = value[value.length - 1]
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除采购预算 编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delBudget(ids)
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
