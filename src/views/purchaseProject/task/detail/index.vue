<template>
  <div class="app-container"
       v-loading="loading">
    <el-row>
      <el-button type="primary"
                 @click="submitSend"
                 v-if="!viewData.executorName">发布</el-button>
    </el-row>
    <br />
    <a-descriptions title="设置"
                    bordered
                    :column="3"
                    style="word-break: break-all;word-wrap: break-word;">
      <a-descriptions-item label="执行人">
        <div v-if="viewData.executorName">
          {{viewData.executorName}}
        </div>
        <el-input ref="input1"
                  v-model="form.executorName"
                  v-else
                  @focus="selectUser"
                  placeholder="请选择执行人" />
      </a-descriptions-item>
      <a-descriptions-item label="采购方式">
        <div v-if="viewData.purchaseType">
          {{selectDictLabel(purchaseOptions, viewData.purchaseType)}}
        </div>
        <el-select v-model="form.purchaseType"
                   v-else
                   placeholder="请选择采购方式"
                   clearable
                   style="width: 100%"
                   size="small">
          <el-option v-for="dict in purchaseOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue" />
        </el-select>
      </a-descriptions-item>
      <!-- <a-descriptions-item label="截止日期">
        <el-date-picker clearable
            size="small"
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择截止日期">
          </el-date-picker>
      </a-descriptions-item> -->
    </a-descriptions>
    <br />
    <a-descriptions title="基本信息"
                    bordered
                    layout="vertical"
                    :column="4"
                    style="word-break: break-all;word-wrap: break-word;">
      <a-descriptions-item label="申购部门">
        {{viewData.deptName}}
      </a-descriptions-item>
      <a-descriptions-item label="经办人">
        {{viewData.userName}}
      </a-descriptions-item>
      <a-descriptions-item label="联系电话">
        {{viewData.userPhone}}
      </a-descriptions-item>
      <a-descriptions-item label="交付日期">
        {{viewData.deliveryDate}}
      </a-descriptions-item>
    </a-descriptions>
    <br />
    <a-descriptions title="项目信息"
                    bordered
                    layout="vertical"
                    :column="4"
                    style="word-break: break-all;word-wrap: break-word;">
      <a-descriptions-item label="项目名称">
        {{viewData.projectName}}
      </a-descriptions-item>
      <a-descriptions-item label="项目预算类型">
        {{viewData.budgetType}}
      </a-descriptions-item>
      <a-descriptions-item label="项目预算金额">
        {{viewData.budgetCost}}
      </a-descriptions-item>
      <a-descriptions-item label="项目数量">
        {{viewData.num}}
      </a-descriptions-item>
      <a-descriptions-item label="申购原因"
                           :span="4">
        {{viewData.reason||nullText}}
      </a-descriptions-item>
      <a-descriptions-item label="规格型号丶技术丶参数及服务要求"
                           :span="4">
        {{viewData.specification||nullText}}
      </a-descriptions-item>
    </a-descriptions>
    <br />
    <a-descriptions title="采购信息"
                    bordered
                    layout="vertical"
                    :column="3"
                    style="word-break: break-all;word-wrap: break-word;">
      <a-descriptions-item label="推荐品牌">
        {{viewData.supplier}}
      </a-descriptions-item>
      <!-- <a-descriptions-item label="供应商联系人">
        {{viewData.supplierContactName}}
      </a-descriptions-item>
      <a-descriptions-item label="供应商联系电话">
        {{viewData.supplierContactPhone}}
      </a-descriptions-item> -->
    </a-descriptions>
    <select-user-com :open.sync="userOpen"
                     @handleSelect="selectUserFun"></select-user-com>
  </div>
</template>
<script>
import { getPurchaseProjects as getDetails } from "@/api/purchaseProject/purchaseProjects";
import { addTask } from "@/api/purchaseTask/task";
import selectUserCom from "@/components/selectUser/bf";
export default {
  name: "taskDetails",
  components: {
    selectUserCom
  },
  data() {
    return {
      // 遮罩层
      loading: false,
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
      // 表格数据
      dataList: null,
      // 弹出层标题
      title: "",
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {
        projectId: "",
        executor: "",
        executorName: "",
        purchaseType: "",
        dept_id: "",
      },
      viewData: {},
      userOpen: false,
      nullText: '暂无数据',
      purchaseOptions: [
        { value: '123', label: '456' }
      ]
    };
  },
  mounted() {
    console.log('组件进入勒', this.$route.params.id)
    this.getDetails(this.$route.params.id);
    this.getDicts("CGFS").then((response) => {
      this.purchaseOptions = response.data;
    });
  },
  computed: {},
  watch: {},
  methods: {
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
    submitSend() {
      this.form.deptId = this.viewData.deptId;
      this.form.projectId = this.$route.params.id;
      console.log('点击提交', this.form)
      if (!(this.form.executorName + '')) {
        this.$message.warning("执行人不能为空");
        return true
      }
      if (!(this.form.purchaseType + '')) {
        this.$message.warning("采购方式不能为空");
        return true
      }
      addTask(this.form).then(response => {
        console.log('获取到了详情', response)
        if (response.code == 200) {
          this.$message({
            message: response.msg,
            type: 'success',
            duration: 1500
          });
          setTimeout(() => {
            let view = this.$route;
            this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
              if (this.isActive(view)) {
                this.toLastView(visitedViews, view)
              }
            })
          }, 1550);
        } else {
          this.$message.error(response.msg);
        }

      });
    },
    selectUser() {
      this.$refs.input1.blur();
      this.userOpen = true
    },
    selectUserFun(res) {
      console.log(res)
      this.form.executor = res.id;
      this.form.executorName = res.label;
    },
    /** 查询物资采购详情 */
    getDetails(id) {
      console.log('组件执行勒')
      this.loading = true;
      getDetails(id).then(response => {
        console.log('获取到了详情', response)
        this.viewData = response.data;
        this.loading = false;
      });
    },
  }
};
</script>