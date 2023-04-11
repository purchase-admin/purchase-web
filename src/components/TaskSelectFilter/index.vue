<template>
  <div>
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="90px">
      <!-- prop="budgetType" -->
      <el-form-item label="预算类型">
        <el-select v-model="queryParams.budgetType"
                   @change="selectBudgetType"
                   placeholder="请选择预算类型"
                   size="small">
          <el-option v-for="item in keyTypes"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="searchPage =='采购任务' && tabType == '3'"
                    label="是否定标"
                    prop="isCheck">
        <el-select v-model="queryParams.isCheck"
                   @change="handleQuery">
          <el-option v-for="(item,index) in checkOption"
                     :key="index"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目"
                    prop="projectId"
                    v-show="queryParams.budgetType.includes('预算内')">
        <el-cascader clearable
                     :show-all-levels="false"
                     v-model="queryParams.projectId"
                     :options="cascaderOptions"
                     :props="cascaderProps"
                     @change="handleCascaderChangeOne"></el-cascader>
      </el-form-item>
      <el-form-item label="项目"
                    prop="projectName"
                    v-show="queryParams.budgetType == '预算外'">
        <el-input v-model="queryParams.projectName"
                  placeholder="请输入项目名称"
                  clearable
                  size="small" />
      </el-form-item>
      <el-form-item label="部门"
                    prop="deptId">
        <el-cascader clearable
                     :show-all-levels="false"
                     v-model="queryParams.deptId"
                     :options="cascaderDeptOptions"
                     :props="cascaderProps"
                     @change="handleCascaderChangeThree"></el-cascader>
      </el-form-item>
      <el-form-item v-if="searchPage == '代理采购'"
                    label="录入状态"
                    prop="isSaveAgencyData">
        <el-select v-model="queryParams.isSaveAgencyData">
          <el-option v-for="(item,index) in stateOption"
                     :key="index"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="searchPage == '评选采购' || searchPage == '询价采购'"
                    label="询价状态"
                    prop="isEnd">
        <el-select v-model="queryParams.isEnd">
          <el-option v-for="(item,index) in isEndOption"
                     :key="index"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="searchPage == '评选采购' || searchPage == '询价采购'"
                    label="供应商参与"
                    prop="joinSupplierNames">
        <el-select v-model="queryParams.joinSupplierNames">
          <el-option v-for="(item,index) in joinSupplierNamesOption"
                     :key="index"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
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
        <slot></slot>
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch"></right-toolbar> -->
    </el-row>
  </div>
</template>

<script>
import { projectTypeTreeselect } from '@/api/system/projectType'
import { treeselect as deptTreeselect } from "@/api/system/dept";
export default {
  name: "TaskSelectFilter",
  props: ['searchPage', 'tabType'],
  data() {
    return {
      showSearch: true,
      queryParams: {
        projectId: null,
        deptId: null,
        budgetType: '预算内-普通预算',
        projectName: '',
        isSaveAgencyData: null,
        isCheck: null,
        isEnd: null,
        joinSupplierNames: null
      },
      cascaderDeptOptions: [],
      cascaderOptions: [],
      cascaderProps: { expandTrigger: 'hover', value: 'id', label: 'label' },
      // 询价截止状态
      isEndOption: [
        { label: '全部', value: '' },
        { label: '询价已截止', value: 1 },
        { label: '询价未截止', value: 0 }
      ],
      // 供应商参与状态
      joinSupplierNamesOption: [
        { label: '全部', value: '' },
        { label: '已有供应商参与', value: 1 },
        { label: '暂无供应商参与', value: 0 }
      ],
      // 录入状态
      stateOption: [
        { label: '全部', value: '' },
        { label: '已录入', value: 1 },
        { label: '未录入', value: 0 }
      ],
      // 中标状态
      checkOption: [
        { label: '已定标', value: '已定标' },
        { label: '未定标', value: '未定标' }
      ],
      // 预算类型
      keyTypes: [
        { label: '预算内-普通预算', value: '预算内-普通预算' },
        { label: '预算内-应急预算', value: '预算内-应急预算' },
        { label: '预算外', value: '预算外' },
      ],
    };
  },
  mounted() {
    this.getSelectThree();
    this.getSelectOneThree();
  },
  computed: {
    // ...mapState({
    //     "dialogWidth": state => state.settings.dialogWidth,
    // }),
    // dialogShow: {
    //   set(){
    //     this.cancel()
    //   },
    //   get(){
    //     return this.open
    //   }
    // },
  },
  watch: {
    tabType() {
      // 采购任务状态改变，并且状态是已过期的时候触发
      if (this.searchPage == '采购任务') {
        if (this.tabType == '3') {
          this.queryParams.isCheck = '已定标';
          this.handleQuery();
        } else {
          this.queryParams.isCheck = null;
        }
      }
    }
  },
  methods: {
    /**根据选择的预算类型展示项目搜索条件 输入框和选择框切换 */
    selectBudgetType(e) {
      // console.log(e)
      this.queryParams.projectId = null;
      this.queryParams.projectName = null;
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.searchPage !== '代理采购') {
        this.queryParams.isSaveAgencyData = null;
      }
      // 询价
      let pageList = ['询价采购', '采购任务'];
      if (!pageList.includes(this.searchPage)) {
        this.queryParams.isCheck = null;
      }
      let obj = {};

      // 如果值为null不会传递
      for (let i in this.queryParams) {
        if (this.queryParams[i] || this.queryParams[i] === 0 || this.queryParams[i] === '') {
          // 如果是预算类型
          if (i === 'budgetType') {
            if (this.queryParams[i].includes('预算内')) {
              obj[i] = '预算内';
              // 根据当前是否是应急预算来设置isUrgencyType属性
              if (this.queryParams[i] === '预算内-应急预算') {
                obj.isUrgencyType = 1;
              } else {
                obj.isUrgencyType = 0;
              }
            } else {
              // 预算外类型就去除isUrgencyType字段
              obj[i] = '预算外';
              delete obj['isUrgencyType'];
            }
          } else {
            // 普通类型正常处理
            obj[i] = this.queryParams[i];
          }
        }
      }
      // console.log('传递过去的值', obj)
      this.$emit('searchFun', obj)
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /**获取部门分类树节点 */
    getSelectOneThree() {
      deptTreeselect().then(response => {
        console.log(response.data)
        this.cascaderDeptOptions = response.data;
      });
    },
    /**获取项目分类树节点 */
    getSelectThree() {
      projectTypeTreeselect().then(response => {
        console.log(response.data)
        this.cascaderOptions = response.data
      })
    },
    /**项目级联选择触发 */
    handleCascaderChangeThree(value) {
      // console.log('级联选择触发-部门-查询条件',value,value[value.length - 1])
      this.queryParams.deptId = value.length >= 1 ? value[value.length - 1] : "";
    },
    handleCascaderChangeOne(value) {
      // console.log('级联选择触发-项目-查询条件', value, value[value.length - 1])
      this.queryParams.projectId = value.length >= 1 ? value[value.length - 1] : "";
    },
  }
};
</script>