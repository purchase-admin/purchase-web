<template>
  <div class="app">
    <div class="top">
      <div class="head-form">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="公司名称">
            <el-input v-model="form.name" placeholder="公司名称"></el-input>
          </el-form-item>
          <el-form-item label="业务联系人">
            <el-input v-model="form.people" placeholder="业务联系人"></el-input>
          </el-form-item>
          <el-form-item label="企业性质">
            <el-select v-model="form.qyxz" placeholder="请选择">
              <el-option label="国有" value="0"></el-option>
              <el-option label="民营" value="1"></el-option>
              <el-option label="外资" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经营范围">
            <el-select v-model="form.jyfw" placeholder="请选择">
              <el-option label="设备" value="0"></el-option>
              <el-option label="物资" value="1"></el-option>
              <el-option label="工程" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商等级">
            <el-select v-model="form.gysdj" placeholder="请选择">
              <el-option label="A" value="0"></el-option>
              <el-option label="B" value="1"></el-option>
              <el-option label="C" value="2"></el-option>
              <el-option label="D" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商类别">
            <el-select v-model="form.gyslb" placeholder="请选择">
              <el-option label="所有" value="0"></el-option>
              <el-option label="合格" value="1"></el-option>
              <el-option label="不合格" value="2"></el-option>=
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="onRefer"
              icon="el-icon-search"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <!-- table列表 -->
        <div class="table">
          <el-table
            ref="table"
            :data="tableData"
            tooltip-effect="dark"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            stripe
            border
          >
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column
              type="index"
              label="序号"
              width="60"
            ></el-table-column>
            <el-table-column
              prop="gysmc"
              label="供应商名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="gysdj"
              label="供应商等级"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="ywlxr"
              label="业务联系人"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="jyfw"
              label="经营范围"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="qyxz"
              label="企业性质"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="jsfs"
              label="结算方式"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="gyslb"
              label="供应商类别"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="gysdj"
              label="供应商等级"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="gysndpx"
              label="供应商年度评级"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="gyscyxmqk"
              label="供应商参与项目情况"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="gysxxqk"
              label="供应商详细情况"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="footer">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10]"
        :page-size="pageSize"
        layout="total,  prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "SupplierLibrary",
  components: {},
  props: {},
  data() {
    return {
      //查询
      form: {
        name: "",
        people: "",
        qyxz: "0",
        jyfw: "0"
      },
      //table列表
      tableData: [
        {
          gysmc: "",
          ywlxr: "",
          gysdj: "",
          jyfw: "",
          qyxz: "",
          jsfs: "",
          gyslb: "",
          gysdj: "",
          gysndpx: "",
          gyscyxmqk: "",
          gysxxqk: "",
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
  mounted() {},
  methods: {
    //查询
    onRefer() {},
    //重置
    rest() {},
    //新增/编辑
    onAdd() {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`${val} 页`);
      this.page = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.app {
  padding: 30px;
  .footer {
    float: right;
    margin-top: 20px;
  }
}
</style>