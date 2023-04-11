<template>
  <!-- 代理采购 -->
  <div class="app-container">
    <task-select-filter searchPage="代理采购"
                        @searchFun="emitHandleQuery">
      <el-button type="primary"
                 plain
                 icon="el-icon-plus"
                 size="mini"
                 @click="handleUpdate()">录入</el-button>
    </task-select-filter>
    <el-table v-loading="loading"
              :data="taskList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="序号"
                       type="index"
                       width="55"
                       align="center" />
      <el-table-column label="项目"
                       align="center"
                       show-overflow-tooltip
                       min-width="200px"
                       prop="projectName" />
      <el-table-column label="是否预算内"
                       align="center"
                       prop="budgetType" />
      <el-table-column label="预算金额"
                       align="center"
                       prop="budgetCost" />
      <el-table-column label="交付日期"
                       align="center"
                       width="100px"
                       prop="deliveryDate" />
      <el-table-column label="推荐品牌"
                       align="center"
                       prop="supplier" />
      <el-table-column label="申购部门"
                       align="center"
                       prop="deptName" />
      <el-table-column label="部门联系人"
                       align="center"
                       prop="userName" />
      <el-table-column label="部门联系人电话"
                       align="center"
                       prop="userPhone" />
      <el-table-column label="是否录入"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     v-if="scope.row.agencyId"
                     type="text"
                     @click="handleSee(scope.row)">已录入</el-button>
          <div v-else>未录入</div>
          <!-- {{scope.row.agencyId ? '已录入' : '未录入'}} -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改代理采购 对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="600px"
               @closed="reset"
               append-to-body>
      <el-form ref="form"
               label-width="110px">
        <el-form-item label="中标供应商">
          <el-input v-model.number="form.supplierId"
                    :disabled="!stateFlag"
                    placeholder="请输入中标供应商名称" />
        </el-form-item>
        <el-form-item label="中标金额"
                      >
          <el-input v-model.number="form.chooseMoney"
                    :disabled="!stateFlag"
                    placeholder="请输入中标金额" />
        </el-form-item>
        <el-form-item label="招标公告">
          <!-- <fileUpload v-model="form.tenderAnnouncement" :disabled="!stateFlag"/> -->
          <fileUploads ref="tenderAnnouncement"
                       :key="1"
                       @changefiles="(obj) => {changefiles(obj, 'tenderAnnouncement')}"
                       :files="tenderAnnouncement"
                       :filesNum="1"
                       requiredText="招标公告"
                       :disabled="!stateFlag" />
        </el-form-item>
        <el-form-item label="招标文件">
          <!-- <fileUpload v-model="form.tenderFile" :disabled="!stateFlag"/> -->
          <fileUploads ref="tenderFile"
                       :key="2"
                       @changefiles="(obj) => {changefiles(obj, 'tenderFile')}"
                       :files="tenderFile"
                       :filesNum="1"
                       requiredText="招标文件"
                       :disabled="!stateFlag" />
        </el-form-item>
        <el-form-item label="供应商签到表">
          <!-- <fileUpload v-model="form.supplierSignIn" :disabled="!stateFlag"/> -->
          <fileUploads ref="supplierSignIn"
                       :key="3"
                       @changefiles="(obj) => {changefiles(obj, 'supplierSignIn')}"
                       :files="supplierSignIn"
                       :filesNum="1"
                       requiredText="供应商签到表"
                       :disabled="!stateFlag" />
        </el-form-item>
        <el-form-item label="供应商投标文件">
          <!-- <fileUpload v-model="form.supplierBidFile" :disabled="!stateFlag"/> -->
          <fileUploads ref="supplierBidFile"
                       :key="4"
                       @changefiles="(obj) => {changefiles(obj, 'supplierBidFile')}"
                       :files="supplierBidFile"
                       :filesNum="1"
                       requiredText="供应商投标文件"
                       :disabled="!stateFlag" />
        </el-form-item>
        <el-form-item label="评委签到表">
          <!-- <fileUpload v-model="form.judgingSignIn" :disabled="!stateFlag"/> -->
          <fileUploads ref="judgingSignIn"
                       :key="5"
                       @changefiles="(obj) => {changefiles(obj, 'judgingSignIn')}"
                       :files="judgingSignIn"
                       :filesNum="1"
                       requiredText="评委签到表"
                       :disabled="!stateFlag" />
        </el-form-item>
        <el-form-item label="评委评分">
          <!-- <fileUpload v-model="form.judgingGrade" :disabled="!stateFlag"/> -->
          <fileUploads ref="judgingGrade"
                       :key="6"
                       @changefiles="(obj) => {changefiles(obj, 'judgingGrade')}"
                       :files="judgingGrade"
                       :filesNum="1"
                       requiredText="评委评分"
                       :disabled="!stateFlag" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm"
                   v-if="stateFlag">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <selectSupplier :open.sync="supplierOpen"
                    @handleSelect="handleSelectSupplier" />
    <selectTask :open.sync="taskOpen"
                @handleSelect="handleSelectTask" /> -->
  </div>
</template>

<script>
import { getAgencyPurchase, delAgencyPurchase, addAgencyPurchase, updateAgencyPurchase, exportAgencyPurchase } from "@/api/agencyPurchase/agencyPurchase";
import { listPurchaseTaskToDolistTask as listTask } from "@/api/purchaseTask/task";
import FileUploads from '@/components/FileUploads';
// import selectSupplier from "@/components/selectSupplier"
// import selectTask from "@/components/selectBudget/task"
import TaskSelectFilter from '@/components/TaskSelectFilter';
export default {
  name: "AgencyPurchase",
  components: {
    FileUploads,
    // selectSupplier,
    // selectTask,
    TaskSelectFilter
  },
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
      // 总条数
      total: 0,
      // 代理采购 表格数据
      taskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        executor: null,
        purchaseType: null,
        deptId: null,
        isCheck: null,
        type: null,
        isSaveAgencyData: null,
        budgetType: '预算内',
      },
      mixinsParams: {},
      // 表单参数
      form: {
        supplierId: null,
        taskId: null,
        chooseMoney: null,
      },
      // 表单校验
      rules: {
      },
      // 供应商
      supplierOpen: false,
      supplierFlag: true, //当前是外层查询条件还是里层编辑字段内容 true表示外层，false表示里层
      // 订单任务
      taskOpen: false,
      taskFlag: true, //当前是外层查询条件还是里层编辑字段内容 true表示外层，false表示里层
      selectStateFlag: null, //表示是否选中的有录入数据
      stateFlag: true,//当前是录入还是查看，默认录入true,查看false
      // 上传组件回显列表
      tenderAnnouncement: [],
      tenderFile: [],
      supplierSignIn: [],
      supplierBidFile: [],
      judgingSignIn: [],
      judgingGrade: [],
      // 文件上传接受返回的值
      tenderAnnouncementData: [],
      tenderFileData: [],
      supplierSignInData: [],
      supplierBidFileData: [],
      judgingSignInData: [],
      judgingGradeData: [],
      names: ['tenderAnnouncement',
        'tenderFile',
        'supplierSignIn',
        'supplierBidFile',
        'judgingSignIn',
        'judgingGrade']
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changefiles(obj, type) {
      console.log('当前返回的值', obj)
      console.log('当前调用的类型', type)
      console.log('当前调用的变量', this['file' + type])
      if (obj.flag) {
        // 表示删除，直接把现有的值赋给该变量
        this[type] = obj.data
      } else {
        let uids = [];
        this[type].push({
          data: obj.data,
          name: obj.name,
          uid: obj.uid
        })
        // 去除重复
        this[type] = this[type].filter((item) => {
          if (!uids.includes(item.uid)) {
            uids.push(item.uid);
            return true;
          }
        });
      }
    },
    // 获取上传的文件名称
    getFileName(name) {
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1).toLowerCase();
      } else {
        return "";
      }
    },
    /** 查询代理采购 列表 */
    getList() {
      this.loading = true;
      this.queryParams.purchaseType = '3';
      console.log(this.queryParams)
      listTask(Object.assign({}, this.queryParams, this.mixinsParams)).then(response => {
        this.taskList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        supplierId: null,
        taskId: null,
        chooseMoney: null,
      };
      this.tenderAnnouncement =[];
      this.tenderFile =[];
      this.supplierSignIn =[];
      this.supplierBidFile =[];
      this.judgingSignIn =[];
      this.judgingGrade =[];
      for (var i = 0; i < 6; i++) {
        if (this.$refs[this.names[i]]) {
          this.$refs[this.names[i]].clearFiles();
        }
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    emitHandleQuery(data) {
      console.log('传递过来的值', data)
      this.mixinsParams = data;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.taskId);
      this.selectStateFlag = selection.map(item => item.agencyId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.title = "添加代理采购";
    },
    /** 录入按钮操作 */
    handleUpdate() {
      const ids = this.ids
      if (ids.length !== 1) {
        this.$message.warning("请选择一条数据录入");
        return true;
      }
      console.log(this.selectStateFlag.join(','))
      if (this.selectStateFlag.join(',')) {
        this.$message.warning("不能选择已录入数据录入");
        return true;
      }
      this.stateFlag = true;
      this.form.taskId = ids.join(',');
      this.open = true;
      this.title = "录入代理采购信息";
    },
    /** 查看已录入数据 */
    handleSee(row) {
      getAgencyPurchase(row.agencyId).then(response => {
        this.form = {
          supplierId: response.data.supplierId,
          taskId: response.data.taskId,
          chooseMoney: response.data.chooseMoney,
        }
        this.names.forEach((name) => {
          // console.log('response', response.data[name])
          if (response.data[name + 'Name']) {
            // 回显文件-根据upload组件的回显规则 uid 和 data 都赋值文件id，用于组件内部区分是回显文件还是待上传的文件
            this[name] = [{ data: response.data[name], name: response.data[name + 'Name'], uid: response.data[name]}];
          } else {
            // 上传组件回显没有值，置空
            this[name] = [];
          }
        })
        this.stateFlag = false;
        this.open = true;
        this.title = "查看已录入代理采购信息 ";
        // 用于上传组件内部数据回显，不设置这一步，会导致界面回显成功，提交提示数据为空
        this.$nextTick(()=>{
          for (var i = 0; i < 6; i++) {
            if (this.$refs[this.names[i]]) {
              this.$refs[this.names[i]].initFiles();
            }
          }
        })
      });
    },
    /** 提交按钮 */
    async submitForm() {
      if (!this.form.supplierId) {
        this.msgError('中标供应商不能为空');
        return;
      }
      if (!this.form.chooseMoney) {
        this.msgError('中标金额不能为空');
        return;
      }

      //通过await使当前行为等待this.uploadFun处理完成后，再继续执行
      let uploadFlag = await this.uploadFun({
        fileNames: ['tenderAnnouncement', 'tenderFile', 'supplierSignIn', 'supplierBidFile', 'judgingSignIn', 'judgingGrade'],
        fileDatas: ['tenderAnnouncementData', 'tenderFileData', 'supplierSignInData', 'supplierBidFileData', 'judgingSignInData', 'judgingGradeData']
      })
      // 如果文件没上传成功，不做处理，
      if (!uploadFlag) return;
      
      let params = JSON.parse(JSON.stringify(this.form));
      this.names.forEach((name) => {
        if (this[name + 'Data'].length === 0 ) return;
        params[name] = this[name + 'Data'].length === 1 ? this[name + 'Data'][0] : this[name + 'Data'];
      })
      console.log(params)
      //id存在表示修改，目前没有修改
      if (this.form.id != null) {
        updateAgencyPurchase(params).then(response => {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        });
      } else {
        addAgencyPurchase(params).then(response => {
          this.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除代理采购 编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delAgencyPurchase(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有代理采购 数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportAgencyPurchase(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
