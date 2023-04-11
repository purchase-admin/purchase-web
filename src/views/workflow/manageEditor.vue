<template>
  <div id="bpmnApp">
    <my-process-designer
      :key="`designer-${reloadIndex}`"
      v-bind="controlForm"
      keyboard
      :pageSee="pageSee"
      :saveType="saveType"
      ref="processDesigner"
      @element-click="elementClick"
      @init-finished="initModeler"
      @save-finished="saveBpmn"
    />
    <my-process-panel ref="processPanel" :key="`penal-${reloadIndex}`" :bpmn-modeler="modeler" :idEditDisabled="saveType" :prefix="controlForm.prefix" class="process-panel" />

    <!-- demo config -->
    <div class="demo-control-bar">
      <div class="open-control-dialog" @click="controlDrawerVisible = true"><i class="el-icon-setting"></i></div>
    </div>
    <el-drawer :visible.sync="controlDrawerVisible" size="400px" class="bpmnControl" title="偏好设置" append-to-body destroy-on-close>
      <el-form :model="controlForm" size="small" label-suffix="：" label-width="100px" class="control-form">
        <template v-if="!pageSee">
          <el-form-item label="流转模拟">
            <el-switch v-model="controlForm.simulation" inactive-text="停用" active-text="启用" @change="reloadProcessDesigner" />
          </el-form-item>
          <el-form-item label="禁用双击">
            <el-switch v-model="controlForm.labelEditing" inactive-text="停用" active-text="启用" @change="changeLabelEditingStatus" />
          </el-form-item>
          <el-form-item label="隐藏label">
            <el-switch v-model="controlForm.labelVisible" inactive-text="停用" active-text="启用" @change="changeLabelVisibleStatus" />
          </el-form-item>
         </template>
        <!-- <el-form-item label="流程引擎">
          <el-radio-group v-model="controlForm.prefix" @change="reloadProcessDesigner">
            <el-radio label="camunda">camunda</el-radio>
            <el-radio label="flowable">flowable</el-radio>
            <el-radio label="activiti">activiti</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="工具栏">
          <el-radio-group v-model="controlForm.headerButtonSize">
            <el-radio label="mini">mini</el-radio>
            <el-radio label="small">small</el-radio>
            <el-radio label="medium">medium</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <br />
      <!-- <p style="color: #999999">注：activiti 好像不支持表单配置，控制台可能会报错</p>
      <p style="color: #999999">更多配置请查看源码：<a href="https://github.com/miyuesc/bpmn-process-designer">MiyueSC/bpmn-process-designer</a></p> -->
      <!-- https://github.com/miyuesc/bpmn-process-designer/tree/main -->
    </el-drawer>
  </div>
</template>

<script>
import translations from "@/bpmn/translations";
import CustomRenderer from "@/bpmn/modules/custom-renderer";
import CustomProvider from "@/bpmn/package/process-designer/plugins/content-pad";
import MyProcessPanel from "@/bpmn/package/process-panel/ProcessPanel";
import { saveBpmnApply, getBpmnModelApply, getBpmnHistoryModelApply } from "@/api/purchase/workflow";
export default {
  name: "bpmnApp",
  components: { MyProcessPanel },
  data() {
    return {
      xmlString: "",
      modeler: null,
      reloadIndex: 0,
      controlDrawerVisible: false,
      translationsSelf: translations,
      controlForm: {
        simulation: true,
        labelEditing: false,
        labelVisible: false,
        prefix: "flowable",
        headerButtonSize: "mini",
        additionalModel: [CustomProvider]
      },
      addis: {},
      loading: null,
      saveType: false, //新增可以编辑ID flase;修改不能编辑id true
      pageSee: false,//如果为true就只能看，不可编辑
    };
  },
  created() {
    let rParams = this.$route.params;
    console.log('路由器',this.$route)
    console.log('路由器实例',this.$router)
    if(rParams.id !== '新增'){
      
      // 表示是修改 调取接口回显数据,调用实例重构bpmn，新增不用额外处理 getBpmnHistoryModelApply
      this.loadingFun('加载流程模型文件中...');
      let handeFun = '';

      if(rParams.hid !== '空'){
        console.log('当前是查看历史版本中的实例详情')
        handeFun = getBpmnHistoryModelApply(rParams.id,rParams.hid)
         this.pageSee = true;
      }else{
        this.saveType = true;
        console.log('当前是查看实例详情,修改页面回显')
        handeFun = getBpmnModelApply(rParams.id)
      }

      handeFun.then(response =>{
        // 之前response就是xml字符串，后面外层突然包括了一层对象，所以兼容下。
        let data = response.data ? response.data : response;
        // 使用processDesigner模板组件里的方法重绘bpmn文件
        this.$refs.processDesigner.createNewDiagram(data)
        setTimeout(() => {
          this.$refs.processPanel.getActiveElement();
          this.loading.close();
        }, 500);
      }, reject =>{
        this.loading.close();
        this.msgError(reject)
      });
    }else{
      console.log('当前页面是修改或者新增',rParams.id)
    }

  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    loadingFun(text) {
      this.loading = this.$loading({
        lock: true,
        text: text,
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    // 修改和新增的保存
    saveBpmn(data) {
      this.loadingFun('保存流程模型文件中...');
      // 修改需要带上id值，新增不需要
      if(this.saveType){
        data.id = this.$route.params.id;
      }
      saveBpmnApply(data).then(response => {
        this.loading.close();
        console.log('-----------',data)
        if(data.pageShow ==='1'){
          // 用来保存成功后关闭当前页
          let view = this.$route;
          this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
            if (this.isActive(view)) {
              this.toLastView(visitedViews, view)
            }
          })
        }
        this.msgSuccess(response.msg)
        console.log('返回值',response)
      }, reject => { 
        console.log(reject);
        this.msgError(reject)
        this.loading.close();
      });
    },
    initModeler(modeler) {
      setTimeout(() => {
        this.modeler = modeler;
        console.log('bpmn实例',modeler)
        if (this.addis.customRenderer) console.log(this.modeler.get("customRenderer"));
        // this.modeler.on("drag.init", () => {
        //   this.modeler.get("dragging").cancel();
        // });
      }, 10);
    },
    reloadProcessDesigner() {
      this.controlForm.additionalModel = [];
      for (let key in this.addis) {
        if (this.addis[key]) {
          this.controlForm.additionalModel.push(this.addis[key]);
        }
      }
      this.reloadIndex += 1;
      this.modeler = null; // 避免 panel 异常
    },
    changeLabelEditingStatus(status) {
      this.addis.labelEditing = status ? { labelEditingProvider: ["value", ""] } : false;
      this.reloadProcessDesigner();
    },
    changeLabelVisibleStatus(status) {
      this.addis.customRenderer = status ? CustomRenderer : false;
      this.reloadProcessDesigner();
    },
    elementClick(element) {
      this.element = element;
      console.log(element);
    }
  }
};
</script>

<style lang="scss" scope>
#bpmnApp {
  width: 100%;
  height: calc(100vh - 16px);
  box-sizing: border-box;
  display: inline-grid;
  grid-template-columns: auto max-content;
  .demo-control-bar {
    position: fixed;
    right: 8px;
    top: 50%;
    z-index: 1;
    transform: translateY(-50%);
    .open-control-dialog {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      font-size: 32px;
      background: rgba(64, 158, 255, 1);
      color: #ffffff;
      cursor: pointer;
    }
  }
  .control-form {
    .el-radio {
      width: 100%;
      line-height: 32px;
    }
  }
}

body,
body * {
  /* 滚动条 */
  &::-webkit-scrollbar-track-piece {
    background-color: #fff; /*滚动条的背景颜色*/
    -webkit-border-radius: 0; /*滚动条的圆角宽度*/
  }
  &::-webkit-scrollbar {
    width: 10px; /*滚动条的宽度*/
    height: 8px; /*滚动条的高度*/
  }
  &::-webkit-scrollbar-thumb:vertical {
    /*垂直滚动条的样式*/
    height: 50px;
    background-color: rgba(153, 153, 153, 0.5);
    -webkit-border-radius: 4px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.3);
    -webkit-border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.5);
    -webkit-border-radius: 4px;
  }
}
</style>
