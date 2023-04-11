<template>
  <el-dialog title="保存"
             :visible.sync="dialogShow"
             :width="dialogWidth"
             append-to-body>
    <div class="app-container">
      <el-form :model="queryParams"
               ref="queryForm"
               v-show="showSearch"
               :inline="true">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="queryParams.roleName"
                    placeholder="请输入角色名称"
                    clearable
                    size="small"
                    style="width: 240px"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="权限字符" prop="roleKey">
          <el-input
            v-model="queryParams.roleKey"
            placeholder="请输入权限字符"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <!-- <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="角色状态"
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
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh"
                     size="mini"
                     @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="_tables"
                v-loading="loading"
                :data="roleList"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55"
                         align="center" />
        <el-table-column label="角色编号"
                         prop="roleId" />
        <el-table-column label="角色名称"
                         prop="roleName"
                         :show-overflow-tooltip="true" />
        <el-table-column label="权限字符"
                         prop="roleKey"
                         :show-overflow-tooltip="true" />
        <!-- <el-table-column label="显示顺序" prop="roleSort" width="100" /> -->
        <!-- <el-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:role:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-check"
              @click="handleDataScope(scope.row)"
              v-hasPermi="['system:role:edit']"
            >数据权限</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:role:remove']"
            >删除</el-button>
          </template>
        </el-table-column> -->
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
                 @click="handleSelect">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listRole } from "@/api/system/role";
import dialogMixins from "@/utils/mixins/dialog"
import { mapState } from "vuex";
export default {
  name: "Role",
  props: ['open'],
  mixins: [dialogMixins],
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
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
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
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
      set() {
        this.cancel()
      },
      get() {
        return this.open
      }
    }
  },
  watch: {
    open() {
      if (this.open) {
        this.getList();
      }
    }
  },
  methods: {
    // 取消按钮
    cancel() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.$emit('update:open', false)
      // 清除多选的值
      this.$refs._tables.clearSelection()
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.rows;
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
      if (this.ids.length !== 1) {
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        });
      } else {
        this.$emit('handleSelect', this.ids[0])
        this.cancel()
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => { return { id: item.roleId, label: item.roleName } });
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      if (this.ids.length > 1) {
        // 多选框-切换单选操作toggleRowSelection。选中一行
        this.$refs._tables.toggleRowSelection(selection[0])
      }
    },
  }
};
</script>