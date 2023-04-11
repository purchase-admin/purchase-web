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
          icon="el-icon-picture-outline"
          @click="onAdd"
          >流程图</el-button
        >
        <!-- <el-button type="primary" icon="el-icon-plus" size="small" @click="addziduan"
          >添加列</el-button
        > -->
      </div>

      <div class="content">
        <div class="table-top">长报集团采购预算计划汇总清单</div>
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
            <!-- <el-form-item label="填报部门:">
              <el-input
                v-model="form.department"
                placeholder="填报部门"
              ></el-input>
            </el-form-item>
            <el-form-item label="填报人:">
              <el-input v-model="form.people" placeholder="填报人"></el-input>
            </el-form-item> -->
            <el-form-item label="申报日期:">
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
          <div class="table-tree">
            <el-tree
              :data="dataTree"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :default-expand-all="true"
            ></el-tree>
          </div>

          <div class="table-list">
            <el-table
              ref="table"
              :data="tableData"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
              tooltip-effect="dark"
              border
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
                label="资金来源"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.capital"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="money"
                label="预算金额(万元)"
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
    </div>
    <!-- 分页 -->
  </div>
</template>

<script>
export default {
  name: "SummaryDraftEditor",
  components: {},
  props: {},
  data() {
    return {
      dialogTableVisible: false,
      //查询
      form: {
        year: "2021",
        department: "",
        people: "",
        date: "",
      },
      //树列表
      dataTree: [
        {
          label: "长报集团",
          children: [
            {
              label: "综合部门",
              children: [
                {
                  label: "集团党委办公室",
                },
                {
                  label: "集团新闻宣传管理办公室",
                },
                {
                  label: "集团计划财务部",
                },
                {
                  label: "集团组织人事部",
                },
                {
                  label: "集团党群工作部",
                },
              ],
            },
            {
              label: "新闻指挥、生产、发布体系",
              children: [
                {
                  label: "编委",
                },
                {
                  label: "指挥中心",
                },
                {
                  label: "报纸编辑部.",
                },
                {
                  label: "党政部",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
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
    handleNodeClick(data) {
      console.log(data);
    },
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
    onRefer() {},
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
    // width: 1070px;
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

        .table-tree {
          width: 16%;
          float: left;
        }
        .table-list {
          width: 83%;
          float: right;
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
