<template>
  <!-- 点击供应商名称跳转到供应商详情页 -->
  <div @click="onSee"
       :class="{'text-link': (dataInfo.supplier || dataInfo.id)}">
    {{dataInfo.supplierName || dataInfo.companyName}}
  </div>
</template>

<script>
export default {
  name: 'OpenSupplierDetails',
  // dataInfo有2种数据格式
  // 一种是名称supplierName,id是supplier
  // 一种是名称companyName,id是id
  props: ['dataInfo'],
  methods: {
    // 查看当前点击项的供应商详情
    onSee() {
      let data = this.dataInfo;
      console.log('onSee rowItem', data);
      if (!(data.supplier || data.id)) return;
      window.open(
        `/outer/supplierManagement/supplier/detail/${
          data.supplier || data.id
        }/空`
      );
    },
  },
};
</script>

<style scoped lang="scss">
.text-link {
  display: inline;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
  color: #1890ff;
  cursor: pointer;
  &:hover {
    color: #46a6ff;
  }
}
</style>