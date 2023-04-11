<template>
<!-- 采购申请-详情页面的弹层里面的查看供应商-暂无使用 -->
  <el-dialog title="查看供应商"
             :visible.sync="dialogShow"
             width="800px"
             append-to-body>
    <div class="app-container">
      <!--用户数据-->
      <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="用户名称" prop="userName">
              <el-input
                v-model="queryParams.userName"
                placeholder="请输入用户名称"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form> -->
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
import { listSupplier } from '@/api/purchase/supplier';
import OpenSupplierDetails from '@/components/OpenSupplierDetails';
export default {
  name: 'selectSupplier',
  props: ['open'],
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
        // userName: undefined,
        // phonenumber: undefined,
        // status: undefined,
        // deptId: undefined
      },
    };
  },
  mounted() {
    console.log('组件进入勒');
    this.getList();
  },
  computed: {
    dialogShow: {
      set() {
        this.cancel();
      },
      get() {
        return this.open;
      },
    },
  },
  watch: {},
  methods: {
    /** 查询供应商列表 */
    getList() {
      console.log('组件执行勒');
      this.loading = true;
      listSupplier(this.queryParams).then((response) => {
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
      if (this.ids.length !== 1) {
        this.$message({
          message: '请选择一条数据',
          type: 'warning',
        });
      } else {
        this.$emit('handleSelect', this.ids[0]);
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
      // .map(item => { return item})
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      if (this.ids.length > 1) {
        // 多选框-切换单选操作toggleRowSelection。选中一行
        this.$refs._tables.toggleRowSelection(selection[0]);
      }
    },
  },
};
</script>