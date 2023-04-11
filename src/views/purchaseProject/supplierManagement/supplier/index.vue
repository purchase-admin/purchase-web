<template>
  <!-- 供应商管理列表 -->
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="68px">
      <el-form-item label="公司名称"
                    prop="companyName">
        <el-input v-model="queryParams.companyName"
                  placeholder="请输入公司名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="企业性质"
                    prop="nature">
        <el-input v-model="queryParams.nature"
                  placeholder="请输入公司名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="企业性质"
                    prop="nature">
        <el-select v-model="queryParams.nature"
                   placeholder="请选择企业性质类型"
                   clearable
                   size="small">
          <el-option v-for="dict in natureTypeOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="结算方式"
                    prop="settlementModes">
        <el-input v-model="queryParams.settlementModes"
                  placeholder="请输入结算方式"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="公司类型"
                    prop="supplierType">
        <el-select v-model="queryParams.supplierType"
                   placeholder="请选择供应商类型"
                   clearable
                   size="small">
          <el-option v-for="dict in supplierTypeOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="类型"
                    prop="supplierType">
        <el-input v-model="queryParams.supplierType"
                  placeholder="请选择供应商类型"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
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

    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="goContent('add')">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="success"
                   plain
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['supplier:supplier:edit']">修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <import-file-button ref="importFile"
                            :filesNum="1"
                            :fileType="['xls']"
                            @changefiles="changefile"></import-file-button>
        <!-- <el-button type="warning"
                   plain
                   icon="el-icon-upload2"
                   size="mini"
                   @click="handleImport">批量导入供应商</el-button> -->
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="el-icon-download"
                   size="mini"
                   @click="handleDownload">下载导入模板</el-button>
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch"
                     @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading"
              :data="supplierList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="序号"
                       align="center"
                       type="index" />
      <el-table-column label="公司名称"
                       align="center"
                       prop="companyName">
        <!-- <template slot-scope="scope">
            <el-button type="text" @click="goContent('see',scope.row)">{{scope.row.companyName}}</el-button>
        </template> -->
      </el-table-column>
      <el-table-column label="企业性质"
                       align="center"
                       :formatter="natureTypeFormat"
                       prop="nature" />
      <el-table-column label="法人代表"
                       align="center"
                       prop="corporateRep" />
      <el-table-column label="业务联系人"
                       align="center"
                       prop="businessContact" />
      <el-table-column label="联系电话"
                       align="center"
                       prop="phone" />
      <el-table-column label="经营范围和主要产品及服务"
                       align="center"
                       prop="businessScope" />
      <el-table-column label="结算方式"
                       align="center"
                       prop="settlementModes" />
      <el-table-column label="供应商类型"
                       align="center"
                       :formatter="supplierTypeFormat"
                       prop="supplierType" />
      <el-table-column label="操作"
                       align="center"
                       width="200px"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- v-show="scope.row.status=='0'" -->
          <!-- <el-button size="mini"
                     type="text"
                     icon="el-icon-s-promotion"
                     @click="handleSubmitFlow(scope.row)"
          >提交</el-button> -->
          <el-button size="mini"
                     type="text"
                     icon="el-icon-search"
                     @click="goContent('see',scope.row)">查看</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="goContent('update',scope.row)">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     style="color:#F56C6C;"
                     @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改供应商信息 供应商数据对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-form-item label="公司名称"
                      prop="companyName">
          <el-input v-model="form.companyName"
                    placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="法人代表"
                      prop="corporateRep">
          <el-input v-model="form.corporateRep"
                    placeholder="请输入法人代表" />
        </el-form-item>
        <el-form-item label="公司地址"
                      prop="companyAddress">
          <el-input v-model="form.companyAddress"
                    placeholder="请输入公司地址" />
        </el-form-item>
        <el-form-item label="邮编"
                      prop="postCode">
          <el-input v-model="form.postCode"
                    placeholder="请输入邮编" />
        </el-form-item>
        <el-form-item label="业务联系人"
                      prop="businessContact">
          <el-input v-model="form.businessContact"
                    placeholder="请输入业务联系人" />
        </el-form-item>
        <el-form-item label="联系电话"
                      prop="phone">
          <el-input v-model="form.phone"
                    placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="form.email"
                    placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="网址"
                      prop="website">
          <el-input v-model="form.website"
                    placeholder="请输入网址" />
        </el-form-item>
        <el-form-item label="成立日期"
                      prop="establishmentDate">
          <el-date-picker clearable
                          size="small"
                          v-model="form.establishmentDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择成立日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="注册资本"
                      prop="registeredCapital">
          <el-input v-model="form.registeredCapital"
                    placeholder="请输入注册资本" />
        </el-form-item>
        <el-form-item label="企业性质 字典"
                      prop="nature">
          <el-select v-model="form.nature"
                     placeholder="请选择企业性质 字典">
            <el-option label="请选择字典生成"
                       value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="统一信用代码"
                      prop="creditCode">
          <el-input v-model="form.creditCode"
                    placeholder="请输入统一信用代码" />
        </el-form-item>
        <el-form-item label="开户行名称"
                      prop="bankName">
          <el-input v-model="form.bankName"
                    placeholder="请输入开户行名称" />
        </el-form-item>
        <el-form-item label="银行基本账号"
                      prop="bankAccount">
          <el-input v-model="form.bankAccount"
                    placeholder="请输入银行基本账号" />
        </el-form-item>
        <el-form-item label="年销售额"
                      prop="annualSale">
          <el-input v-model="form.annualSale"
                    placeholder="请输入年销售额" />
        </el-form-item>
        <el-form-item label="员工人数"
                      prop="employeeNumber">
          <el-input v-model="form.employeeNumber"
                    placeholder="请输入员工人数" />
        </el-form-item>
        <el-form-item label="专业资质"
                      prop="prefessionalAptitude">
          <el-input v-model="form.prefessionalAptitude"
                    placeholder="请输入专业资质" />
        </el-form-item>
        <el-form-item label="体系论证"
                      prop="setupProof">
          <el-input v-model="form.setupProof"
                    placeholder="请输入体系论证" />
        </el-form-item>
        <el-form-item label="经营范围和主要产品及服务 字典"
                      prop="businessScope">
          <el-input v-model="form.businessScope"
                    placeholder="请输入经营范围和主要产品及服务 字典" />
        </el-form-item>
        <el-form-item label="供应产品"
                      prop="provideProduct">
          <el-input v-model="form.provideProduct"
                    placeholder="请输入供应产品" />
        </el-form-item>
        <el-form-item label="主要生产设备"
                      prop="productionEquipment">
          <el-input v-model="form.productionEquipment"
                    placeholder="请输入主要生产设备" />
        </el-form-item>
        <el-form-item label="收费标准"
                      prop="expensesStandard">
          <el-input v-model="form.expensesStandard"
                    placeholder="请输入收费标准" />
        </el-form-item>
        <el-form-item label="结算方式"
                      prop="settlementModes">
          <el-input v-model="form.settlementModes"
                    placeholder="请输入结算方式" />
        </el-form-item>
        <el-form-item label="其他事项"
                      prop="other">
          <el-input v-model="form.other"
                    placeholder="请输入其他事项" />
        </el-form-item>
        <el-form-item label="供应商类型"
                      prop="supplierType">
          <el-select v-model="form.supplierType"
                     placeholder="请选择供应商类型">
            <el-option v-for="dict in supplierTypeOptions"
                       :key="dict.dictValue"
                       :label="dict.dictLabel"
                       :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新人"
                      prop="updatedBy">
          <el-input v-model="form.updatedBy"
                    placeholder="请输入更新人" />
        </el-form-item>
        <el-form-item label="更新时间"
                      prop="updatedTime">
          <el-date-picker clearable
                          size="small"
                          v-model="form.updatedTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择更新时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// exportSupplier,
import {
  listSupplier,
  getSupplier,
  delSupplier,
  addSupplier,
  updateSupplier,
  downloadSupplierModel,
  importSupplier,
} from '@/api/supplier/supplier';
import { startProcess } from '@/api/budget/budget';
import { exportOutFun } from '@/utils';
import ImportFileButton from '@/components/ImportFileButton';
export default {
  name: 'Supplier',
  components: { ImportFileButton },
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
      // 供应商信息 供应商数据表格数据
      supplierList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 供应商类型字典
      supplierTypeOptions: [],
      //企业性质类型字典
      natureTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: null,
        corporateRep: null,
        nature: null,
        creditCode: null,
        provideProduct: null,
        productionEquipment: null,
        settlementModes: null,
        supplierType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companyName: [
          { required: true, message: '公司名称不能为空', trigger: 'blur' },
        ],
        businessContact: [
          { required: true, message: '业务联系人不能为空', trigger: 'blur' },
        ],
        nature: [
          {
            required: true,
            message: '企业性质不能为空',
            trigger: 'change',
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts('GSLX').then((response) => {
      this.supplierTypeOptions = response.data;
    });
    this.getDicts('QYXZ').then((response) => {
      this.natureTypeOptions = response.data;
    });
  },
  methods: {
    changefile(obj) {
      this.$refs['importFile'].clearFiles();
      console.log('当前返回的值', obj);
      let formData = new FormData();
      formData.append('file', obj.data);
      this.handleImport(formData);
    },
    // 批量导入供应商模板
    handleImport(data) {
      importSupplier(data).then((response) => {
        console.log('导入成功', response);
        response.code === 200
          ? this.msgSuccess(response.msg || '导入成功')
          : this.msgError(response.msg || '导入失败');
        // 数据刷新-回到第一页重置
        this.handleQuery();
      });
    },
    // 下载导入的模板
    handleDownload() {
      exportOutFun(downloadSupplierModel(), 'arraybuffer');
    },
    // 跳转公司详情页
    goContent(type, data) {
      console.log(type, data);
      switch (type) {
        case 'add':
          this.$router.push(
            `/purchaseProject/supplierManagement/supplier/detail/空/update`
          );
          break;
        case 'update':
          this.$router.push(
            `/purchaseProject/supplierManagement/supplier/detail/${data.id}/update`
          );
          break;
        case 'see':
          this.$router.push(
            `/purchaseProject/supplierManagement/supplier/detail/${data.id}/空`
          );
          break;
        default:
          console.log('无匹配', type);
          break;
      }
    },
    /** 查询供应商信息 供应商数据列表 */
    getList() {
      this.loading = true;
      listSupplier(this.queryParams).then((response) => {
        this.supplierList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 供应商类型字典翻译
    supplierTypeFormat(row, column) {
      return this.selectDictLabel(this.supplierTypeOptions, row.supplierType);
    },
    // 企业性质类型字典翻译
    natureTypeFormat(row, column) {
      return this.selectDictLabel(this.natureTypeOptions, row.nature);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        companyName: null,
        corporateRep: null,
        companyAddress: null,
        postCode: null,
        businessContact: null,
        phone: null,
        email: null,
        website: null,
        establishmentDate: null,
        registeredCapital: null,
        nature: null,
        creditCode: null,
        bankName: null,
        bankAccount: null,
        annualSale: null,
        employeeNumber: null,
        prefessionalAptitude: null,
        setupProof: null,
        businessScope: null,
        provideProduct: null,
        productionEquipment: null,
        expensesStandard: null,
        settlementModes: null,
        other: null,
        supplierType: null,
        updatedBy: null,
        updatedTime: null,
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加供应商信息 供应商数据';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getSupplier(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = '修改供应商信息 供应商数据';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateSupplier(this.form).then((response) => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addSupplier(this.form).then((response) => {
              this.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除供应商信息 供应商数据编号为"' + ids + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delSupplier(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess('删除成功');
        });
    },
    //  提交勾选的数据走流程
    handleSubmitFlow(row) {
      const startParams = {};
      startParams.processDefinitionKey = this.$route.meta.params.KEY;
      startParams.businessKey = row.id;
      startParams.title = row.title;
      startProcess(startParams).then((res) => {
        this.msgSuccess(res.msg);
        this.getList();
      });
    },
  },
};
</script>
