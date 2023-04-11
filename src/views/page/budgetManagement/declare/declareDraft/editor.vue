<template>
  <div class="app">
    <div class="top">
      <div class="head-form">
        <el-button
          type="primary"
          size="small"
          @click="onRefer"
          icon="el-icon-check"
          >提交</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="rest"
          icon="el-icon-check"
          >保存草稿</el-button
        >
        <el-button
          type="primary"
          size="small"
          icon="el-icon-picture-outline"
          @click="onAdd"
          >流程图</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addziduan"
          >添加列</el-button
        >
      </div>

      <div class="content">
        <div class="table-top">采购预算计划清单</div>
        <div class="table-form">
          <el-form
            :inline="true"
            :model="form"
            size="mini"
            class="demo-form-inline"
          >
            <el-form-item label="预算年度:">
              <el-select v-model="form.year" placeholder="选择年度">
                <el-option label="2020" value="2020"></el-option>
                <el-option label="2021" value="2021"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="填报部门:">
              <el-input
                v-model="form.department"
                placeholder="填报部门"
              ></el-input>
            </el-form-item>
            <el-form-item label="填报人:">
              <el-input v-model="form.people" placeholder="填报人"></el-input>
            </el-form-item>
            <el-form-item label="填报日期:">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.date"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <!-- table列表 -->
        <div class="table">
          <el-table
            ref="table"
            :data="tableData"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            tooltip-effect="dark"
            border
            style="width: 1024px"
          >
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column
              type="index"
              label="编号"
              width="60"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="项目名称(必填)"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="model"
              label="规格型号/技术要求"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.center"></el-input> </template
            ></el-table-column>
            <el-table-column
              prop="capital"
              label="资金来源(必选)"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.capital"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="money"
              label="预算金额(万元)必填"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.money"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="remarks"
              align="center"
              label="备注"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  :autosize="{ maxRows: 100 }"
                  v-model="scope.row.remarks"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 分页 -->

    <!-- 提交表单 -->
    <el-dialog :visible.sync="centerDialogVisible" width="30%" center>
      <h3>流程提交</h3>
      <span>下一步</span>
      <div>
        <el-radio-group v-model="radio">
          <el-radio :label="3">主任审核</el-radio>
          <el-radio :label="6">主任拟办</el-radio>
          <el-radio :label="9">结束</el-radio>
        </el-radio-group>
      </div>
      <span>下一步办理人</span>
      <div>张三</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DeclareDraftEditor",
  components: {},
  props: {},
  data() {
    return {
      radio: "",
      centerDialogVisible: false,
      dialogTableVisible: false,
      //查询
      form: {
        year: "2021",
        department: "",
        people: "",
        date: "",
      },
      //table列表
      tableData: [
        {
          name: "",
          model: "",
          capital: "",
          money: "",
          remarks: "",
        },
        {
          name: "",
          model: "",
          capital: "",
          money: "",
          remarks: "",
        },
        {
          name: "",
          model: "",
          capital: "财政资金/自有资金",
          money: "",
          remarks: "",
        },
        {
          name: "",
          model: "",
          capital: "",
          money: "",
          remarks: "",
        },
      ],
      // 分页
      total: 0,
      currentPage: null,
      page: 1,
      pageSize: 10,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    //获取数据列表
    this.postData();
  },
  methods: {
    // 添加一列
    addziduan() {
      // 向表格数组中数据添加一行
      this.tableData.push({
        index: this.tableData.length,
        name: "",
        model: "",
        capital: "",
        money: "",
        remarks: "",
      });
      console.log(this.tableData);
    },
    // 删除按钮
    deleteit(row) {
      this.tableData.splice(row.index, 1);
    },
    //获取数据列表
    async postData() {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`${val} 页`);
      this.page = val;
      this.postData();
    },
    //查询
    onRefer() {
      this.centerDialogVisible = true;
    },
    //重置
    rest() {},
    //新增/编辑
    onAdd() {},
    //列表选中
    handleSelectionChange(val) {
      console.log(val);
    },
    //设计
    process(row) {
      console.log(row);
    },
    //删除
    async deleted(row) {
      console.log(row);
    },
    //部署
    async deploy(row) {
      console.log(row);
    },
    onsubmit() {
      console.log(this.$refs.makingform.getJSON());
      console.log(this.$refs.makingform.getHtml());
      console.log(this.$refs.makingform.setJSON());
    },
  },
};
</script>
<style lang="scss" scoped>
.app {
  .top {
    margin: 0 auto;
    padding: 20px;
    width: 1070px;
    .head-form {
      margin-bottom: 30px;
    }
    ::v-deep.content {
      .table-top {
        font-size: 44px;
        font-weight: 600;
        margin-bottom: 10px;
        text-align: center;
      }
      ::v-deep.table {
        .el-input__inner {
          border: 0;
        }
        .el-textarea__inner {
          border: 0;
          resize: none; /* 这个是去掉 textarea 下面拉伸的那个标志，如下图 */
        }
      }
    }
  }
  .footer {
    float: right;
    margin-top: 20px;
  }
}
</style>
