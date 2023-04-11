<template>
  <div class="app-container">
    <el-page-header content="详情页面"></el-page-header>
    <el-divider content-position="left">基本信息</el-divider>
    <el-row style="margin-bottom: 30px" :gutter="20">
      <el-col :span="6">
        <span style="font-size: 15px;margin-left: 50px">发起人:管理员</span>
      </el-col>
      <el-col :span="6">
        <span style="font-size: 15px;margin-left: 50px">填报部门: 长报集团</span>
      </el-col>
      <el-col :span="6">
        <span style="font-size: 15px;margin-left: 50px">发起时间: 2020-04-08 14:52:36</span>
      </el-col>
      <el-col :span="6">
        <span style="font-size: 15px;margin-left: 50px">流程名称: 预算审批流程</span>
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 30px" :gutter="20">
      <el-col :xs="6" :span="6">
        <span style="font-size: 15px;margin-left: 50px">预算总额: 200000</span>
      </el-col>
      <el-col :span="6">
        <span style="font-size: 15px;margin-left: 50px">备注: XXXXXXXXXX</span>
      </el-col>
      <!--      <el-col :span="6">-->
      <!--        <span style="font-size: 15px;margin-left: 30px">发起时间: 2020-04-08 14:52:36</span>-->
      <!--      </el-col>-->
      <!--      <el-col :span="6">-->
      <!--        <span style="font-size: 15px;margin-left: 30px">流程名称: 预算审批流程</span>-->
      <!--      </el-col>-->
    </el-row>
    <!--    </el-card>-->


    <el-divider content-position="left">填报数据</el-divider>
    <el-table v-loading="loading" :data="list.slice((pageNum-1)*pageSize,pageNum*pageSize)" style="width: 100%;">
      <el-table-column label="序号" type="index" align="center">
        <template slot-scope="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center" prop="category" :show-overflow-tooltip="true"/>
      <el-table-column label="项目名称" align="center" prop="projectName" :show-overflow-tooltip="true"/>
      <el-table-column label="数量" align="center" prop="number" :show-overflow-tooltip="true"/>
      <el-table-column label="预算金额" align="center" prop="money" :show-overflow-tooltip="true"/>
      <el-table-column label="规格型号" align="center" prop="size"/>
      <el-table-column label="资金来源" align="center" prop="moneyFrom"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"/>
    <el-divider content-position="left" class="text">流程进度</el-divider>
    <el-steps style="width: 100%;" align-center="true" :active="3" finish-status="success">
      <el-step title="发起"></el-step>
      <el-step title="部门分管领导审批"></el-step>
      <el-step title="采购中心领导审批"></el-step>
      <el-step title="采购执行"></el-step>
      <el-step title="结束"></el-step>
    </el-steps>
    <el-divider content-position="left" class="text">审批详情</el-divider>
    <div class="block">
      <el-timeline>
        <el-timeline-item timestamp="2018/4/12" placement="top">
          <el-card>
            <h4>同意采购</h4>
            <p>采购中心主任 提交于 2018/4/12 20:46</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018/4/3" placement="top">
          <el-card>
            <h4>同意采购</h4>
            <p>部门分管主任 提交于 2018/4/3 20:46</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018/4/2" placement="top">
          <el-card>
            <h4>申请填报</h4>
            <p>王恒 提交于 2018/4/2 20:46</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { detailList } from '@/api/workflow/monitor'

export default {
  name: 'detail',
  data() {
    return {
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
        title: '',
        ProcessDefinitionKey: '',
        version: '',
        starter: '',
        assignee: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true
      this.list = detailList().rows
      this.total = detailList().rows.length
      this.loading = false
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
      this.$router.push('/workflow/monitor/detail')
    }
  }
}
</script>

<style>
</style>
