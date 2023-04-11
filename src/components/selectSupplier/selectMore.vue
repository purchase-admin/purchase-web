<template>
  <!-- 选择供应商 多选 （不公开直接指定供应商 在用）-->
  <el-dialog title="查看供应商"
             :visible.sync="dialogShow"
             :width="dialogWidth"
             append-to-body>
    <div>
      <el-row>
        <el-col :span="6"
                :xs="24"
                style="padding-right: 20px">
          <div class="head-container">
            <el-tree :data="treeOptions"
                     node-key="id"
                     :props="defaultProps"
                     :expand-on-click-node="false"
                     :default-expanded-keys="['全部']"
                     show-checkbox
                     ref="tree"
                     @check="handleNodeClick">
              <template #default="{data}">
                <!-- 给span加上title属性，鼠标移入会弹出值 -->
                <span :title="data.projectTypeName">{{data.projectTypeName}}</span>
              </template>
            </el-tree>
          </div>

        </el-col>
        <el-col :span="18"
                :xs="24">
          <!--用户数据-->
          <el-form :model="queryParams"
                   ref="queryForm"
                   :inline="true"
                   v-show="showSearch"
                   label-width="68px">
            <el-form-item label="公司名称"
                          prop="name">
              <el-input v-model="queryParams.name"
                        placeholder="请输入供应商名称"
                        clearable
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="类型"
                          prop="name">
              <el-select v-model="queryParams.type">
                <el-option label="全部"
                           value="0" />
                <el-option label="库内"
                           value="1" />
                <el-option label="合格"
                           value="2" />
              </el-select>
            </el-form-item>
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
                    :data="dataList"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"
                             width="55"
                             align="center" />
            <el-table-column label="公司名称"
                             align="center"
                             show-overflow-tooltip>
              <template #default="{row}">
                <open-supplier-details :dataInfo="row"></open-supplier-details>
              </template>
            </el-table-column>
            <el-table-column label="公司法人"
                             align="center"
                             prop="corporateRep" />
            <el-table-column label="公司地址"
                             align="center"
                             show-overflow-tooltip
                             prop="companyAddress" />
            <el-table-column label="邮政编码"
                             align="center"
                             width="80px"
                             prop="postCode" />
            <el-table-column label="联系人"
                             align="center"
                             prop="businessContact" />
            <el-table-column label="联系人电话"
                             align="center"
                             prop="phone" />
            <el-table-column label="联系人邮箱"
                             align="center"
                             width="140px"
                             show-overflow-tooltip
                             prop="email" />
            <el-table-column label="供应商网址"
                             align="center"
                             width="200px"
                             show-overflow-tooltip
                             prop="website" />
            <el-table-column label="公司创建日期"
                             align="center"
                             width="100px"
                             prop="establishmentDate" />
          </el-table>
          <pagination v-show="total>0"
                      :total="total"
                      :page.sync="queryParams.pageNum"
                      :limit.sync="queryParams.pageSize"
                      @pagination="getList" />
        </el-col>
      </el-row>
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
import { mapState } from 'vuex';
import dialogMixins from '@/utils/mixins/dialog';
import { listProjectType } from '@/api/system/projectType';
import { newListSupplier as listSupplier } from '@/api/purchase/supplier';
import OpenSupplierDetails from '@/components/OpenSupplierDetails';
export default {
  name: 'selectMore',
  props: ['open', 'taskId'],
  mixins: [dialogMixins],
  components: {
    OpenSupplierDetails,
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
      title: '',
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: '0',
        name: '',
      },
      // 部门树选项
      treeOptions: null,
      defaultProps: {
        children: 'children',
        label: 'projectTypeName',
      },
      treeCheckIds: '',
    };
  },
  mounted() {
    this.getTreeList();
    // console.log('组件进入勒')
    // this.getList();
  },
  computed: {
    ...mapState({
      dialogWidth: (state) => state.settings.dialogWidth,
    }),
    dialogShow: {
      set() {
        this.cancel();
      },
      get() {
        return this.open;
      },
    },
  },
  watch: {
    open() {
      if (this.open) {
        this.getList();
      }
    },
  },
  methods: {
    /** 查询项目分类列表 */
    getTreeList() {
      listProjectType().then((response) => {
        this.treeOptions = [
          {
            children: this.handleTree(response.data, 'id'),
            projectTypeName: '全部',
            id: '全部',
          },
        ];
        console.log('treeData项目树节点', this.treeOptions);
      });
    },
    // 节点单击事件
    handleNodeClick() {
      // console.log('当前点击的treeData项目树节点的id集合', this.$refs.tree.getCheckedKeys())
      let ids = this.$refs.tree.getCheckedKeys().join();
      this.treeCheckIds = ids.replace(/(全部,)/g, '');
      this.handleQuery();
      // console.log('当前点击的treeData项目树节点', data, checked, indeterminate);
      // this.queryParams.deptId = data.id;
      // this.getList();
    },
    // 筛选节点
    filterNode(value, data) {
      console.log('value', value);
      console.log('data', data);
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    /** 查询供应商列表 */
    getList() {
      console.log('组件执行勒');
      this.loading = true;
      let ids = this.treeCheckIds ? { projectTypeId: this.treeCheckIds } : {};
      let obj = Object.assign({}, this.queryParams, ids);
      obj.taskId = this.taskId;
      listSupplier(obj).then((response) => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /**确认选择操作 */
    handleSelect() {
      if (this.ids.length < 1) {
        this.$message({
          message: '请选择一条数据',
          type: 'warning',
        });
      } else {
        this.$emit('handleSelect', this.ids);
        this.cancel();
      }
    },
    // 取消按钮
    cancel() {
      this.dateRange = [];
      this.resetForm('queryForm');
      this.$emit('update:open', false);
      // 清除多选的值
      this.$refs._tables.clearSelection();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
    },
  },
};
</script>