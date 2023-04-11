<template>
  <div>
    <!-- 选择供应商 单选 评选采购-->
    <el-dialog title="选择供应商中标"
               :visible.sync="dialogShow"
               :width="dialogWidth"
               append-to-body>
      <div class="app-container">
        <el-table ref="_tables"
                  v-loading="loading"
                  :data="dataList">
          <el-table-column label="公司名称"
                           align="center"
                           show-overflow-tooltip>
            <template #default="{row}">
              <open-supplier-details :dataInfo="row"></open-supplier-details>
            </template>
          </el-table-column>
          <el-table-column label="公司报价"
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
          <el-table-column label="商务附件"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.swfj ? defalutFlag ? '' : '截止报价后查看' : '暂无报价附件'}}
              <el-link type="primary"
                       :underline="false"
                       v-show="defalutFlag && scope.row.swfj"
                       @click="downloadFun(scope.row.swfj)">{{scope.row.swfjName}}</el-link>
            </template>
          </el-table-column>
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
          <el-table-column label="评委评分表"
                           align="center">
            <template slot-scope="scope">
              <template v-for="(item,index) in scope.row.fileList">
                <el-link type="primary"
                         :underline="false"
                         :key="index"
                         @click="downloadFun(item.id)">{{item.name}}</el-link>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="评分办法"
                           align="center">
            <template slot-scope="scope">
              <el-link type="primary"
                       :underline="false"
                       @click="downloadFun(scope.row.file2)">{{scope.row.file2Name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="定标报告"
                           align="center">
            <template slot-scope="scope">
              <el-link type="primary"
                       :underline="false"
                       @click="downloadFun(scope.row.file3)">{{scope.row.file3Name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="推荐表"
                           align="center">
            <template slot-scope="scope">
              <el-link type="primary"
                       :underline="false"
                       @click="downloadFun(scope.row.file4)">{{scope.row.file4Name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="公示函"
                           align="center">
            <template slot-scope="scope">
              <el-link type="primary"
                       :underline="false"
                       @click="downloadFun(scope.row.file5)">{{scope.row.file5Name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="是否中标"
                           class-name="small-padding fixed-width"
                           align="center">
            <template slot-scope="scope">
              <!-- 没有过报价时间时候不可操作 -->
              <!-- 或者已经选中的值的 scope.row.isCheck === '1' -->
              <el-switch :disabled="!defalutFlag"
                         v-model="scope.row.isCheck"
                         active-value="1"
                         inactive-value="0"
                         @change="changeConfirm(scope.row)"></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="handleSelect">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="中标商家的附件信息"
               :show-close="false"
               @closed="resetDialog"
               :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="评委评分表(可上传多附件)">
          <fileUploads ref="fileUpload1"
                       :key="1"
                       @changefiles="(opj)=>{changefiles(opj, 1)}"
                       :files="file1"
                       :filesNum="3"
                       :disabled="!stateFlag"
                       requiredText="评委评分表" />
        </el-form-item>
        <el-form-item label="评分办法">
          <fileUploads ref="fileUpload2"
                       :key="1"
                       @changefiles="(opj)=>{changefiles(opj, 2)}"
                       :files="file2"
                       :filesNum="1"
                       :disabled="!stateFlag"
                       requiredText="评分办法" />
        </el-form-item>
        <el-form-item label="定标报告">
          <fileUploads ref="fileUpload3"
                       :key="1"
                       @changefiles="(opj)=>{changefiles(opj, 3)}"
                       :files="file3"
                       :filesNum="1"
                       :disabled="!stateFlag"
                       requiredText="定标报告" />
        </el-form-item>
        <el-form-item label="推荐表">
          <fileUploads ref="fileUpload4"
                       :key="1"
                       @changefiles="(opj)=>{changefiles(opj, 4)}"
                       :files="file4"
                       :filesNum="1"
                       :disabled="!stateFlag"
                       requiredText="推荐表" />
        </el-form-item>
        <el-form-item label="公示函">
          <fileUploads ref="fileUpload5"
                       :key="1"
                       @changefiles="(opj)=>{changefiles(opj, 5)}"
                       :files="file5"
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
import dialogMixins from '@/utils/mixins/dialog';
import FileUploads from '@/components/FileUploads';
import OpenSupplierDetails from '@/components/OpenSupplierDetails';
import {
  listSupplierConfirm,
  changeSupplierConfirmCheck as changeCheck,
  changeSupplierCheckCancel as cancelCheck,
} from '@/api/purchase/supplier';
export default {
  name: 'selectSupplier',
  props: ['open', 'taskId', 'endTime'],
  mixins: [dialogMixins],
  components: {
    FileUploads,
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
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: '',
      // 上传组件回显列表
      file1: [],
      file2: [],
      file3: [],
      file4: [],
      file5: [],
      // 文件上传接受返回的值
      file1Data: [],
      file2Data: [],
      file3Data: [],
      file4Data: [],
      file5Data: [],
      // 当前是否结束招标，
      defalutFlag: false,
      // 附件上传
      dialogFormVisible: false,
      activeSupplier: null,
      stateFlag: true, //true表示可编辑，false表示不可编辑
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
  methods: {
    // 重置弹层的数据值
    resetDialog() {
      this.file1 = [];
      this.file2 = [];
      this.file3 = [];
      this.file4 = [];
      this.file5 = [];
      for (var i = 1; i < 6; i++) {
        if (this.$refs['fileUpload' + i]) {
          this.$refs['fileUpload' + i].clearFiles();
        }
      }
    },
    // 弹层关闭的时候
    hideCallBack() {
      this.dialogFormVisible = false;
    },
    // 获取文件名称
    getFileName(name) {
      if (name.lastIndexOf('/') > -1) {
        return name.slice(name.lastIndexOf('/') + 1).toLowerCase();
      } else {
        return '';
      }
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
    },
    // 多选上传文件，把值赋给form里面的file1
    changefiles1(obj) {
      this.changefiles(obj, 1);
    },
    // 单选上传文件，把值赋给form里面的file2
    changefiles2(obj) {
      this.changefiles(obj, 2);
    },
    // 单选上传文件，把值赋给form里面的file3
    changefiles3(obj) {
      this.changefiles(obj, 3);
    },
    // 选择公司中标
    changeConfirm(row) {
      let text = row.isCheck === '0' ? '取消中标' : '中标';
      this.$confirm(
        '确认选择公司"' + row.supplierName + '"，' + text + '吗?',
        '提示',
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
    // 确认添加中标公司附件信息
    dialogFormConfirm() {
      // console.log('点击添加公司附件信息',this.form)
      this.submitForm(1, '中标');
    },
    // 取消添加中标公司附件信息
    dialogFormCancel() {
      // 关闭弹层，清除上传组件选择的值，返回之前选的值
      this.activeSupplier.isCheck =
        this.activeSupplier.isCheck === '0' ? '1' : '0';
      this.hideCallBack();
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
          //通过await使当前行为等待this.uploadFun处理完成后，再继续执行
          let uploadFlag = await this.uploadFun({
            fileNames: [
              'fileUpload1',
              'fileUpload2',
              'fileUpload3',
              'fileUpload4',
              'fileUpload5',
            ],
            fileDatas: [
              'file1Data',
              'file2Data',
              'file3Data',
              'file4Data',
              'file5Data',
            ],
          });
          // 如果文件没上传成功，不做处理，
          if (!uploadFlag) return;
          params = {
            taskId: this.taskId,
            supplier: this.activeSupplier.supplier,
            isCheck: '1',
            file1: this.file1Data,
            file2: this.file2Data.join(),
            file3: this.file3Data.join(),
            file4: this.file4Data.join(),
            file5: this.file5Data.join(),
          };
          console.log('当前是', params);
          res = await changeCheck(params);
        }
        // 取消或者确认中标成功
        if (res.code === 200) {
          this.submitFormCallback(text);
        } else {
          this.msgError(res.msg);
        }
      } catch (err) {
        console.log(error);
      }
    },
    // 中标后的逻辑（提示，更新列表，关闭弹层）
    submitFormCallback(text) {
      this.msgSuccess(text + '成功');
      this.getList();
      this.hideCallBack();
    },
    /** 查询供应商列表 */
    getList() {
      // return true;
      this.loading = true;
      listSupplierConfirm({
        taskId: this.taskId,
      }).then((response) => {
        this.dataList = response.rows;
        this.dataList.forEach((ele) => {
          ele.isCheckFlag = ele.isCheck === '1' ? true : false;
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
  },
};
</script>