<template>
  <div class="my-process-designer">
    <div class="my-process-designer__header">
      <slot name="control-header"></slot>
      <div class="header_div" v-if="!$slots['control-header']">
        <el-button-group>
          <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-folder-opened" v-if="!pageSee" @click="saveBpmn">保存</el-button>
          <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-folder-opened" v-if="!pageSee && !saveType" @click="$refs.refFile.click()">打开文件</el-button>
          <el-tooltip effect="light">
            <div slot="content">
              <el-button :size="headerButtonSize" type="text" @click="downloadProcessAsXml()">下载为XML文件</el-button>
              <br />
              <el-button :size="headerButtonSize" type="text" @click="downloadProcessAsSvg()">下载为SVG文件</el-button>
              <br />
              <el-button :size="headerButtonSize" type="text" @click="downloadProcessAsBpmn()">下载为BPMN文件</el-button>
            </div>
            <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-download">下载文件</el-button>
          </el-tooltip>
          <el-tooltip effect="light">
            <div slot="content">
              <el-button :size="headerButtonSize" type="text" @click="previewProcessXML">预览XML</el-button>
              <br />
              <el-button :size="headerButtonSize" type="text" @click="previewProcessJson">预览JSON</el-button>
            </div>
            <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-view">预览</el-button>
          </el-tooltip>
          <el-tooltip v-if="simulation && !pageSee" effect="light" :content="this.simulationStatus ? '退出模拟' : '开启模拟'">
            <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-cpu" @click="processSimulation">
              模拟
            </el-button>
          </el-tooltip>
        </el-button-group>
        <el-button-group>
          <el-tooltip effect="light" content="缩小视图">
            <el-button :size="headerButtonSize" :disabled="defaultZoom < 0.2" icon="el-icon-zoom-out" @click="processZoomOut()" />
          </el-tooltip>
          <el-button :size="headerButtonSize">{{ Math.floor(this.defaultZoom * 10 * 10) + "%" }}</el-button>
          <el-tooltip effect="light" content="放大视图">
            <el-button :size="headerButtonSize" :disabled="defaultZoom > 4" icon="el-icon-zoom-in" @click="processZoomIn()" />
          </el-tooltip>
          <el-tooltip effect="light" content="重置视图并居中">
            <el-button :size="headerButtonSize" icon="el-icon-c-scale-to-original" @click="processReZoom()" />
          </el-tooltip>
        </el-button-group>
        <el-button-group>
          <el-tooltip effect="light" content="向左对齐">
            <el-button :size="headerButtonSize" class="align align-left" icon="el-icon-s-data" @click="elementsAlign('left')" />
          </el-tooltip>
          <el-tooltip effect="light" content="向右对齐">
            <el-button :size="headerButtonSize" class="align align-right" icon="el-icon-s-data" @click="elementsAlign('right')" />
          </el-tooltip>
          <el-tooltip effect="light" content="向上对齐">
            <el-button :size="headerButtonSize" class="align align-top" icon="el-icon-s-data" @click="elementsAlign('top')" />
          </el-tooltip>
          <el-tooltip effect="light" content="向下对齐">
            <el-button :size="headerButtonSize" class="align align-bottom" icon="el-icon-s-data" @click="elementsAlign('bottom')" />
          </el-tooltip>
          <el-tooltip effect="light" content="水平居中">
            <el-button :size="headerButtonSize" class="align align-center" icon="el-icon-s-data" @click="elementsAlign('center')" />
          </el-tooltip>
          <el-tooltip effect="light" content="垂直居中">
            <el-button :size="headerButtonSize" class="align align-middle" icon="el-icon-s-data" @click="elementsAlign('middle')" />
          </el-tooltip>
        </el-button-group>
        <el-button-group>
          <el-tooltip effect="light" content="撤销">
            <el-button :size="headerButtonSize" :disabled="!revocable" icon="el-icon-refresh-left" @click="processUndo()" />
          </el-tooltip>
          <el-tooltip effect="light" content="恢复">
            <el-button :size="headerButtonSize" :disabled="!recoverable" icon="el-icon-refresh-right" @click="processRedo()" />
          </el-tooltip>
          <el-tooltip effect="light" content="重新绘制" v-if="!pageSee">
            <el-button :size="headerButtonSize" icon="el-icon-refresh" @click="processRestart" />
          </el-tooltip>
        </el-button-group>
      </div>
      <!-- 用于打开本地文件-->
      <input type="file" id="files" ref="refFile" style="display: none" accept=".xml, .bpmn" @change="importLocalFile" />
    </div>
    <div class="my-process-designer__container">
      <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
    </div>
    <el-dialog title="预览" width="60%" :visible.sync="previewModelVisible" append-to-body destroy-on-close>
      <highlightjs :language="previewType" :code="previewResult" />
    </el-dialog>
    <el-dialog title="保存"
               :visible.sync="open"
               width="500px"
               append-to-body>
      是否保存当前修改？
      <!-- <el-form ref="form"
               :model="form"
               label-width="120px">
        <el-form-item label="是否作为新版本">
          <el-radio-group v-model="form.newVersion">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.comment"
                    placeholder="请输入备注" />
        </el-form-item>
      </el-form> -->
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="saveBpmnFun('1')">确定并关闭</el-button>
        <el-button type="primary"
                   @click="saveBpmnFun('0')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'

import BpmnModeler from "bpmn-js/lib/Modeler";
import DefaultEmptyXML from "./plugins/defaultEmpty";
// 翻译方法
import customTranslate from "./plugins/translate/customTranslate";
import translationsCN from "./plugins/translate/zh";
// 模拟流转流程
import tokenSimulation from "bpmn-js-token-simulation";
// 标签解析构建器
// import bpmnPropertiesProvider from "bpmn-js-properties-panel/lib/provider/bpmn";
// 标签解析 Moddle
import camundaModdleDescriptor from "./plugins/descriptor/camundaDescriptor.json";
import activitiModdleDescriptor from "./plugins/descriptor/activitiDescriptor.json";
import flowableModdleDescriptor from "./plugins/descriptor/flowableDescriptor.json";
// 标签解析 Extension
import camundaModdleExtension from "./plugins/extension-moddle/camunda";
import activitiModdleExtension from "./plugins/extension-moddle/activiti";
import flowableModdleExtension from "./plugins/extension-moddle/flowable";
// 引入json转换与高亮
import convert from "xml-js";

export default {
  name: "MyProcessDesigner",
  componentName: "MyProcessDesigner",
  props: {
    pageSee: {
      type: Boolean,
      default: false
    },
    saveType: {
      type: Boolean,
      default: false
    },
    value: String, // xml 字符串
    translations: Object, // 自定义的翻译文件
    additionalModel: [Object, Array], // 自定义model
    moddleExtension: Object, // 自定义moddle
    onlyCustomizeAddi: {
      type: Boolean,
      default: false
    },
    onlyCustomizeModdle: {
      type: Boolean,
      default: false
    },
    simulation: {
      type: Boolean,
      default: true
    },
    keyboard: {
      type: Boolean,
      default: true
    },
    prefix: {
      type: String,
      default: "camunda"
    },
    events: {
      type: Array,
      default: () => ["element.click"]
    },
    headerButtonSize: {
      type: String,
      default: "small",
      validator: value => ["default", "medium", "small", "mini"].indexOf(value) !== -1
    },
    headerButtonType: {
      type: String,
      default: "primary",
      validator: value => ["default", "primary", "success", "warning", "danger", "info"].indexOf(value) !== -1
    }
  },
  data() {
    return {
      defaultZoom: 1,
      previewModelVisible: false,
      simulationStatus: false,
      previewResult: "",
      previewType: "xml",
      recoverable: false,
      revocable: false,
      // 是否显示弹出层
      open: false,
      form: {
        comment: "",
        newVersion: false,
      },
      statusOptions: [
        { label: '是', value: true},
        { label: '否', value: false}
      ]
    };
  },
  computed: {
    additionalModules() {
      const Modules = [];
      // 仅保留用户自定义扩展模块
      if (this.onlyCustomizeAddi) {
        if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
          return this.additionalModel || [];
        }
        return [this.additionalModel];
      }

      // 插入用户自定义扩展模块
      if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
        Modules.push(...this.additionalModel);
      } else {
        this.additionalModel && Modules.push(this.additionalModel);
      }

      // 翻译模块
      const TranslateModule = {
        translate: ["value", customTranslate(this.translations || translationsCN)]
      };
      Modules.push(TranslateModule);

      // 模拟流转模块
      if (this.simulation) {
        Modules.push(tokenSimulation);
      }

      // 根据需要的流程类型设置扩展元素构建模块
      // if (this.prefix === "bpmn") {
      //   Modules.push(bpmnModdleExtension);
      // }
      if (this.prefix === "camunda") {
        Modules.push(camundaModdleExtension);
      }
      if (this.prefix === "flowable") {
        Modules.push(flowableModdleExtension);
      }
      if (this.prefix === "activiti") {
        Modules.push(activitiModdleExtension);
      }

      return Modules;
    },
    moddleExtensions() {
      const Extensions = {};
      // 仅使用用户自定义模块
      if (this.onlyCustomizeModdle) {
        return this.moddleExtension || null;
      }

      // 插入用户自定义模块
      if (this.moddleExtension) {
        for (let key in this.moddleExtension) {
          Extensions[key] = this.moddleExtension[key];
        }
      }

      // 根据需要的 "流程类型" 设置 对应的解析文件
      if (this.prefix === "activiti") {
        Extensions.activiti = activitiModdleDescriptor;
      }
      if (this.prefix === "flowable") {
        Extensions.flowable = flowableModdleDescriptor;
      }
      if (this.prefix === "camunda") {
        Extensions.camunda = camundaModdleDescriptor;
      }

      return Extensions;
    }
  },
  mounted() {
    this.initBpmnModeler();
    this.createNewDiagram(this.value);
    this.$once("hook:beforeDestroy", () => {
      if (this.bpmnModeler) this.bpmnModeler.destroy();
      this.$emit("destroy", this.bpmnModeler);
      this.bpmnModeler = null;
    });
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
      this.resetForm();
    },
    resetForm() {
      this.form = {
        comment: false,
        newVersion: ""
      }
    },
    saveBpmn() {
      this.open = true;
    },
    async saveBpmnFun(flag) {
      let form = this.form;
      const { err, xml } = await this.bpmnModeler.saveXML();
      // 读取异常时抛出异常
      if (err) {
        console.error(`[Process Designer Warn ]: ${err.message || err}`);
      }
      // 获取第一个元素的实例，上面有bpmn的文件和id以及描述
      let bpmnProcess = this.bpmnModeler.get('elementRegistry').find(el => el.type === "bpmn:Process")
      this.$emit("save-finished", {
        description: bpmnProcess.businessObject.versionTag,
        key: bpmnProcess.businessObject.id,
        name: bpmnProcess.businessObject.name,
        xmlStr: xml,
        comment: form.comment,
        newVersion: form.newVersion,
        pageShow: flag
      });
      this.open = false;
    },
    initBpmnModeler() {
      if (this.bpmnModeler) return;
      this.bpmnModeler = new BpmnModeler({
        container: this.$refs["bpmn-canvas"],
        keyboard: this.keyboard ? { bindTo: document } : null,
        additionalModules: this.additionalModules,
        moddleExtensions: this.moddleExtensions
      });
      this.$emit("init-finished", this.bpmnModeler);
      this.initModelListeners();
    },
    initModelListeners() {
      const EventBus = this.bpmnModeler.get("eventBus");
      const that = this;
      // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      this.events.forEach(event => {
        EventBus.on(event, function(eventObj) {
          let eventName = event.replace(/\./g, "-");
          let element = eventObj ? eventObj.element : null;
          that.$emit(eventName, element, eventObj);
        });
      });
      // 监听图形改变返回xml
      EventBus.on("commandStack.changed", async () => {
        try {
          this.recoverable = this.bpmnModeler.get("commandStack").canRedo();
          this.revocable = this.bpmnModeler.get("commandStack").canUndo();
          let { xml } = await this.bpmnModeler.saveXML({ format: true });
          this.$emit("input", xml);
          this.$emit("change", xml);
        } catch (e) {
          console.error(`[Process Designer Warn ]: ${e.message || e}`);
        }
      });
      // 监听视图缩放变化
      this.bpmnModeler.on("canvas.viewbox.changed", e => {
        console.log(e);
        // this.defaultZoom = Math.floor(e.viewbox.scale * 10 * 10) / 100;
      });
    },
    /* 创建新的流程图 */
    async createNewDiagram(xml) {
      // console.log('根据传入的值，重构canvas的内容',xml)
      // 将字符串转换成图显示出来
      let xmlString = xml || DefaultEmptyXML(new Date().getTime(), "测试流程", this.prefix);
      try {
        let { warnings } = await this.bpmnModeler.importXML(xmlString);
        if (warnings) console.warn(warnings);
      } catch (e) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`);
      }
    },

    // 下载流程图到本地
    async downloadProcess(type, name) {
      try {
        const _this = this;
        // 按需要类型创建文件并下载
        if (type === "xml" || type === "bpmn") {
          const { err, xml } = await this.bpmnModeler.saveXML();
          // 读取异常时抛出异常
          if (err) {
            console.error(`[Process Designer Warn ]: ${err.message || err}`);
          }
          // .toUpperCase()
          let { href, filename } = _this.setEncoded(type, name, xml);
          downloadFunc(href, filename);
        } else {
          const { err, svg } = await this.bpmnModeler.saveSVG();
          // 读取异常时抛出异常
          if (err) {
            return console.error(err);
          }
          let { href, filename } = _this.setEncoded("SVG", name, svg);
          downloadFunc(href, filename);
        }
      } catch (e) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`);
      }
      // 文件下载方法
      function downloadFunc(href, filename) {
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename; //指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL 对象
        }
      }
    },

    // 根据所需类型进行转码并返回下载地址
    setEncoded(type, filename = "diagram", data) {
      const encodedData = encodeURIComponent(data);
      return {
        filename: `${filename}.${type}`,
        href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
        data: data
      };
    },

    // 加载本地文件
    importLocalFile() {
      const that = this;
      const file = this.$refs.refFile.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function() {
        let xmlStr = this.result;
        that.createNewDiagram(xmlStr);
      };
    },
    /* ------------------------------------------------ refs methods ------------------------------------------------------ */
    downloadProcessAsXml() {
      this.downloadProcess("xml");
    },
    downloadProcessAsBpmn() {
      this.downloadProcess("bpmn");
    },
    downloadProcessAsSvg() {
      this.downloadProcess("svg");
    },
    processSimulation() {
      this.simulationStatus = !this.simulationStatus;
      this.simulation && this.bpmnModeler.get("toggleMode").toggleMode();
    },
    processRedo() {
      this.bpmnModeler.get("commandStack").redo();
    },
    processUndo() {
      this.bpmnModeler.get("commandStack").undo();
    },
    processZoomIn(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 10 * 10 + zoomStep * 10 * 10) / 100;
      if (newZoom > 4) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
    },
    processZoomOut(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 10 * 10 - zoomStep * 10 * 10) / 100;
      if (newZoom < 0.2) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be less than 0.2");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
    },
    processZoomTo(newZoom = 1) {
      if (newZoom < 0.2) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be less than 0.2");
      }
      if (newZoom > 4) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(newZoom);
    },
    processReZoom() {
      this.defaultZoom = 1;
      this.bpmnModeler.get("canvas").zoom("fit-viewport", "auto");
    },
    processRestart() {
      this.recoverable = false;
      this.revocable = false;
      this.createNewDiagram(null).then(() => this.bpmnModeler.get("canvas").zoom(1, "auto"));
    },
    elementsAlign(align) {
      const Align = this.bpmnModeler.get("alignElements");
      const Selection = this.bpmnModeler.get("selection");
      const SelectedElements = Selection.get();
      if (!SelectedElements || SelectedElements.length <= 1) {
        this.$message.warning("请按住 Ctrl 键选择多个元素对齐");
        return;
      }
      this.$confirm("自动对齐可能造成图形变形，是否继续？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => Align.trigger(SelectedElements, align));
    },
    /*-----------------------------    方法结束     ---------------------------------*/
    previewProcessXML() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = xml;
        this.previewType = "xml";
        this.previewModelVisible = true;
      });
    },
    previewProcessJson() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = convert.xml2json(xml, { spaces: 2 });
        this.previewType = "json";
        this.previewModelVisible = true;
      });
    }
  },
  watch: {
    value: {
      handler: function(val) {
        this.createNewDiagram(val);
      }
    }
  }
};
</script>
