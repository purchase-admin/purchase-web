<template>
  <div>
    <el-dialog :title="title"
             :visible.sync="modelFlag"
             :width="dialogWidth"
             append-to-body>
    <div class="app-container">
      <!--用户数据-->
      <el-form :model="queryParams"
               ref="queryForm"
               :inline="true"
               v-show="showSearch"
               label-width="68px">
        <!-- <el-form-item label="用户名称" prop="userName">
              <el-input
                v-model="queryParams.userName"
                placeholder="请输入用户名称"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item> -->
        <el-form-item label="年度"
                      prop="year">
          <!-- <el-input
                v-model="queryParams.userName"
                placeholder="请输入用户名称"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              /> -->
          <el-date-picker v-model="queryParams.year"
                          type="year"
                          :disabled="dType !== 'add'"
                          value-format="yyyy"
                          @change="dateFun"
                          placeholder="选择年份">
          </el-date-picker>
        </el-form-item>

        <!-- <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item> -->
      </el-form>
      <el-table ref="multipleTable"
                v-loading="loading"
                :data="dataList"
                :row-key="getRowKeys"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         v-if="dType !== 'see'"
                         width="55"
                         :reserve-selection="true"
                         align="center" />
        <el-table-column label="序号"
                         align="center"
                         width="55"
                         type="index" />
        <el-table-column label="标题"
                         align="center"
                         min-width="200px"
                         show-overflow-tooltip
                         >
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
      </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getList" />
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="handleSelect">{{btnText}}</el-button>
      <!-- <el-button @click="cancel">取 消</el-button> -->
    </div>
  </el-dialog>
  <see-budgets-details :open.sync="detailsOpen" :detailsId="detailsId"></see-budgets-details>
  </div>
</template>

<script>
import SeeBudgetsDetails from "@/components/SeeBudgetsDetails"
import dialogMixins from "@/utils/mixins/dialog"
import { list } from "@/api/budget/budgetBatch";
import { mapState } from "vuex";
import { addListCollectBudget as add, updateListCollectBudget as updated, seeListCollectBudgetList } from "@/api/budget/budget";
export default {
  name: "ViewListData",
  props: ['open', 'dId', 'dType', 'dIds', 'dYear'],
  mixins: [dialogMixins],
  components: {SeeBudgetsDetails},
  data() {
    return {
      // 弹层
      modelFlag: false,
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
      // 表格数据
      dataList: [],
      // 弹出层标题
      // title: "",
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      //数据字典-资金来源
      moneyFromOptions: [],
      // 获取row的key值
      getRowKeys(row) {
        return row.id;
      },
      dateFunFlag: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        year: '',
        status: 2
        // userName: undefined,
        // phonenumber: undefined,
        // status: undefined,
        // deptId: undefined
      },
      selectYear: '',
      detailsOpen: false,
      detailsId: null,
    };
  },
  mounted() {
    this.getDicts("ZJLY").then((response) => {
      this.moneyFromOptions = response.data;
    });
  },
  computed: {
    ...mapState({
      "dialogWidth": state => state.settings.dialogWidth,
    }),
    title() {
      let text = ''
      switch (this.dType) {
        case 'add':
          text = '编辑'
          break;
        case 'update':
          text = '编辑'
          break;
        default:
          text = '查看'
          break;
      }
      return text
    },
    btnText() {
      let text = ''
      switch (this.dType) {
        case 'add':
          text = '确定'
          break;
        case 'update':
          text = '确定'
          break;
        default:
          text = '确定'
          break;
      }
      return text
    }
  },
  watch: {
    'open'(val, old) {
      if (val) {
        // 监听到了开启弹层
        console.log('调我了-------------------')
        this.modelFlag = true;
        this.$nextTick(() => {
          this.dateFunFlag = true;
          this.getList();
        })
      } else {
        this.modelFlag = false;
      }
    },
    'modelFlag'(val, old) {
      if (!val) {
        // 监听到了关闭弹层
        console.log('弹层关闭------------------------------')
        this.cancel()
      }
    },
    'dId'() {
      if (this.dId) {
        console.log('dId', this.dId)
      }
    },
    'dType'() {
      console.log('dType', this.dType)
    },
    'dYear'(val, old) {
      this.queryParams.year = val;
    },
    'dIds'(val, old) {
      if (val) {
        console.log('dIds', val)
        let arr = val.split(',');
        this.ids = [...arr];
        console.log('当前的ids', this.ids)
      } else {

      }
    }
  },
  methods: {
    dateFun() {
      if (this.dateFunFlag) {
        this.ids = [];
        this.$refs.multipleTable.clearSelection();
        this.getList();
      }
    },
    // 资金来源字典翻译
    moneyFromFormat(row, column) {
      return this.selectDictLabel(this.moneyFromOptions, row.moneyFrom);
    },
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      console.log('-666', this.queryParams);
      let funArr = [list, seeListCollectBudgetList];
      let _fun = null;
      if (this.dType == 'see') {
        _fun = funArr[1](this.dId, this.queryParams)
      } else {
        _fun = funArr[0](this.queryParams)
      }
      // seeListCollectBudgetList(this.dId,this.queryParams)
      _fun.then(response => {
        console.log('-123123123', response, this.ids)
        this.dataList = response.rows;
        this.total = response.total;
        console.log('接受到了值', this.dataList, this.total)
        if (this.ids) {
          this.dataList.forEach((ele) => {
            this.ids.forEach((element) => {
              if (ele.id == element) {
                console.log('当前id', element)
                this.$nextTick(() => {
                  // console.log(this.$refs.multipleTable.toggleRowSelection)
                  this.$refs.multipleTable.toggleRowSelection(ele, true);
                });
              }

            });
          })

        }
        this.loading = false;
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /**确认选择操作 */
    handleSelect() {
      // if(!this.queryParams.year){
      //   this.msgError("年度必选");
      //   return true;
      // }
      console.log(this.ids)
      if (this.ids.length == 0) {
        this.msgError("请选择列表数据");
        return true;
      }
      let params = {
        year: this.selectYear,
        budgetBatchIds: this.ids.join(',')
      }
      console.log(params)
      switch (this.dType) {
        case 'add':
          add(params).then((response) => {
            if (response.code == 200) {
              // this.$message.success("新增成功");
              this.msgSuccess("编辑成功");
              this.$emit('update-list')
              this.cancel()
            }
          });
          break;
        case 'update':
          params.id = this.dId
          updated(params).then((response) => {
            if (response.code == 200) {
              this.msgSuccess("编辑成功");
              this.$emit('update-list')
              this.cancel()
            }
          });
          break;
        default:
          this.cancel()
          break;
      }
    },
    // 编辑
    submitForm(type) {
      if (type) {
        // 新增

      } else {
        // 修改
      }

      console.log(add)
    },
    // 取消按钮
    cancel() {
      this.$refs.multipleTable.clearSelection()
      this.$emit('updateOpen');
      this.resetForm("queryForm");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      if (this.ids.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(selection[0])
      }
      this.selectYear = selection[0] && selection[0].year;
    },
    detailsOpenFun(row) {
      this.detailsOpen = true;
      this.detailsId = row.id;
    },
  }
};
</script>