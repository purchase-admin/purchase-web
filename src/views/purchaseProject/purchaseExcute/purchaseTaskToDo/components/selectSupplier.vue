<template>
  <!-- 选择供应商 单选 询价采购-->
  <div>
    <el-dialog title="选择供应商中标"
               :visible.sync="dialogShow"
               :width="dialogWidth"
               append-to-body>
      <div class="app-container">
        <el-table ref="_tables"
                  v-loading="loading"
                  :data="dataList">
          <!-- prop="supplierName" -->
          <el-table-column label="公司名称"
                           align="center"
                           show-overflow-tooltip>
            <template #default="{row}">
              <open-supplier-details :dataInfo="row"></open-supplier-details>
            </template>
          </el-table-column>
          <el-table-column label="报价"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.quotation ? defalutFlag ? scope.row.quotation : '截止报价后查看' : '暂无报价'}}
            </template>
          </el-table-column>
          <el-table-column label="报价附件"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.bjfj ? defalutFlag ? '' : '截止报价后查看' : '暂无报价附件'}}
              <el-link type="primary"
                       :underline="false"
                       v-show="defalutFlag && scope.row.bjfj"
                       @click="downloadFun(scope.row.bjfj)">{{scope.row.bjfjName}}</el-link>
            </template>
          </el-table-column>
          <!-- <el-table-column label="商务附件"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.quotationFileName1 && scope.row.quotationFilePath1 ? defalutFlag ? '' : '截止报价后查看' : '暂无商务附件'}}
            <el-link v-show="defalutFlag && scope.row.quotationFilePath1"
                     :href="path + scope.row.quotationFilePath1"
                     :underline="false"
                     target="_blank">
              <span class="el-icon-document"> {{scope.row.quotationFileName1}}</span>
            </el-link>
          </template>
        </el-table-column> -->
          <el-table-column label="技术附件"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.jsfj ? defalutFlag ? '' : '截止报价后查看' : '暂无技术附件'}}
              <el-link type="primary"
                       :underline="false"
                       v-show="defalutFlag && scope.row.jsfj"
                       @click="downloadFun(scope.row.jsfj)">{{scope.row.jsfjName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="是否中标"
                           class-name="small-padding fixed-width"
                           align="center">
            <template slot-scope="scope">
              <!-- || scope.row.isCheck === '1' -->
              <el-switch :disabled="!defalutFlag"
                         v-model="scope.row.isCheck"
                         active-value="1"
                         inactive-value="0"
                         @change="changeConfirm(scope.row)"></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <el-form v-if="checkItemFlag && result.sureContent"
                 label-width="110px"
                 style="padding-top: 36px">
          <el-form-item label="定标结果说明：">
            {{result.sureContent}}
          </el-form-item>
          <el-form-item label="定标结果附件：">
            <el-link type="primary"
                     :underline="false"
                     @click="downloadFun(result.file1)">{{result.file1Name}}</el-link>
          </el-form-item>
          <el-form-item label="定标报告：">
            <el-link type="primary"
                     :underline="false"
                     @click="downloadFun(result.file2)">{{result.file2Name}}</el-link>
          </el-form-item>
          <el-form-item label="推荐表：">
            <el-link type="primary"
                     :underline="false"
                     @click="downloadFun(result.file3)">{{result.file3Name}}</el-link>
          </el-form-item>
          <el-form-item label="公示函："
                        class="m0">
            <el-link type="primary"
                     :underline="false"
                     @click="downloadFun(result.file4)">{{result.file4Name}}</el-link>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="handleSelect">关闭</el-button>
        <!-- <el-button @click="cancel">取 消</el-button> -->
      </div>
    </el-dialog>
    <el-dialog title="中标商家的附件信息"
               :show-close="false"
               :visible.sync="dialogFormVisible"
               @closed="resetDialog">
      <el-form>
        <el-form-item label="定标结果说明">
          <el-input type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="sureContent">
          </el-input>
        </el-form-item>
        <el-form-item label="定标结果附件">
          <fileUploads ref="fileUpload1"
                       :key="1"
                       @changefiles="(opj)=>{changefiles(opj, 1)}"
                       :files="file1"
                       :filesNum="1"
                       :disabled="!stateFlag"
                       requiredText="定标结果附件" />
        </el-form-item>
        <el-form-item label="定标报告">
          <fileUploads ref="fileUpload2"
                       :key="1"
                       @changefiles="(opj)=>{changefiles(opj, 2)}"
                       :files="file2"
                       :filesNum="1"
                       :disabled="!stateFlag"
                       requiredText="定标报告" />
        </el-form-item>
        <el-form-item label="推荐表">
          <fileUploads ref="fileUpload3"
                       :key="1"
                       @changefiles="(opj)=>{changefiles(opj, 3)}"
                       :files="file3"
                       :filesNum="1"
                       :disabled="!stateFlag"
                       requiredText="推荐表" />
        </el-form-item>
        <el-form-item label="公示函">
          <fileUploads ref="fileUpload4"
                       :key="1"
                       @changefiles="(opj)=>{changefiles(opj, 4)}"
                       :files="file4"
                       :filesNum="1"
                       :disabled="!stateFlag"
                       requiredText="公示函" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary"
                   @click="dialogFormConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FileUploads from '@/components/FileUploads';
import OpenSupplierDetails from '@/components/OpenSupplierDetails';
import {
  listSupplierConfirm,
  changeSupplierConfirmCheck as changeCheck,
  changeSupplierCheckCancel as cancelCheck,
  addSupplierConfirmInfo,
} from '@/api/purchase/supplier';
export default {
  name: 'selectSupplier',
  props: ['open', 'taskId', 'endTime', 'result'],
  components: { FileUploads, OpenSupplierDetails },
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
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: '',
      // 当前是否结束招标，
      defalutFlag: false,
      dialogFormVisible: false,
      activeSupplier: null,
      stateFlag: true, // true表示可编辑，false表示不可编辑
      checkItemFlag: false, // 默认没有中标
      // 上传组件回显列表
      file1: [],
      file2: [],
      file3: [],
      file4: [],
      // 文件上传接受返回的值
      file1Data: [],
      file2Data: [],
      file3Data: [],
      file4Data: [],
      sureContent: '', // 定标结果说明
    };
  },
  watch: {
    open() {
      if (this.open) {
        this.getList();
        if (this.endTime) {
          let flag =
            new Date(`${this.endTime}`).getTime() <= new Date().getTime();
          this.defalutFlag = flag;
          console.log(`截止日期：${this.endTime},是否截止报价${flag}`);
        }
      }
    },
  },
  mounted() {},
  computed: {
    dialogShow: {
      set() {
        this.cancel();
      },
      get() {
        return this.open;
      },
    },
    ...mapState({
      dialogWidth: (state) => state.settings.dialogWidth,
    }),
  },
  methods: {
    // 查看当前点击项的供应商详情
    // onSee(item) {
    //   console.log("onSee rowItem", item);
    //   window.open(`/outer/supplierManagement/supplier/detail/${item.supplier}/空`)
    // },
    // 重置弹层的数据值
    resetDialog() {
      this.file1 = [];
      this.file2 = [];
      this.file3 = [];
      this.file4 = [];
      this.sureContent = '';
      for (var i = 1; i < 5; i++) {
        if (this.$refs['fileUpload' + i]) {
          this.$refs['fileUpload' + i].clearFiles();
        }
      }
    },
    // 弹层关闭的时候
    hideCallBack() {
      this.dialogFormVisible = false;
    },
    // 选择公司中标
    changeConfirm(row) {
      let text = row.isCheck === '0' ? '取消中标' : '中标';
      this.$confirm(
        '确认选择公司"' + row.supplierName + '"，' + text + '吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          this.activeSupplier = row;
          if (text == '取消中标') {
            this.submitForm(0, text);
          } else {
            this.dialogFormVisible = true;
          }
        })
        .catch(function (res) {
          console.log(res);
          row.isCheck = row.isCheck === '0' ? '1' : '0';
        });
    },
    /** 查询供应商列表 */
    getList() {
      console.log('调用了-----男男女女');
      this.loading = true;
      listSupplierConfirm({
        taskId: this.taskId,
      }).then((response) => {
        console.log(response);
        this.checkItemFlag = false;
        this.dataList = response.rows;
        // 动态赋值选中状态
        this.dataList.forEach((ele) => {
          if (ele.isCheck === '1') {
            ele.isCheckFlag = true;
            this.checkItemFlag = true;
          } else {
            ele.isCheckFlag = false;
          }
        });
        this.loading = false;
      });
    },
    /**确认选择操作 */
    handleSelect() {
      this.cancel();
      this.$emit('handleSelect');
    },
    // 取消按钮
    cancel() {
      this.$emit('update:open', false);
    },
    // ----------定标弹层的逻辑-------------
    // 取消添加中标公司附件信息
    dialogFormCancel() {
      // 关闭弹层，清除上传组件选择的值，返回之前选的值
      this.activeSupplier.isCheck =
        this.activeSupplier.isCheck === '0' ? '1' : '0';
      this.hideCallBack();
    },
    // 确认添加中标公司附件信息
    async dialogFormConfirm() {
      if (!this.sureContent) {
        this.msgError('定标结果说明不能为空');
        return;
      }

      //通过await使当前行为等待this.uploadFun处理完成后，再继续执行
      let uploadFlag = await this.uploadFun({
        fileNames: ['fileUpload1', 'fileUpload2', 'fileUpload3', 'fileUpload4'],
        fileDatas: ['file1Data', 'file2Data', 'file3Data', 'file4Data'],
      });
      // 如果文件没上传成功，不做处理，
      if (!uploadFlag) return;

      this.submitForm(1, '中标');
    },
    changefiles(obj, type) {
      console.log('当前返回的值', obj);
      console.log('当前调用的类型', type);
      console.log('当前调用的变量', this['file' + type]);
      if (obj.flag) {
        // 表示删除，直接把现有的值赋给该变量
        this['file' + type] = obj.data;
      } else {
        let uids = [];
        this['file' + type].push({
          data: obj.data,
          name: obj.name,
          uid: obj.uid,
        });
        // 去除重复
        this['file' + type] = this['file' + type].filter((item) => {
          if (!uids.includes(item.uid)) {
            uids.push(item.uid);
            return true;
          }
        });
      }
      console.log('当前调用的变量被编辑后', this['file' + type]);
    },
    async submitForm(type, text) {
      let params;
      let res;
      try {
        // 取消中标
        if (type === 0) {
          params = {
            taskId: this.taskId,
            supplier: this.activeSupplier.supplier,
          };
          res = await cancelCheck(params);
        } else {
          // 中标，带上额外的附件参数
          params = {
            taskId: this.taskId,
            supplier: this.activeSupplier.supplier,
            isCheck: '1',
          };
          res = await changeCheck(params);
        }
        if (res.code === 200) {
          // 如果不是取消中标就调用补充信息接口
          if (type !== 0) {
            // 这里要区分下，如果已经上传了数据，那么就不用走补充信息接口
            console.log('当前有没有值', this.result.file1);
            if (this.result.file1) {
              this.submitFormInfo(text);
            } else {
              this.submitFormCallback(text);
            }
          } else {
            // 否则直接走回调刷新中标状态，
            this.submitFormCallback(text);
          }
        } else {
          this.msgError(res.msg);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 中标后的逻辑（提示，更新列表，关闭弹层）
    submitFormCallback(text) {
      this.msgSuccess(text + '成功');
      this.getList();
      this.hideCallBack();
    },
    // 额外补充中标信息接口
    async submitFormInfo(text) {
      console.log('当前是', {
        supplierId: this.activeSupplier.id,
        sureContent: this.sureContent,
        file1: this.file1Data.join(),
        file2: this.file2Data.join(),
        file3: this.file3Data.join(),
        file4: this.file4Data.join(),
        taskId: this.taskId,
      });
      try {
        let insoRes = await addSupplierConfirmInfo({
          supplierId: this.activeSupplier.id,
          sureContent: this.sureContent,
          file1: this.file1Data.join(),
          file2: this.file2Data.join(),
          file3: this.file3Data.join(),
          file4: this.file4Data.join(),
          taskId: this.taskId,
        });
        console.log('insoRes', insoRes);
        if (insoRes.code === 200) {
          this.submitFormCallback(text);
          this.$emit('handleSuccess');
        } else {
          this.msgError(insoRes.msg);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.m0 {
  margin: 0;
}
// .text-link {
//     display: inline;
//     text-overflow: ellipsis;
//     vertical-align: middle;
//     position: relative;
//     text-align: left;
//     color: #1890ff;
//     cursor: pointer;
//     &:hover {
//       color: #46a6ff;
//     }
//   }
</style>