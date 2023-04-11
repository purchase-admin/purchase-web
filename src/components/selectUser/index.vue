<template>
  <el-dialog title="保存"
                :visible.sync="dialogShow"
                :width="dialogWidth"
                append-to-body>
    <!-- <div class="app-container"> -->
      <el-tabs v-model="activeName"  @tab-click="handleClick">
        <el-tab-pane label="动态选择" name="a">
           <!--用户数据-->
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
              <el-form-item label="用户名称" prop="nickName">
                <el-input
                  v-model="queryParams.nickName"
                  placeholder="请输入用户名称"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <!-- <el-form-item label="手机号码" prop="phonenumber">
                <el-input
                  v-model="queryParams.phonenumber"
                  placeholder="请输入手机号码"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="queryParams.status"
                  placeholder="用户状态"
                  clearable
                  size="small"
                  style="width: 240px"
                >
                  <el-option
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="dateRange"
                  size="small"
                  style="width: 240px"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSelect">确认选择</el-button> -->
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
            <el-table ref="_tables" v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
              <el-table-column label="用户账号" align="center" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
              <el-table-column label="用户名称" align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" />
              <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible" :show-overflow-tooltip="true" />
              <!-- <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible" width="120" />
              <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    active-value="0"
                    inactive-value="1"
                    @change="handleStatusChange(scope.row)"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
              </el-table-column> -->
            </el-table>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
        </el-tab-pane>
        <el-tab-pane label="静态选择" name="b">
          <div class="paneDivB">
          <!-- <el-select v-model="defaultValue" style="width:100%" @change="selectChange" placeholder="请选择">
            <el-option
              v-for="item in defaultOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
           <el-table ref="_bTables" v-loading="loading" :data="defaultOptions" @selection-change="bHandleSelectionChange">
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column label="用户名"  prop="label" align="center"/>
              <el-table-column label="变量名"  prop="value" align="center"/>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自定义" name="c">
          <div class="paneDiv">
            <el-input v-model="inputValue" placeholder="请输入"></el-input>
          </div>
        </el-tab-pane>
      </el-tabs>
    <!-- </div> -->
    <div slot="footer"
              class="dialog-footer">    
      <el-button type="primary"
                  @click="handleSelect">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listUser} from "@/api/system/user";
import dialogMixins  from "@/utils/mixins/dialog"
import { mapState } from "vuex";
export default {
  name: "User",
  props:['open','selectType'],
  mixins: [dialogMixins],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      bIds: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      //tabs
      activeName: 'a',
      //  静态选择
      // defaultValue: '',
      // defaultLabel: '',
      defaultOptions: [
        {
          value: '$INITIATOR',
          label: '流程发起人'
        },
      ],
      // 自定义
      inputValue:''
    };
  },
  created() {
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  computed: {
    ...mapState({
        "dialogWidth": state => state.settings.dialogWidth,
    }),
    dialogShow: {
      set(){
        this.cancel()
      },
      get(){
        return this.open
      }
    }
  },
  watch: {
    open(){
      if(this.open){
        this.getList();
      }
    }
  },
  methods: {
    // 静态选择
    // selectChange(val) {
    //   console.log('操作人选中项发生变化', val)
    //   if (val) {
    //     let obj = {}
    //     obj = this.defaultOptions.find(item => {
    //       return item.value === val //筛选出匹配数据
    //     })
    //     this.defaultLabel = obj.label
    //   } else {
    //     this.defaultLabel = ''
    //   }
    // },
    // tabs选择触发
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 取消按钮
    cancel() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.$emit('update:open', false);
      // 清除多选的值
      this.$refs._tables.clearSelection();
      this.$refs._bTables.clearSelection();
      this.inputValue = '';
      // this.defaultValue = '';
      // this.defaultLabel = '';
      this.activeName = 'a'
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /**确认选择操作 */
    handleSelect() {
      switch (this.activeName) {
        case 'a':
          this.handleSelectServer();
          break;
        case 'b':
          this.handleSelectDefault();
          break;
        case 'c':
          this.handleInputDefault();
          break;
        default:
          this.$message({
            message: '操作有问题',
            type: 'warning'
          });
          break;
      }
    },
    /**返回数据 */
    callBack(data) {
      this.$emit('handleSelect',data)
      this.cancel()
    },
    /** 选择动态数据 */
    handleSelectServer() {
      if(this.ids.length !== 1){
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        });
      }else{
        this.callBack(this.ids[0]);
      }
    },
     /**选择静态 */
    handleSelectDefault() {
      // this.callBack({id: this.defaultOptions[0].value, label: this.defaultOptions[0].label});
      if(this.bIds.length !== 1){
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        });
      }else{
        this.callBack(this.bIds[0]);
      }
    },
    bHandleSelectionChange(selection) {
      this.bIds = selection.map(item => { return {id: item.value, label: item.label}});
      if(this.bIds.length > 1){
        // 多选框-切换单选操作toggleRowSelection。选中一行
        this.$refs._bTables.toggleRowSelection(selection[0])
      }
    },
    /** 自定义输入操作 */
    handleInputDefault() {
      this.callBack({id: this.inputValue, label: this.inputValue});
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => { return {id: item.userName, label: item.nickName}});
      if(this.ids.length > 1){
        // 多选框-切换单选操作toggleRowSelection。选中一行
        this.$refs._tables.toggleRowSelection(selection[0])
      }
    },
  }
};
</script>
<style lang="scss">
  .paneDivB{
    width: 100%;
  }
  .paneDiv{
    width: 300px;
    margin: 0 auto;
  }
</style>