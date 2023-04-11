<template>
  <!-- 询价采购详情 -->
  <div class="app-container"
       v-loading="loading">
    <el-row>
      <el-button type="primary"
                 @click="submitSend"
                 v-if="!confirmSelectType && !updatedBtn">发布</el-button>
      <el-button type="primary"
                 @click="submitUpdetdSend"
                 v-if="updatedBtn">{{isStart ? '确认作废' : '确认修改'}}</el-button>
      <el-button type="primary"
                 @click="backRouter"
                 v-if="confirmSelectType || updatedBtn">返回</el-button>
    </el-row>
    <br />
    <a-descriptions title="设置"
                    bordered
                    :column="2"
                    style="word-break: break-all;word-wrap: break-word;">
      <a-descriptions-item label="是否公开">
        <el-switch v-model="form.isOpen"
                   active-value="1"
                   inactive-value="0"
                   v-if="!confirmSelectType"></el-switch>
        <div v-else>{{['指定投标','公开投标'][viewData.isOpen]}}</div>
      </a-descriptions-item>
      <a-descriptions-item label="报价截止时间">
        <el-date-picker v-if="!confirmSelectType"
                        v-model="form.endTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择截止日期">
        </el-date-picker>
        <div v-else>{{viewData.endTime}}</div>
      </a-descriptions-item>

      <a-descriptions-item label="选择供应商"
                           v-if="form.isOpen === '0' && !confirmSelectType">
        <el-input ref="input1"
                  v-model="viewData.companyName"
                  @focus="selectSupplier"
                  placeholder="请选择供应商" />
      </a-descriptions-item>
      <a-descriptions-item label="确认供应商"
                           v-if="confirmSelectType">
        <el-input ref="input2"
                  v-model="checkItem"
                  @focus="selectConfirmSupplier"
                  placeholder="请选择供应商" />
      </a-descriptions-item>
      <!-- 
      <a-descriptions-item label="采购方式">
        <el-select v-model="form.purchaseType"
                   placeholder="请选择采购方式"
                   clearable
                   style="width: 100%"
                   size="small">
          <el-option v-for="dict in purchaseOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue" />
        </el-select>
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
    <!-- layout="vertical" -->
    <a-descriptions title="采购信息"
                    bordered
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
      <a-descriptions-item label="执行人">
        {{viewData.executorName}}
      </a-descriptions-item>
      <a-descriptions-item label="采购方式">
        {{moneyFromFormat(viewData.purchaseType)}}
      </a-descriptions-item>
    </a-descriptions>
    <select-supplier-com :open.sync="supplierOpen"
                         :taskId="selectSupplieTaskId"
                         @handleSelect="selectSupplierFun"></select-supplier-com>
    <select-supplier-confirm-com :open.sync="supplierConfirmOpen"
                                 :taskId="viewData.taskId"
                                 :result="viewData"
                                 @handleSuccess="getDetails"
                                 @handleSelect="selectSupplierConfirmFun"
                                 :endTime="viewData.endTime"></select-supplier-confirm-com>
  </div>
</template>
<script>
import { listSupplierConfirm } from "@/api/purchase/supplier";
import { getPurchaseProjects as getDetails } from "@/api/purchaseProject/purchaseProjects";
import { addPurchaseTaskToDolistTask as addTask, addPurchaseTaskToDolistTaskOpen as addTaskOpen, resetPurchaseTaskToDolistTask as resetTask, resetPurchaseTaskToDolistTaskOpen as resetTaskOpen } from "@/api/purchaseTask/task";
import selectSupplierCom from "@/components/selectSupplier/selectMore";
import selectSupplierConfirmCom from "../components/selectSupplier";
export default {
  name: "purchaseTaskToDoDetails",
  components: {
    selectSupplierCom,
    selectSupplierConfirmCom
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
        supplier: "",
        taskId: "",
        isOpen: "0", // 是否公开投标
        endTime: null
      },
      viewData: {},
      supplierOpen: false,
      supplierConfirmOpen: false,
      nullText: '暂无数据',
      purchaseOptions: [],
      confirmSelectType: false, // 当前页面是确认供应商中标，还是选择供应商以待指定中标，默认待指定中标页面
      checkItem: null,// 中标人员
      updatedBtn: false,// 更新按钮是否显示
      isStart: false,// 是否有人参与了招标
      selectSupplieTaskId: null
    };
  },
  mounted() {
    console.log('组件进入勒', this.$route.params.id)
    this.selectSupplieTaskId = this.$route.params.id;
    this.$route.params.id
    this.getDetails();
    this.getDicts("CGFS").then((response) => {
      this.purchaseOptions = response.data;
    });

  },
  computed: {},
  watch: {},
  methods: {
    // 获取中标的人员
    getCheckSupplier() {
      return new Promise((resolve) => {
        listSupplierConfirm({
          taskId: this.viewData.taskId
        }).then(response => {
          console.log(response)
          let checkItemFlag = false;
          let flag = false;
          response.rows.forEach((ele) => {
            // flag没有赋值过，并且当前项有报价就执行
            if (!flag && ele.quotationFilePath) {
              flag = true;
            }
            if (ele.isCheck === '1') {
              checkItemFlag = true;
              this.checkItem = ele.supplierName;
            }
          })
          if (!checkItemFlag) {
            this.checkItem = '';
          }
          resolve(response.rows && response.rows.length > 0 && flag)
        });
      })
    },
    // 采购方式字典翻译
    moneyFromFormat(data) {
      return this.selectDictLabel(this.purchaseOptions, data);
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
    // 修改或者作废
    submitUpdetdSend() {
      // 如果有已经有人参加了招标，就无法修改，只能作废，
      if (this.isStart) {
        this.resetSubmitSend();
      } else {
        this.submitSend();
      }
    },
    resetSubmitSend() {
      // addTask非公开招标 addTaskOpen 公开招标
      let taskFun = [resetTask, resetTaskOpen],
        // params = {},
        form = this.form;
      taskFun[form.isOpen]({
        taskId: form.taskId
      }).then(response => {
        console.log('作废成功', response)
        if (response.code == 200) {
          this.$message({
            message: response.msg,
            type: 'success',
            duration: 1500
          });
          if (!this.updatedBtn) {
            setTimeout(() => {
              this.backRouter();
            }, 1550);
          } else {
            this.getDetails();
          }
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    // 编辑当前招标
    submitSend() {
      // addTask非公开招标 addTaskOpen 公开招标
      let taskFun = [addTask, addTaskOpen],
        params = {},
        form = this.form;
      if (!form.endTime) {
        this.$message.error(`报价截止时间不能为空`);
        return true;
      }
      if (form.isOpen === '1') {
        // 公开招标那么，supplier为空
        form.supplier = '';
        params = {
          id: form.taskId,
          isOpen: form.isOpen,
          endTime: form.endTime
        }
      } else {
        if (!form.supplier) {
          this.$message.error(`非公开招标情况下，供应商不能为空`);
          return true;
        }
        params = {
          taskId: form.taskId,
          supplier: form.supplier,
          endTime: form.endTime,
          isOpen: form.isOpen,
        }
      }
      taskFun[form.isOpen](params).then(response => {
        console.log('获取到了详情', response)
        if (response.code == 200) {
          this.$message({
            message: response.msg,
            type: 'success',
            duration: 1500
          });
          if (!this.updatedBtn) {
            setTimeout(() => {
              this.backRouter();
            }, 1550);
          } else {
            this.getDetails();
          }
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    selectConfirmSupplier() {
      this.$refs.input2.blur();
      this.supplierConfirmOpen = true;
    },
    selectSupplier() {
      this.$refs.input1.blur();
      this.supplierOpen = true;
    },
    // 关闭确认中标弹层后刷新下中标人选
    selectSupplierConfirmFun(res) {
      this.getCheckSupplier();
      console.log(res)
    },
    selectSupplierFun(res) {
      let strIdArr = [],
        strNameArr = [];
      res.forEach((item) => {
        strIdArr.push(item.id)
        strNameArr.push(item.companyName)
      });
      this.viewData.companyName = strNameArr.join(',')
      this.form.supplier = strIdArr.join(',')
    },
    /** 查询物资采购详情 */
    getDetails() {
      console.log('组件触发了回调-刷新详情页面')
      this.loading = true;
      getDetails(this.$route.params.id).then(response => {
        console.log('获取到了详情', response)
        this.viewData = response.data;
        this.form.taskId = response.data.taskId;
        this.form.isOpen = response.data.isOpen || '0';
        this.form.endTime = response.data.endTime;
        this.form.supplier = response.data.companyId;
        this.loading = false;
        // 如果是编辑按钮进入，那么就显示可以编辑的元素
        this.confirmSelectType = response.data.companyName || response.data.isOpen === '1';
        this.getCheckSupplier().then((flag) => {
          // 如果是编辑状态，
          this.updatedBtn = this.$route.params.type === 'updated';
          if (this.updatedBtn) {
            //有人参与招标，开启作废，否则开启修改
            if (flag) {
              this.isStart = true;
            } else {
              this.confirmSelectType = false;
            }
          }
        })
      });
    },
  }
};
</script>