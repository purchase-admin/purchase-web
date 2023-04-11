<template>
<!-- upload组件 自定义上传-下载 -->
  <div class="upload-file">
    <!-- :file-list="fileList" -->
    <!--  -->
    <el-upload multiple
               :show-file-list="false"
               action="scfj"
               :on-change="handleBeforeUpload"
               :limit="filesNum"
               :on-exceed="handleExceed"
               class="upload-file-uploader"
               ref="upload"
               :disabled="disabled"
               :auto-upload="false">
      <!-- 上传按钮 -->
      <el-button size="mini"
                 slot="trigger"
                 type="primary"
                 :disabled="disabled">选取文件</el-button>
      <!-- <el-button style="margin-left: 30px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
      <!-- 上传提示 -->
      <div class="el-upload__tip"
           slot="tip"
           v-if="showTip">
        <template v-if="required"> <b style="color: #f56c6c">必选文件</b> </template>
        请上传
        <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
        <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
        的文件
      </div>
    </el-upload>
    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear"
                      tag="ul">
      <li :key="file.uid"
          style="min-height: 36px"
          class="el-upload-list__item ele-upload-list__item-content"
          v-for="file in list">
        <!-- <span class="el-icon-document" @click="downloadFile(file)"> {{ getFileName(file.name) || file.name }} </span> -->
        <el-link :underline="false" type="primary" style="padding-left: 10px" @click="downloadFile(file)">{{ getFileName(file.name) || file.name }}</el-link>
        <div class="ele-upload-list__item-content-action"
             v-if="!disabled">
          <el-link :underline="false"
                   @click="handleDelete(file.uid)"
                   type="danger">删除</el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { uploadFile, uploadFiles } from "@/api";
import { downloadHandleFile } from "@/utils";
export default {
  props: {
    filesNum: [Number],
    // 值 
    // 回显文件files-根据upload组件的回显规则 ,用于组件内部区分是回显文件还是待上传的文件
    // 回显文件： uid 和 data 值相同表示是回显的 {name: '文件名称', data: '文件id', uid: '文件id'}
    // 待上传文件：{name: '文件名称', data: '文件的对象', uid: '文件的uid'}
    files: {
      type: Array,
      default: () => [],
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 50,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg'] 
    fileType: {
      type: Array,
      default: () => ["doc", "xls", "txt", "ppt", "pdf"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    },
    //是否可以编辑
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否必选 默认必选
    required: {
      type: Boolean,
      default: true
    },
    // 必选的时候 提示文字
    requiredText: {
      type: String,
      default: '文件'
    }
  },
  data() {
    return {
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileData: '',  // 文件上传数据（多文件合一）
      fileList: [],   // upload多文件数组
    };
  },
  watch: {
    fileList(o, a) {
      // console.log('上传组件内部列表数据改变了----------', o, a)
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
    // 列表
    list() {
      if (this.files.length > 0) {
        // 首先将值转为数组
        const list = Array.isArray(this.files) ? this.files : [this.files];
        // 然后将数组转为对象数组
        return list.map((item) => {
          return { name: item.name, data: item.data, uid: item.uid };
        });
      } else {
        return [];
      }
    },
  },
  methods: {
    // 清理上传组件的数据-重置初始化状态
    clearFiles() {
      // console.log('清空了上传文件数据');
      this.$refs.upload.clearFiles();
      this.fileList = [];
    },
    // 上传前校检格式和大小
    handleBeforeUpload(fileObj) {
      let file = fileObj.raw;
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          this.$message.error(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
          this.clearFiles();
          return false;
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          this.clearFiles();
          return false;
        }
      }

      // 组件内部的数据，用于数据处理
      this.fileList.push({
        data: fileObj.raw,
        name: file.name,
        uid: file.uid
      });
      // 传递给组件外的数据-用于展示
      this.$emit("changefiles", {
        data: fileObj.raw,
        name: file.name,
        uid: file.uid
      });
      console.log('当前组件内部数据', this.fileList)
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(`最多允许上传${this.filesNum}个文件`);
    },
    // 删除文件
    handleDelete(uid) {
      this.$nextTick(() => {
        let uids = [];
        this.fileList = this.fileList.filter((item) => {
          // 删除匹配上uid的元素，并且去重
          if (item.uid !== uid && !uids.includes(item.uid)) {
            uids.push(item.uid);
            return true;
          }
        })
        // 这个设置了后，每次编辑，可以使组件获得当前最新的数量，便于触发handleExceed
        this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter((item) => {
          if (item.uid !== uid) {
            return true;
          }
        })
        this.$emit("changefiles", {
          data: this.fileList.slice(),
          flag: true
        });
      });
    },
    // 获取文件名称
    getFileName(name) {
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1).toLowerCase();
      } else {
        return "";
      }
    },
    //触发上传
    submitUpload() {
      console.log('点击上传', this.fileList)
      return new Promise((resolve, reject) => {
        if (this.fileList.length === 0) {
          if (this.required) {
            reject({
              type: 'required',
              text: `请先选择${this.requiredText}`
            });
          }  else {
            // resolve(`${this.requiredText}非必填`);
            // 返回空数组，表示当前是非必填，没有选择值
            resolve([]);
          }
        } else {
            this.fileData = new FormData();  // new formData对象
            //单个上传  
            if (this.fileList.length === 1) {
              // 区分回显数据还是新增数据
              if (this.fileList[0].data !== this.fileList[0].uid) {
                this.fileData.append("file", this.fileList[0].data);
                uploadFile(this.fileData).then(response => {
                  resolve(response.data);
                }).catch((error) => {
                  reject(error);
                });
              } else {
                // 表示是回显的数据，直接返回文件id值，
                resolve({
                  id: this.fileList[0].data
                });
              }
            } else {
              // 多个上传 
              // 区分回显数据还是新增数据
              // 因为可能有的是数据回显直接返回的文件id，有的是重新选择上传的文件(file类型)，需要先去调用下接口上传文件返回文件ID，把这些文件加入队列中去
              let awaitUploadFilesFlag = false; 
              // 多个上传的话ids是它们上传成功后附件的id集合
              let ids = [];
              this.fileList.forEach((item) => {
                // 区分回显数据还是新增数据
                if (this.fileList[0].data !== this.fileList[0].uid) {
                  this.fileData.append("files", item.data);
                  awaitUploadFilesFlag = true;
                } else {
                  // 表示是回显的数据，直接返回文件id的数组集合值，
                  ids.push({ id: item.data });
                }
              });
              // 当有待上传的文件的时候执行这一步
              if (awaitUploadFilesFlag) {
                uploadFiles(this.fileData).then(response => {
                  // 有待上传的话，等待请求成功后一起返回
                  console.log('多选上传', [...ids, ...response.rows])
                  resolve([...ids, ...response.rows])
                }).catch((error) => {
                  reject(error);
                });
              } else {
                //没有待上传的文件的的时候直接返回 
                resolve(ids);
              }
            }
          }
      });
    },
    // 下载文件
    downloadFile({name, data, uid}) {
      // 回显的文件，值是文件id，需要单独请求后端返回文件流下载文件
      if (data === uid) {
        this.downloadFun(data);
      } else {
        // 新选的文件 data是file文件对象
        downloadHandleFile(data, name);
      }
    },
    // 用于回显内部数据，父页面需要主动调用
    initFiles() {
      // 用于上传组件数据回显-（fileList内部使用数据）
      this.fileList = this.list.slice();
    },
  },
};
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>