<template>
  <div class="wrapper">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="项目名称:" prop="xmmc">
        <el-input v-model="ruleForm.xmmc"></el-input>
      </el-form-item>
      <el-form-item label="中标供应商:" prop="zbgys">
        <el-input v-model="ruleForm.zbgys"></el-input>
      </el-form-item>
      <el-form-item label="中标金额:" prop="zbje">
        <el-input v-model="ruleForm.zbje"></el-input>
      </el-form-item>
      <el-form-item label="招标公告:" prop="zbgg">
        <el-input v-model="ruleForm.zbgg"></el-input>
      </el-form-item>
      <el-form-item label="招标文件:" prop="zbwj">
        <el-input v-model="ruleForm.zbwj"></el-input>
      </el-form-item>
      <el-form-item label="供应商签到表:" prop="gysqdb">
        <el-input v-model="ruleForm.gysqdb"></el-input>
      </el-form-item>
      <el-form-item label="供应商投标文件:" prop="gystbwj">
        <el-input v-model="ruleForm.gystbwj"></el-input>
      </el-form-item>
      <el-form-item label="评委签到表:" prop="pwqdb">
        <el-input v-model="ruleForm.pwqdb"></el-input>
      </el-form-item>
      <el-form-item label="评委评分表:" prop="pwpfb">
        <el-input v-model="ruleForm.pwpfb"></el-input>
      </el-form-item>
      <el-form-item label="中标通知书:" prop="zbtzs">
        <el-input v-model="ruleForm.zbtzs"></el-input>
      </el-form-item>
      <el-form-item label="签约合同:" prop="qyht">
        <el-input v-model="ruleForm.qyht"></el-input>
      </el-form-item>
      <el-form-item label="其他资料:" prop="qtzl">
        <el-input v-model="ruleForm.qtzl"></el-input>
      </el-form-item>
      <el-form-item label="说明:" prop="sm">
        <el-input type="textarea" v-model="ruleForm.sm"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "agentEditorDetails",
  components: {},
  props: {},
  data() {
    return {
      ruleForm: {
        xmmc: "",
        zbgys: "",
        zbje: "",
        zbgg: "",
        gysqdb: "",
        gystbwj: "",
        pwqdb: "",
        pwpfb: "",
        zbtzs: "",
        qyht: "",
        qtzl: "",
        sm: "",
      },
      rules: {},
    };
  },
  watch: {},
  computed: {
   
  },
  methods: {},
  created() {},
  mounted() {
    const universityId = this.$route.params.id
    console.log('接受的id',universityId)
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 30px;
  .el-form{
    width: 500px;
  }
}
</style>