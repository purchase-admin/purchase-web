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
      </div>

      <div class="content">
        <div class="table-top">长报集团物资采购申请表</div>
        <!-- <div class="table-form">
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
        </div> -->
        <!-- table列表 -->
        <div class="table">
          <el-row type="flex">
            <el-col :span="3">
              <div>申购部门:</div>
            </el-col>
            <el-col :span="3">
              <div>
                <el-input
                  v-model="tableData.department"
                  placeholder="申购部门"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="3"> <div>经办人:</div> </el-col>
            <el-col :span="3">
              <div>
                <el-input
                  v-model="tableData.agent"
                  placeholder="经办人"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="3"> <div>联系电话:</div></el-col>
            <el-col :span="3">
              <div>
                <el-input
                  v-model="tableData.telephone"
                  placeholder="联系电话"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="3"> <div>申购日期:</div> </el-col>
            <el-col :span="3">
              <div>
                <el-date-picker
                  type="date"
                  placeholder="申购日期"
                  v-model="tableData.date"
                  style="width: 100%"
                ></el-date-picker>
              </div>
            </el-col>
          </el-row>

          <el-row type="flex">
            <el-col :span="3">
              <div>项目预算:</div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-radio-group v-model="tableData.yusuan">
                  <el-radio :label="0">预算内</el-radio>
                  <el-radio :label="1">预算外</el-radio>
                </el-radio-group>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-select
                  v-model="tableData.diannao"
                  placeholder="请选择"
                  v-if="tableData.yusuan == '0'"
                >
                  <el-option label="电脑1" value="电脑1"></el-option>
                  <el-option label="电脑2" value="电脑2"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="3">
              <div v-if="tableData.yusuan == '0'">预算金额:</div></el-col
            >
            <el-col :span="3">
              <div>
                <el-input
                  v-model="tableData.ysje"
                  placeholder="预算金额(万元)"
                  v-if="tableData.yusuan == '0'"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="3">
              <div v-if="tableData.yusuan == '0'">剩余金额:</div>
            </el-col>
            <el-col :span="3">
              <div>
                <el-input
                  v-model="tableData.syje"
                  placeholder="剩余金额(万元)"
                  v-if="tableData.yusuan == '0'"
                ></el-input>
              </div>
            </el-col>
          </el-row>

          <el-row type="flex">
            <el-col :span="3">
              <div>项目名称:</div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-input
                  v-model="tableData.xmmc"
                  placeholder="项目名称"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="4"> <div>项目预算（万元）:</div></el-col>
            <el-col :span="5">
              <div>
                <el-input
                  v-model="tableData.ysje"
                  placeholder="项目预算(万元)"
                ></el-input>
              </div>
            </el-col>
          </el-row>

          <el-row type="flex">
            <el-col :span="3">
              <div>数量:</div>
            </el-col>
            <el-col :span="9">
              <div>
                <el-input v-model="tableData.sl" placeholder="数量"></el-input>
              </div>
            </el-col>
            <el-col :span="3"> <div>交付日期:</div></el-col>
            <el-col :span="9">
              <div>
                <el-date-picker
                  type="date"
                  placeholder="交付日期"
                  v-model="tableData.jfrq"
                  style="width: 100%"
                ></el-date-picker>
              </div>
            </el-col>
          </el-row>

          <el-row type="flex">
            <el-col :span="3">
              <div>申购原因:</div>
            </el-col>
            <el-col :span="21">
              <div>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 8, maxRows: 100 }"
                  v-model="tableData.sgyy"
                  placeholder="申购原因"
                ></el-input>
              </div>
            </el-col>
          </el-row>

          <el-row type="flex">
            <el-col :span="3">
              <div>规格型号、技术参数及服务要求:</div>
            </el-col>
            <el-col :span="21">
              <div>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 8, maxRows: 100 }"
                  v-model="tableData.ggxh"
                  placeholder="规格型号、技术参数及服务要求"
                ></el-input>
              </div>
            </el-col>
          </el-row>

          <el-row type="flex">
            <el-col :span="4">
              <div>推荐供应商或品牌:</div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-input
                  type="textarea"
                  :autosize="{ maxRows: 100 }"
                  v-model="tableData.tjgys"
                  placeholder="推荐供应商或品牌"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="3">
              <div>联系人:</div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-input
                  v-model="tableData.lxr"
                  placeholder="联系人"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="3">
              <div>联系电话:</div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-input
                  v-model="tableData.lxdh"
                  placeholder="联系电话"
                ></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 分页 -->
  </div>
</template>

<script>
export default {
  name: "ApplyDraft",
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
      //table列表
      tableData: {
        department: "",
        agent: "",
        telephone: "",
        date: "",
        yusuan: "0",
        xmys: "",
        diannao: "",
        ysje: "",
        syje: "",
        xmmc: "",
        sl: "",
        jfrq: "",
        sgyy: "",
        ggxh: "",
        tjgys: "",
        lxr: "",
        lxdh: "",
        bmldyj: "",
        jtldyj: "",
      },
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
  mounted() {},
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    //查询
    onRefer() {},
    //重置
    rest() {},
    //新增/编辑
    onAdd() {},
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
        border-top: 1px solid red;
        border-left: 1px solid red;
        .el-col {
          min-height: 40px;
          border-bottom: 1px solid red;
          border-right: 1px solid red;
          div {
            height: 100% !important;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          }
        }
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
