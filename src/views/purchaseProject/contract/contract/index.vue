<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="100px">
      <!-- <el-form-item label="采购项目id"
                    prop="applyId">
        <el-input v-model="queryParams.applyId"
                  placeholder="请输入关联的采购项目申请id"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="合同名称"
                    prop="contractName">
        <el-input v-model="queryParams.contractName"
                  placeholder="请输入合同名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="合同乙方名称"
                    prop="secondPartyName">
        <el-input v-model="queryParams.secondPartyName"
                  placeholder="请输入合同乙方名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="合同签订日期"
                    prop="contractDate">
        <el-date-picker clearable
                        size="small"
                        v-model="queryParams.contractDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择合同签订日期">
        </el-date-picker>
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

    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   plain
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading"
              :data="contractList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="序号"
                       align="center"
                       type="index" />
      <!-- <el-table-column label="采购项目id"
                       align="center"
                       width="180px"
                       prop="applyId" /> -->
      <el-table-column label="合同名称"
                       align="center"
                       prop="contractName" />
      <el-table-column label="合同乙方名称"
                       width="200px"
                       align="center"
                       prop="secondPartyName" />
      <el-table-column label="合同金额"
                       align="center"
                       prop="money" />
      <el-table-column label="合同签订日期"
                       align="center"
                       prop="contractDate"
                       width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.contractDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同标的"
                       align="center"
                       prop="contractObject" />
      <el-table-column label="备注"
                       align="center"
                       prop="remark" />
      <el-table-column label="附件"
                       align="center"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="downloadFile(scope.row)">{{scope.row.filemin}}</el-button> -->
          <template v-for="item in scope.row.file">
            <el-link :key="item.uid"
                     :href="item.data"
                     :underline="false"
                     target="_blank">
              <span class="el-icon-document"> {{item.name}}</span>
            </el-link>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     style="color: #F56C6C"
                     @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改合同管理 对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="100px">
        <!-- <el-form-item label="关联的采购项目申请id"
                      prop="applyId">
          <el-input v-model="form.applyId"
                    placeholder="请输入关联的采购项目申请id" />
        </el-form-item> -->
        <el-form-item label="合同名称"
                      prop="contractName">
          <el-input v-model="form.contractName"
                    placeholder="请输入合同名称" />
        </el-form-item>
        <el-form-item label="合同乙方名称"
                      prop="secondPartyName">
          <el-input v-model="form.secondPartyName"
                    @focus="showSelectSupplier"
                    ref="input1"
                    placeholder="请选择合同乙方名称" />
        </el-form-item>
        <el-form-item label="合同金额"
                      prop="money">
          <el-input v-model.number="form.money"
                    type="number"
                    placeholder="请输入合同金额" />
        </el-form-item>
        <el-form-item label="合同签订日期"
                      prop="contractDate">
          <el-date-picker clearable
                          size="small"
                          v-model="form.contractDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择合同签订日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同标的"
                      prop="contractObject">
          <el-input v-model="form.contractObject"
                    @focus="showSelectProject"
                    ref="input2"
                    placeholder="请选择合同标的" />
        </el-form-item>
        <el-form-item label="备注"
                      prop="remark">
          <el-input v-model="form.remark"
                    type="textarea"
                    placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="附件">
          <!-- <fileUploads v-model="form.file" /> -->
          <fileUploads ref="fileUpload"
                       :key="1"
                       @changefiles="changefile"
                       :files="form.file"
                       :filesNum="1" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <selectSupplier :open.sync="supplierOpen"
                    @handleSelect="handleSelectSupplier" />
    <selectProject :open.sync="projectOpen"
                   @handleSelect="handleSelectProject"
                   :supplier="form.supplier" />
  </div>
</template>

<script>
import { listContract, getContract, delContract, addContract, updateContract, exportContract } from "@/api/contract/contract";
import FileUploads from '@/components/FileUploads';
import selectSupplier from "@/components/selectSupplier"
import selectProject from "@/components/selectBudget/project"
export default {
  name: "Contract",
  components: {
    FileUploads,
    selectSupplier,
    selectProject
  },
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
      // 合同管理 表格数据
      contractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        applyId: null,
        contractName: null,
        secondPartyName: null,
        contractDate: null,
        contractObject: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      supplierOpen: false, // 合同乙方（供应商）选择
      projectOpen: false//合同标的（项目）
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changefile(obj) {
      this.changefiles(obj, 0);
    },
    changefiles(obj, type) {
      console.log('当前返回的值', obj);
      console.log('当前调用的类型', type);
      let names = ['file'];
      console.log('当前调用的变量', this.form[names[type]]);
      if (obj.flag) {
        // 表示删除，直接把现有的值赋给该变量
        this.form[names[type]] = obj.data
      } else {
        let uids = [];
        this.form[names[type]].push({
          data: obj.data,
          name: obj.name,
          uid: obj.uid
        })
        // 去除重复
        this.form[names[type]] = this.form[names[type]].filter((item) => {
          if (!uids.includes(item.uid)) {
            uids.push(item.uid);
            return true;
          }
        });
      }
    },
    // 获取上传的文件名称
    getFileName(name) {
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1).toLowerCase();
      } else {
        return "";
      }
    },
    // 选择标的（项目）弹层
    showSelectProject() {
      this.$refs.input2.blur();
      this.projectOpen = true
    },
    /** 弹窗操作 选择合同标的*/
    handleSelectProject(data) {
      console.log('接受选择的标的值', data);
      setTimeout(() => {
        let form = this.form;
        form.contractObject = (data.map(ele => ele.projectName)).join(',');
      })
    },
    // 选择乙方（供应商）弹层，
    showSelectSupplier() {
      this.$refs.input1.blur();
      this.supplierOpen = true
    },
    /** 弹窗操作 选择乙方供应商*/
    handleSelectSupplier(data) {
      console.log('接受选择的部门值', data);
      setTimeout(() => {
        let form = this.form;
        if (form.secondPartyName != data.companyName) {
          form.contractObject = null;
        }
        form.secondPartyName = data.companyName;
        form.supplier = data.id;

      })
    },
    /** 查询合同管理 列表 */
    getList() {
      this.loading = true;
      listContract(this.queryParams).then(response => {
        this.contractList = response.rows.map(item => {
          console.log(item)
          item.file = item.file.indexOf('[') !== -1 ? JSON.parse(item.file) : [{ data: item.file, name: item.file, uid: item.file }];
          return item;
        });

        this.total = response.total;
        this.loading = false;
      });
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
        applyId: null,
        contractName: null,
        secondPartyName: null,
        money: null,
        contractDate: null,
        contractObject: null,
        remark: null,
        file: [],
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        supplier: null
      };
      this.resetForm("form");
      this.$refs?.fileUpload?.clearFiles();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加合同管理 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getContract(id).then(response => {
        this.form = response.data;
        this.form.file = response.data.file.indexOf('[') !== -1 ? JSON.parse(response.data.file) : [{ data: response.data.file, name: response.data.file, uid: response.data.file }];
        this.open = true;
        this.title = "修改合同管理";
        console.log(this.form)
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.form));
          params.file = JSON.stringify(this.form.file);
          if (this.form.id != null) {
            updateContract(params).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addContract(params).then(response => {
              this.msgSuccess("新增成功");
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
      this.$confirm('是否确认删除合同管理 编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delContract(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    downloadFile(row) {
      const fileName = row.contractName
      const link = document.createElement('a')
      link.setAttribute('download', fileName)
      link.style.display = 'none'
      link.href = row.file
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
  }
};
</script>
