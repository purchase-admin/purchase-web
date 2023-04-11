<template>
  <div class="app">
    <div class="top">
      <div class="content">
        <div class="table-form">
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
                ></el-table-column>
                <el-table-column prop="name" label="名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="remarks"
                  label="备注"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="state"
                  label="所属类别"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="设计"
                      placement="bottom"
                    >
                      <el-button
                        type="text"
                        icon="el-icon-edit"
                        @click="process(scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="删除"
                      placement="bottom"
                    >
                      <el-button
                        type="text"
                        icon="el-icon-delete"
                        @click="deleted(scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="部署"
                      placement="bottom"
                    >
                      <el-button
                        type="text"
                        icon="el-icon-upload"
                        @click="deploy(scope.row)"
                      ></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
  </div>
</template>

<script>
export default {
  name: "PurchaseCatalogue",
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
          label: "全部",
          children: [
            {
              label: "货物类",
              children: [
                {
                  label: "计算机设备及软件",
                },
                {
                  label: "办公设备",
                },
                {
                  label: "采编设备",
                },
                {
                  label: "车辆",
                },
                {
                  label: "机电设备",
                },
              ],
            },
            {
              label: "工程类",
              children: [
                {
                  label: "计算机网络工程",
                },
                {
                  label: "其他各类工程",
                },
              ],
            },
            {
              label: "服务类",
              children: [
                {
                  label: "通讯业务",
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
          name: "货物货物",
          remarks: "货物类",
          state: "完成",
        },
        {
          name: "",
          remarks: "",
          state: "",
        },
        {
          name: "",
          remarks: "",
          state: "",
        },
        {
          name: "",
          remarks: "",
          state: "",
        },
        {
          name: "",
          remarks: "",
          state: "",
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
