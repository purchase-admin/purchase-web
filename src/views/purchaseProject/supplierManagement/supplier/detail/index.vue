<template>
  <!-- 供应商 查看详情 编辑 新增 -->
  <div class="app-container">
    <el-row v-if="!pageOuter">
      <el-button type="primary"
                 @click="submitSend"
                 v-if="pageType === 'update'">{{pageId !=='空' ? '确认修改':'确认新增'}}</el-button>
      <el-button type="primary"
                 @click="backRouter"
                 v-else>返回</el-button>
    </el-row>
    <br />
    <a-descriptions title="分配账号"
                    v-if="isApprove === '1'"
                    bordered
                    :column="2"
                    class="com2">
      <a-descriptions-item label="供应商账号"
                           :span="2">
        <el-input v-model="form.nickName"
                  v-if="pageType == 'update'"
                  placeholder="请选择账号"
                  clearable
                  ref="input1"
                  @focus="selectUser()"
                  @clear="clearSelectUser()" />
        <template v-else> {{viewData.loginName ? viewData.loginName : '请选择供应商账号'}}</template>
      </a-descriptions-item>
    </a-descriptions>
    <br />
    <a-descriptions title="联系方式"
                    bordered
                    layout="vertical"
                    :column="4"
                    class="com2">
      <a-descriptions-item label="公司名称">
        <el-input v-model="form.companyName"
                  v-if="pageType == 'update'"
                  placeholder="请输入公司名称" />
        <template v-else> {{viewData.companyName}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="法人代表">
        <el-input v-model="form.corporateRep"
                  v-if="pageType == 'update'"
                  placeholder="请输入法人代表" />
        <template v-else> {{viewData.corporateRep}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="公司地址">
        <el-input v-model="form.companyAddress"
                  v-if="pageType == 'update'"
                  placeholder="请输入公司地址" />
        <template v-else> {{viewData.companyAddress}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="邮编">
        <el-input v-model="form.postCode"
                  v-if="pageType == 'update'"
                  placeholder="请输入邮编" />
        <template v-else> {{viewData.postCode}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="业务联系人">
        <el-input v-model="form.businessContact"
                  v-if="pageType == 'update'"
                  placeholder="请输入业务联系人" />
        <template v-else> {{viewData.businessContact}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="联系电话">
        <el-input v-model="form.phone"
                  v-if="pageType == 'update'"
                  placeholder="请输入联系电话" />
        <template v-else> {{viewData.phone}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="E-MALL">
        <el-input v-model="form.email"
                  v-if="pageType == 'update'"
                  placeholder="请输入邮箱" />
        <template v-else> {{viewData.email}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="网址">
        <el-input v-model="form.website"
                  v-if="pageType == 'update'"
                  placeholder="请输入网址" />
        <template v-else> {{viewData.website}}</template>
      </a-descriptions-item>
    </a-descriptions>
    <br />
    <a-descriptions title="交易与其他"
                    bordered
                    :column="3"
                    class="com2">
      <a-descriptions-item label="收费标准">
        <el-input v-model="form.expensesStandard"
                  v-if="pageType == 'update'"
                  placeholder="请输入收费标准" />
        <template v-else> {{viewData.expensesStandard}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="结算方式">
        <el-input v-model="form.settlementModes"
                  v-if="pageType == 'update'"
                  placeholder="请输入结算方式" />
        <template v-else> {{viewData.settlementModes}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="是否库内供应商">
        <el-switch v-model="form.isInternal"
                   active-value="1"
                   inactive-value="0"
                   v-if="pageType == 'update'"></el-switch>
        <template v-else> {{['否','是'][viewData.isInternal]}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="其他事项"
                           :span="2">
        <el-input v-model="form.other"
                  v-if="pageType == 'update'"
                  placeholder="请输入其他事项" />
        <template v-else> {{viewData.other}}</template>
      </a-descriptions-item>
    </a-descriptions>
    <br />
    <a-descriptions title="公司状况"
                    bordered
                    layout="vertical"
                    :column="3"
                    class="com2">
      <a-descriptions-item label="成立日期">
        <el-date-picker clearable
                        class="com1"
                        v-if="pageType == 'update'"
                        v-model="form.establishmentDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择成立日期">
        </el-date-picker>
        <template v-else> {{viewData.establishmentDate}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="注册资本">
        <el-input v-model="form.registeredCapital"
                  v-if="pageType == 'update'"
                  placeholder="请输入注册资本" />
        <template v-else> {{viewData.registeredCapital}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="企业性质">
        <!-- <el-input v-model="form.nature"
                  v-if="pageType == 'update'"
                  placeholder="企业性质" /> -->
        <el-select v-model="form.nature"
                   v-if="pageType == 'update'"
                   class="com1"
                   placeholder="请选择企业性质类型">
          <el-option v-for="dict in natureTypeOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue"></el-option>
        </el-select>
        <template v-else>{{selectDictLabel(natureTypeOptions, viewData.nature)}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="统一信用代码">
        <el-input v-model="form.creditCode"
                  v-if="pageType == 'update'"
                  placeholder="请输入统一信用代码" />
        <template v-else> {{viewData.creditCode}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="开户行名称">
        <el-input v-model="form.bankName"
                  v-if="pageType == 'update'"
                  placeholder="请输入开户行名称" />
        <template v-else> {{viewData.bankName}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="银行基本账号">
        <el-input v-model="form.bankAccount"
                  v-if="pageType == 'update'"
                  placeholder="请输入银行基本账号" />
        <template v-else> {{viewData.bankAccount}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="年销售额">
        <el-input v-model="form.annualSale"
                  v-if="pageType == 'update'"
                  placeholder="请输入年销售额" />
        <template v-else> {{viewData.annualSale}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="员工人数">
        <el-input v-model="form.employeeNumber"
                  v-if="pageType == 'update'"
                  placeholder="请输入员工人数" />
        <template v-else> {{viewData.employeeNumber}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="公司类型">
        <!-- <el-input v-model="form.supplierType"
                  v-if="pageType == 'update'"
                  placeholder="公司类型" /> -->
        <el-select v-model="form.supplierType"
                   v-if="pageType == 'update'"
                   class="com1"
                   placeholder="请选择公司类型">
          <el-option v-for="dict in supplierTypeOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue"></el-option>
        </el-select>
        <template v-else> {{selectDictLabel(supplierTypeOptions, viewData.supplierType)}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="专业资质"
                           :span="3">
        <el-input v-model="form.prefessionalAptitude"
                  v-if="pageType == 'update'"
                  placeholder="请输入专业资质" />
        <template v-else> {{viewData.prefessionalAptitude}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="体系论证"
                           :span="3">
        <el-input v-model="form.setupProof"
                  v-if="pageType == 'update'"
                  placeholder="请输入体系论证" />
        <template v-else> {{viewData.setupProof}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="经营范围和主要产品及服务"
                           :span="3">
        <el-input v-model="form.businessScope"
                  v-if="pageType == 'update'"
                  placeholder="请输入经营范围和主要产品及服务" />
        <template v-else> {{viewData.businessScope}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="项目分类"
                           :span="3">
        <!-- projectTypeIds.length > 0 && pageType == 'update' || pageType == '空' -->
        <!-- v-if="pageType == '空' ? projectTypeIds.length > 0 : true" -->
        <template v-if="projectTypeIdsFlag">
          <el-cascader clearable
                       v-if="pageType == '空' ? projectTypeIds.length > 0 : true"
                       :disabled="pageType !== 'update'"
                       :show-all-levels="false"
                       style="width:100%"
                       v-model="projectTypeIds"
                       :options="cascaderOptions"
                       :props="cascaderProps"
                       @change="handleCascaderChangeOne"></el-cascader>
        </template>
        <template v-if="projectTypeIds.length == 0 && pageType !== 'update' ">项目没有分类</template>
      </a-descriptions-item>
      <a-descriptions-item label="供应产品"
                           :span="3">
        <template v-if="provideProductFlag">
          <el-cascader clearable
                       v-if="pageType == '空' ? provideProductIds.length > 0 : true"
                       :disabled="pageType !== 'update'"
                       :show-all-levels="false"
                       style="width:100%"
                       v-model="provideProductIds"
                       :options="cascaderOptions"
                       :props="cascaderProps"
                       @change="handleCascaderChangeTwo"></el-cascader>
        </template>
        <template v-if="provideProductIds.length == 0 && pageType !== 'update' ">没有供应产品</template>
      </a-descriptions-item>
      <!-- <a-descriptions-item label="供应产品"
                           :span="3">
        <el-input v-model="form.provideProduct"
                  v-if="pageType == 'update'"
                  placeholder="请输入供应产品" />
        <template v-else> {{viewData.provideProduct}}</template>
      </a-descriptions-item> -->
      <a-descriptions-item label="主要生产设备"
                           :span="3">
        <el-input v-model="form.productionEquipment"
                  v-if="pageType == 'update'"
                  placeholder="请输入主要生产设备" />
        <template v-else> {{viewData.productionEquipment}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="生产及服务能力"
                           :span="3">
        <el-input v-model="form.pointProject"
                  v-if="pageType == 'update'"
                  placeholder="生产及服务能力（获得荣誉与重点项目）" />
        <template v-else> {{viewData.pointProject}}</template>
      </a-descriptions-item>
      <a-descriptions-item label="动态交易记录"
                           v-if="pageType === '空'">
        <el-table v-if="historyList.length"
                  :data="historyList"
                  style="width: 100%"
                  :border="true">
          <el-table-column prop="projectName"
                           label="采购项目">
          </el-table-column>
          <el-table-column prop="num"
                           label="采购数量"
                           width="150">
          </el-table-column>
          <el-table-column prop="endTime"
                           label="采购日期"
                           width="200">
          </el-table-column>
          <el-table-column prop="quotation"
                           label="报价金额"
                           width="180">
          </el-table-column>
          <el-table-column label="是否中标"
                           :formatter="isCheckForamt"
                           width="100">
          </el-table-column>
        </el-table>
      </a-descriptions-item>
    </a-descriptions>
    <!-- layout="vertical" -->

    <select-user-com :open.sync="userOpen"
                     @handleSelect="selectUserFun"></select-user-com>
  </div>
</template>

<script>
import selectUserCom from '@/components/selectUser/bf';
import { projectTypeTreeselect } from '@/api/system/projectType';
import {
  getSupplier,
  addSupplier,
  updateSupplier,
  getSupplierHistory,
} from '@/api/supplier/supplier';
export default {
  name: 'supplierEditor',
  components: {
    selectUserCom,
  },
  data() {
    return {
      viewData: {},
      cascaderOptions: [], // 项目
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'id',
        label: 'label',
        multiple: true,
      },
      projectTypeIds: [], // 项目分类组件接受的值
      projectTypeIdsFlag: false, //项目分类组件是否有回显值
      provideProductIds: [], // 项目分类组件接受的值
      provideProductFlag: false, //项目分类组件是否有回显值
      idArrs: [],
      isApprove: null,
      form: {
        id: null,
        projectTypeIds: null, // 项目组件过滤后的值
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
        provideProduct: null, // 供应产品组件过滤后的值
        productionEquipment: null,
        expensesStandard: null,
        settlementModes: null,
        other: null,
        supplierType: null,
        updatedBy: null,
        updatedTime: null,
        pointProject: null,
        loginName: null,
        nickName: null,
        isInternal: null,
      },
      userOpen: false,
      userSelectType: 1,
      // 公司类型类型字典
      supplierTypeOptions: [],
      //企业性质
      natureTypeOptions: [],
      pageId: '', //根据id判断是否是新增(新增无id)
      pageType: '', //根据类型判断是否是修改(update)
      // 是否是单独打开的项目外部页面，
      pageOuter: false,
      // 动态交易记录数据
      historyList: [],
    };
  },
  created() {
    this.getDicts('GSLX').then((response) => {
      this.supplierTypeOptions = response.data;
    });
    this.getDicts('QYXZ').then((response) => {
      this.natureTypeOptions = response.data;
    });
    let parmas = this.$route.params;
    this.pageId = parmas.id;
    this.pageType = parmas.type;
    if (parmas.id === '空' && parmas.type === 'update') {
      // 新增的编辑状态下默认显示
      this.projectTypeIdsFlag = true;
      this.provideProductFlag = true;
    }
    // 如果是单独打开的话，状态改变，隐藏按钮
    if (/(\/outer\/)/.test(this.$route.path)) {
      this.pageOuter = true;
    }
    this.getSelectThree();

    // console.log("router",this.$route)
  },
  methods: {
    // 是否中标的文本过滤
    isCheckForamt({ isCheck, isEnd }) {
      // 默认待选择
      let text = '待选择';
      // 报价时间截止，判断是已中标还是未中标
      if (isEnd === '1') {
        text = isCheck === '1' ? '已中标' : '未中标';
      }
      return text;
    },
    /**获取当前供应商参与过的投标记录 */
    getSupplierHistoryList() {
      getSupplierHistory({
        supplierId: this.pageId,
      }).then((response) => {
        console.log(response.rows);
        this.historyList = response.rows;
      });
    },
    /**选择用户  点击*/
    selectUser() {
      this.userOpen = true;
      this.$refs.input1.blur();
    },
    selectUserFun(res) {
      this.form.loginName = res.id;
      this.form.nickName = res.label;
    },
    // 点击文本框清空按钮触发
    clearSelectUser() {
      console.log('清除文本');
      // 用户
      this.form.loginName = '';
      this.form.nickName = '';
    },
    /**获取项目分类树节点 */
    getSelectThree() {
      projectTypeTreeselect().then((response) => {
        console.log(response.data);
        this.cascaderOptions = response.data;
        // pageId存在表示当前页面是回显页面，否则就是新增页面
        if (this.pageId !== '空') {
          this.getContentById(this.pageId);
          this.getSupplierHistoryList();
        }
      });
    },
    submitSend() {
      let updateFlag = this.pageId !== '空';
      if (updateFlag && !this.form.loginName) {
        this.$message.error('供应商账号不能为空，请选择');
        return true;
      }
      let task = updateFlag ? updateSupplier : addSupplier;
      console.log('点击提交', this.form);
      task(this.form).then((response) => {
        console.log('获取到了详情', response);
        if (response.code == 200) {
          this.$message({
            message: response.msg,
            type: 'success',
            duration: 1500,
          });
          setTimeout(() => {
            this.backRouter();
          }, 1550);
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    /**项目级联选择触发 */
    handleCascaderChangeOne(value) {
      console.log('级联选择触发-项目-查询条件', value, value[value.length - 1]);
      // console.log(this.form.projectTypeIds)
      this.form.projectTypeIds = [];
      this.projectTypeIds.forEach((item) => {
        this.form.projectTypeIds.push(item[item.length - 1]);
        console.log(item[item.length - 1]);
      });
      // this.form.projectTypeIds = value[value.length - 1]
    },
    handleCascaderChangeTwo(value) {
      console.log(
        '级联选择触发-供应产品-查询条件',
        value,
        value[value.length - 1]
      );
      this.form.provideProduct = '';
      let ids = [];
      this.provideProductIds.forEach((item) => {
        ids.push(item.join(','));
      });
      this.form.provideProduct = ids.join('-');
      console.log('供应产品', ids, this.form.provideProduct);
      // this.form.projectTypeIds = value[value.length - 1]
    },
    // 根据id获取详情信息
    getContentById(id) {
      getSupplier(id).then((response) => {
        // 区分是编辑状态还是查看状态
        if (this.pageType === 'update') {
          this.form = response.data;
        } else {
          this.viewData = response.data;
        }
        this.isApprove = response.data.isApprove;
        // 项目分类回显
        response.data.projectTypeIds.forEach((item, ind) => {
          this.$set(
            this.projectTypeIds,
            ind,
            this.getParentIdList(this.cascaderOptions, item)
          );
        });
        // console.log('遍历后的值projectTypeIds', this.projectTypeIds);
        //  供应产品回显
        if (response.data.provideProduct) {
          response.data.provideProduct.split('-').forEach((item, ind) => {
            this.$set(
              this.provideProductIds,
              ind,
              item.split(',').map((val) => parseInt(val))
            );
          });
        }
        // console.log('遍历后的值provideProductIds', this.provideProductIds, response.data.provideProduct);
        // 遍历结束，显示分类组件
        this.$nextTick(() => {
          // 因为在编辑状态 可以直接显示，非编辑状态不会显示
          this.projectTypeIdsFlag = true;
          this.provideProductFlag = true;
        });
      });
    },
    // 递归遍历获取 list 要遍历的数组对象集合, id 遍历的条件，
    // 先找到最底层和id匹配的数据，然后依次往上找，一直找到最顶级的数据组成一个数组;
    // 不太理解，迷迷糊糊的，后面再来看2021/10/14 hu
    getParentIdList(list, id) {
      if (list.length === 0 || !id) {
        return '';
      }
      let arr = [];
      let flag = false;
      // data 循环的数组对象
      // nodeId 当前用于匹配条件的id
      // parentId 当前循环对象的父元素id
      let findParent = (data, nodeId, parentId) => {
        for (var i = 0, length = data.length; i < length; i++) {
          // 当前的数据对象
          let node = data[i];
          // 传入的条件nodeId匹配成功,
          if (node.id === nodeId) {
            // 把匹配到的当前id存入arr数组中
            arr.unshift(nodeId);
            // 验证是否匹配结束
            // 匹配结束把状态设置为true; 1, 2, 3是最顶级的3个id，找到这里的其中一个就表示结束了
            if ([1, 2, 3].includes(arr[0])) {
              flag = true;
            }
            // 然后递归 继续传入待循环的列表和准备匹配的id，
            // 这里传入parentId是因为，需要找到nodeId的父id，一直找，找到顶部
            if (!flag && parentId) {
              findParent(list, parentId);
            }
            break;
          } else {
            // 没有匹配成功
            // 如果有子节点 && 没有匹配成功，就接着递归遍历, 一直找到没有子节点为止;,
            if (node.children && !flag) {
              findParent(node.children, nodeId, node.id);
            }
          }
        }
      };
      findParent(list, parseInt(id));
      return arr;
    },
    // 关闭当前页，返回上一页。
    backRouter() {
      let view = this.$route;
      this.$store
        .dispatch('tagsView/delView', view)
        .then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view);
          }
        });
    },
    isActive(route) {
      return route.path === this.$route.path;
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath });
        } else {
          this.$router.push('/');
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.com1 {
  width: 100%;
}
.com2 {
  word-break: break-all;
  word-wrap: break-word;
}
.com-descriptions {
  .com-descriptions-item {
  }
}
</style>
