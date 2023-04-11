<template>
  <div class="wrapper">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="合同名称:" prop="htmc">
        <el-input v-model="ruleForm.htmc"></el-input>
      </el-form-item>
      <el-form-item label="合同乙方:" prop="htyf">
        <el-input v-model="ruleForm.htyf"></el-input>
      </el-form-item>
      <el-form-item label="合同金额:" prop="htje">
        <el-input v-model="ruleForm.htje"></el-input>
      </el-form-item>
      <el-form-item label="合同签订日期:" prop="htqdrq">
        <el-input v-model="ruleForm.htqdrq"></el-input>
      </el-form-item>
      <el-form-item label="合同标的:" prop="htbd">
        <el-input v-model="ruleForm.htbd"></el-input>
      </el-form-item>
      <el-form-item label="项目采购申请单:" prop="cgxmsqd">
        <el-input v-model="ruleForm.cgxmsqd"></el-input>
      </el-form-item>
      <el-form-item label="其他说明:" prop="qtsm">
        <el-input type="textarea" v-model="ruleForm.qtsm"></el-input>
      </el-form-item>
      <el-form-item label="合同附件:" prop="htfj">
        <el-input v-model="ruleForm.htfj"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ContractManagementDetails",
  components: {},
  props: {},
  data() {
    return {
      ruleForm: {
        htmc: "",
        htyf: "",
        htje: "",
        htqdrq: "",
        htbd: "",
        cgxmsqd: "",
        qtsm: "",
        htfj: "",
      },
      rules: {},
    };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 30px;
  .el-form {
    width: 500px;
  }
}
</style>