<template>
<!-- upload组件自带上传 -->
  <div class="upload-file">
      <!-- :file-list="fileList" -->
      <!--  -->
    <el-upload
      multiple
      :show-file-list="false"
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :limit="filesNum"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :headers="headers"
      class="upload-file-uploader"
      ref="upload"
      :disabled="disabled"
    >
      <!-- 上传按钮 -->
      <el-button size="mini" type="primary" :disabled="disabled">选取文件</el-button>
      <!-- 上传提示 -->
      <div class="el-upload__tip" slot="tip" v-if="showTip">
        请上传
        <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
        <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
        的文件
      </div>
    </el-upload>

    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" v-for="file in list">
        <el-link :href="file.url" :underline="false" target="_blank">
          <span class="el-icon-document"> {{ getFileName(file.name) || file.name }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action" v-if="!disabled">
          <el-link :underline="false" @click="handleDelete(file.uid)" type="danger">删除</el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  props: {
    filesNum: [Number],
    // 值
    files: [String, Object, Array],
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 50,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["doc", "xls", "ppt", "txt", "pdf"],
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
    }
  },
  data() {
    return {
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
    };
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
    // 列表
    list() {
      let temp = 1;
      if (this.files) {
        // 首先将值转为数组
        const list = Array.isArray(this.files) ? this.files : [this.files];
        let arr = null;
        // let uids = [];
        // 然后将数组转为对象数组
        return list.map((item) => {
          return {name: item.name, url: item.data,uid: item.uid};
        });
        // this.fileList = this.list;
        // 去除uid重复的
        // return arr.filter((item)=>{
        //   if(!uids.includes(item.uid)){
        //     uids.push(item.uid);
        //     return true;
        //   }
        // });
      } else {
        this.fileList = [];
        return [];
      }
    },
  },
  methods: {
    clearFiles() {
      this.$refs.upload.clearFiles();
      this.fileList = [];
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
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
          return false;
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      return true;
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(`最多允许上传${this.filesNum}个文件`);
    },
    // 上传失败
    handleUploadError(err) {
      this.$message.error("上传失败, 请重试");
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      console.log('上传成功--------',res,file)
      this.fileList.push({
        data: res.url,
        name: file.name,
        uid: file.uid
      })
      this.$message.success("上传成功");
      this.$emit("changefiles", {
        data: res.url,
        name: file.name,
        uid: file.uid
      });
    },
    // 删除文件
    handleDelete(uid) {
      this.$nextTick(()=>{
        let uids = [];
        this.fileList = this.fileList.filter((item)=>{
            // 删除匹配上uid的元素，并且去重
          if(item.uid !== uid && !uids.includes(item.uid)){
            uids.push(item.uid);
            return true;
          }
        })
        this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter((item)=>{
          if(item.uid !== uid){
            return true;
          }
        })
        this.$emit("changefiles", {
          data: this.fileList,
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
    }
  },
  created() {
    console.log('配了值')
    this.fileList = this.list;
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