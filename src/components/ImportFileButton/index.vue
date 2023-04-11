<template>
  <div>

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
                 :auto-upload="false">
        <!-- 上传按钮 -->
        <el-button type="warning"
                   slot="trigger"
                   plain
                   icon="el-icon-upload2"
                   size="mini"
                   @click="handleImport">批量导入供应商</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    filesNum: [Number],
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 50,
    },
    fileType: {
      type: Array,
      default: () => ["doc", "xls", "txt", "ppt", "pdf"],
    },
  },
  data() {
    return {};
  },
  methods: {
    handleImport() {},
    // 清理上传组件的数据-重置初始化状态
    clearFiles() {
      // console.log('清空了上传文件数据');
      this.$refs.upload.clearFiles();
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(`最多允许上传${this.filesNum}个文件`);
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
      // 传递给组件外的数据-用于展示-选择多个文件会触发多次
      this.$emit("changefiles", {
        data: fileObj.raw,
        name: file.name,
        uid: file.uid
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
