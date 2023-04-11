<template>
<!-- :style="{ width: `${this.width}px` }"  右侧容器宽度设置 -->
  <div class="process-panel__container" >
    <el-collapse v-model="activeTab">
      <el-collapse-item name="base">
        <div slot="title" class="panel-tab__title"><i class="el-icon-info"></i>常规</div>
        <div class="panel-tab__content">
          <el-form size="mini" label-width="90px" label-suffix="：">
            <el-form-item label="ID">
              <el-input
                v-model="activeElementBusinessObject.id"
                :disabled="idEditDisabled && activeElementBusinessObject.$type === 'bpmn:Process'"
                clearable
                @keyup.native="updateBaseInfo('id', activeElementBusinessObject.id)"
                @change="updateBaseInfo('id', $event)"
              />
            </el-form-item>
            <el-form-item label="名称">
              <el-input
                v-model="activeElementBusinessObject.name"
                clearable
                @keyup.native="updateBaseInfo('name', activeElementBusinessObject.name)"
                @change="updateBaseInfo('name', $event)"
              />
            </el-form-item>
            <!--流程的基础属性-->
            <template v-if="elementType === 'bpmn:Process'">
              <el-form-item label="版本标签">
                <el-input
                  v-model="activeElementBusinessObject.versionTag"
                  clearable
                  @keyup.native="updateBaseInfo('versionTag', activeElementBusinessObject.versionTag)"
                  @change="updateBaseInfo('versionTag', $event)"
                />
              </el-form-item>
              <!-- <el-form-item label="可执行">
                <el-switch
                  v-model="activeElementBusinessObject.isExecutable"
                  active-text="是"
                  inactive-text="否"
                  @change="updateBaseInfo('isExecutable', $event)"
                />
              </el-form-item> -->
            </template>
          </el-form>
          <!-- 人员信息配置 -->
          <template v-if="elementType === 'bpmn:UserTask'">
            <!-- <el-form size="mini" label-width="90px" label-suffix="：">
              <el-form-item label="截至日期">
                <el-input
                  v-model="activeElementBusinessObject.dueDate"
                  clearable
                  @keyup.native="updateBaseInfo('dueDate', activeElementBusinessObject.dueDate)"
                  @change="updateBaseInfo('dueDate', $event)"
                />
              </el-form-item>
            </el-form> -->
            <div class="element-property input-property">
              <div class="element-property__label">处理人</div>
              <div class="element-property__value">
                <!-- <el-select
                  v-model="activeElementBusinessObject.assignee"
                  size="mini"
                  filterable
                  allow-create
                  default-first-option
                  @change="updateBaseInfo('assignee', activeElementBusinessObject.assignee)"
                >
                  <el-option label="诸葛亮" value="zgl" />
                  <el-option label="张良" value="zhangliang" />
                  <el-option label="墨子" value="mozi" />
                </el-select> -->
                <!-- @keyup.native="updateBaseInfo('assignee', activeElementBusinessObject.assignee)" -->
                <el-input
                  v-model="activeElementBusinessObject.assigneeName"
                  clearable
                  ref="input1"
                  @focus="selectUser(1)"
                  @change="updateBaseInfo('assignee', $event)"
                  @clear="clearSelectUser(1)"
                />
              </div>
            </div>
            <div class="element-property input-property">
              <div class="element-property__label">候选人</div>
              <div class="element-property__value">
                <!-- <el-select
                  v-model="activeElementBusinessObject.candidateUsers"
                  size="mini"
                  filterable
                  allow-create
                  default-first-option
                  @change="updateBaseInfo('candidateUsers', activeElementBusinessObject.candidateUsers)"
                >
                  <el-option label="孙悟空" value="swk" />
                  <el-option label="花木兰" value="hml" />
                  <el-option label="唐僧" value="ts" />
                </el-select> -->
                <el-input
                  v-model="activeElementBusinessObject.candidateUsersName"
                  clearable
                  ref="input2"
                  @focus="selectUser(2)"
                  @change="updateBaseInfo('candidateUsers', $event)"
                  @clear="clearSelectUser(2)"
                />
              </div>
            </div>
            <div class="element-property input-property">
              <div class="element-property__label">候选组</div>
              <div class="element-property__value">
                <!-- <el-select
                  v-model="activeElementBusinessObject.candidateGroups"
                  size="mini"
                  filterable
                  allow-create
                  default-first-option
                  @change="updateBaseInfo('candidateGroups', activeElementBusinessObject.candidateGroups)"
                >
                  <el-option label="战士" value="zs" />
                  <el-option label="坦克" value="tk" />
                  <el-option label="刺客" value="ck" />
                </el-select> -->
                <el-input
                  v-model="activeElementBusinessObject.candidateGroupsName"
                  clearable
                  ref="input3"
                  @focus="selectGroup"
                  @change="updateBaseInfo('candidateGroups', $event)"
                  @clear="clearSelectGroup"
                />
              </div>
            </div>
          </template>
          <!--连接线的基础配置-->
          <condition-config v-if="flowTypeViewable" v-bind="$props" :conditions="sequenceFlowCondition" :element-id="elementId" />
          <!--任务节点配置-->
          <task-loop-characteristics v-if="taskLoopViewable" v-bind="$props" :element-id="elementId" :element-business-object="activeElementBusinessObject" />
        </div>
      </el-collapse-item>
      <!-- 外置表单配置-->
      <template v-if="elementType === 'bpmn:UserTask' || elementType === 'bpmn:StartEvent'">
        <el-collapse-item name="form">
          <div slot="title" class="panel-tab__title"><i class="el-icon-s-order"></i>表单</div>
          <element-form-config
            v-bind="$props"
            :element-id="elementId"
            :element-business-object="activeElementBusinessObject"
            @change-form-key="updateBaseInfo('formKey', $event)"
          />
        </el-collapse-item>
      </template>
      <el-collapse-item name="listeners">
        <div slot="title" class="panel-tab__title"><i class="el-icon-message-solid"></i>监听器</div>
        <element-listener v-bind="$props" :element-id="elementId" :listeners="elementListeners" @change="updateElementListener" />
      </el-collapse-item>
      <el-collapse-item name="extensions">
        <div slot="title" class="panel-tab__title"><i class="el-icon-circle-plus"></i>扩展属性</div>
        <element-attributes v-bind="$props" :element-id="elementId" :attributes="elementAttributes" @change="updateElementAttributes" />
      </el-collapse-item>
      <el-collapse-item name="other">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-promotion"></i>其他</div>
        <div class="panel-tab__content">
          <div class="element-property input-property">
            <div class="element-property__label">元素文档</div>
            <div class="element-property__value">
              <el-input
                type="textarea"
                v-model="documentation"
                size="mini"
                resize="vertical"
                :autosize="{ minRows: 2, maxRows: 4 }"
                @input="updateDocumentation"
                @blur="updateDocumentation"
              />
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <select-user-com :open.sync="userOpen" @handleSelect="selectUserFun" :selectType="userSelectType == 1 ? 1 : 0"></select-user-com>
    <select-group-com :open.sync="groupOpen" @handleSelect="selectGroupFun"></select-group-com>
  </div>
</template>
<script>
/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年1月21日09:36:25
 */
// import { debounce } from "@/utils";
import ConditionConfig from "./condition-config/ConditionConfig";
import ElementListener from "./extensional/listeners/ElementListener";
import ElementAttributes from "./extensional/attrbutes/ElementAttributes";
import TaskLoopCharacteristics from "./task-config/TaskLoopCharacteristics";
import ElementFormConfig from "./form-config/ElementFormConfig";
// import { is } from 'bpmn-js/lib/util/ModelUtil';
import selectUserCom from "@/components/selectUser"
import selectGroupCom from "@/components/selectGroup"
export default {
  name: "MyProcessPanel",
  components: { selectGroupCom, selectUserCom, ElementFormConfig, TaskLoopCharacteristics, ElementAttributes, ElementListener, ConditionConfig },
  componentName: "MyProcessPanel",
  props: {
    bpmnModeler: Object,
    prefix: {
      type: String,
      default: "camunda"
    },
    width: {
      type: Number,
      default: 480
    },
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      prefix: this.prefix,
      width: this.width
    };
  },
  data() {
    return {
      userSelectType: 1,
      groupOpen: false,
      userOpen: false,
      activeTab: "base",
      currendId: "", //当前id，id修改前的值
      activeElementBusinessObject: {},
      documentation: "", // 元素文档 对应的字符串
      sequenceFlowCondition: {}, // 连线条件实例（包含需要的类型字段）
      elementListeners: [], // 扩展属性 -- 监听器实例集合
      elementAttributes: [] // 扩展属性 -- 自定义字段属性实例集合
    };
  },
  computed: {
    elementType() {
      if (this.activeElementBusinessObject) return this.activeElementBusinessObject.$type;
      return null;
    },
    elementId() {
      if (this.activeElementBusinessObject) return this.activeElementBusinessObject.id;
      return null;
    },
    flowTypeViewable() {
      console.log('当前选择的线的值',this.elementType)
      console.log(this.activeElementBusinessObject)
      if (this.elementType !== "bpmn:SequenceFlow") return false;
      return this.activeElementBusinessObject.sourceRef && this.activeElementBusinessObject.sourceRef.$type !== "bpmn:StartEvent";
    },
    taskLoopViewable() {
      return this.elementType && this.elementType.indexOf("Task") !== -1;
    }
  },
  watch: {
    elementType(type) {
      console.log("当前选择的元素类型: ", type);
    },
    elementId(id) {
      console.log("当前选择的元素ID: ", id);
    }
  },
  created() {
    // this.initFormOnChanged = debounce(this.initFormOnChanged, 100);
    // this.updateBaseInfo = debounce(this.updateBaseInfo, 100);
    this.initModels();
  },
  mounted() {
    // this.initModels();
  },
  beforeDestroy() {
    // clearTimeout(this.timer);
  },
  methods: {
    /**选择候选组  点击*/
    selectGroup() {
     this.$refs.input3.blur();
     this.groupOpen = true
    },
    /**选择候选组  回调*/
    selectGroupFun(res) {
      this.updateBaseInfo('candidateGroups', res.id);
      this.updateBaseInfo('candidateGroupsName', res.label);
      console.log(res)
    },
    // 点击文本框清空按钮触发
    clearSelectGroup() {
      console.log('清除文本')
      // 候选组
      this.updateBaseInfo('candidateGroupsName', '');
    },
    /**选择用户  点击*/
    selectUser(type) {
     this.userSelectType = type;
     this.userOpen = true
     this.$refs.input1.blur();
     this.$refs.input2.blur();
    },
    // 点击文本框清空按钮触发
    clearSelectUser(type) {
      console.log('清除文本',type)
      // 处理人
      if(type === 1){
        this.updateBaseInfo('assigneeName', '');
      }
      // 候选人
      if(type === 2){
        this.updateBaseInfo('candidateUsersName', '');
      }
    },
    /**选择用户  回调*/
    selectUserFun(res) {
      // 处理人
      if(this.userSelectType === 1){
        this.updateBaseInfo('assignee', res.id);
        this.updateBaseInfo('assigneeName', res.label);
      }
      // 候选人
      if(this.userSelectType === 2){
        this.updateBaseInfo('candidateUsers', res.id);
        this.updateBaseInfo('candidateUsersName', res.label);
      }

      // this.activeElementBusinessObject.assigneeName = res.label;
      console.log(res)
    },
    /** 查询用户列表 用于渲染下拉列表选择 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    initModels() {
      // 初始化 modeler 以及其他 moddle
      console.log(this.bpmnModeler);
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
      this.modeling = this.bpmnModeler.get("modeling");
      this.moddle = this.bpmnModeler.get("moddle");
      this.eventBus = this.bpmnModeler.get("eventBus");
      this.bpmnFactory = this.bpmnModeler.get("bpmnFactory");
      this.elementRegistry = this.bpmnModeler.get("elementRegistry");
      this.replace = this.bpmnModeler.get("replace");
      this.selection = this.bpmnModeler.get("selection");
      this.$nextTick(() => {
        this.getActiveElement()
      });
    },
    getActiveElement() {
      // 初始第一个选中元素 bpmn:Process
      const processElement = this.elementRegistry.find(el => el.type === "bpmn:Process");
      this.activeElementBusinessObject = { ...processElement.businessObject };
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
        console.log("监听选择事件，修改当前激活的元素以及表单", newSelection);
        const shape = newSelection[0] || this.elementRegistry.find(el => el.type === "bpmn:Process");
        this.initFormOnChanged(shape.id);
      });
      this.bpmnModeler.on("element.changed", ({ element }) => {
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === this.activeElementBusinessObject.id) {
          this.initFormOnChanged(element.id);
        }
      });
    },
    // 元素更新时更新表单
    initFormOnChanged(elementId) {
      const element = this.elementRegistry.get(elementId); // 元素
      if (!element) return;
      this.activeElementBusinessObject = {
        ...JSON.parse(JSON.stringify(element.businessObject)),
        parent: element.businessObject?.$parent ? JSON.parse(JSON.stringify(element.businessObject?.$parent)) : null,
        sourceRef: element.businessObject.sourceRef ? JSON.parse(JSON.stringify(element.businessObject.sourceRef)) : null,
        targetRef: element.businessObject?.targetRef ? JSON.parse(JSON.stringify(element.businessObject?.targetRef)) : null
      };
      console.log('元素更新时更新表单-选择的当前元素的属性:',this.activeElementBusinessObject)
      const shapeDoc = element.businessObject?.documentation; // 元素文档
      this.currendId = this.activeElementBusinessObject.id;
      // 设置文档属性
      this.documentation = shapeDoc && shapeDoc.length ? shapeDoc[0]?.text : "";
      // 设置扩展监听
      if (element.businessObject?.extensionElements?.values) {
        this.elementListeners = element.businessObject.extensionElements.values.filter(
          // ex => ex.$type === "camunda:ExecutionListener"
          ex => ex.$type === `${this.prefix}:ExecutionListener` || ex.$type === `${this.prefix}:TaskListener`
        );
        this.elementAttributes = element.businessObject.extensionElements.values.filter(ex => ex.$type === `${this.prefix}:Properties`);
      } else {
        this.elementListeners = [];
        this.elementAttributes = [];
      }
      // 设置条件属性
      if (element.type.indexOf("SequenceFlow") !== -1) {
        if (element.businessObject.conditionExpression) {
          this.sequenceFlowCondition = { ...element.businessObject.conditionExpression };
          this.$set(this.sequenceFlowCondition, "type", "condition");
          return;
        }
        const sourceShape = this.elementRegistry.get(element.businessObject.sourceRef.id);
        if (sourceShape.businessObject.default && sourceShape.businessObject.default.id === elementId) {
          this.$set(this.sequenceFlowCondition, "type", "default");
          return;
        }
        this.$set(this.sequenceFlowCondition, "type", "normal");
      }
    },
    // 获取流程图中所有节点信息（用于ID修改）
    getNodeInfoList() {
      const elementRegistry = this.bpmnModeler.get('elementRegistry');
      const userTaskList = elementRegistry.filter((item) => {
        // 因为要修改的是ID，做了ID相同判断，如果不排除当前ID，每次都会走那个判断
        return item.id !== this.currendId;
      });
      // 此时得到的userTaskList 便是流程图中所有的用户节点的集合
      return userTaskList.map((ele, ind) => {
        return ele.id
      });

    },
    // 用于id修改操作
    modelingFun(fun) {
      // const modeling = this.bpmnModeler.get('modeling');
      if (!this.currendId) {
        this.$message.info('请保证要更改的节点处于选中状态!', this.currendId);
        return false;
      } else {
        // modeling这个是模型实例,可以操作模型(图形上的表单参数),第一个参数可以是单个元素实例也可以是元素实例的列表
        if (this.getShapeById()) {
          fun();
        }
      }
    },
    // 指定元素ID找到的元素，（用于ID修改操作）
    getShapeById() {
      // 没有任何事件可以触发，手里空空只有一个节点id,可以直接通过这样寻找元素
      const elementRegistry = this.bpmnModeler.get('elementRegistry');
      return elementRegistry.get(this.currendId)
    },
    // 更新常规信息
    updateBaseInfo(key, value) {
      console.log('选择的常规信息',key,value)
      // 修改的值为id的时候，特殊处理
      if(key == 'id'){
        // id必须存在，不能为空
        if(value){
          let ids = this.getNodeInfoList();
         // 判断修改的id，有没有和当前其他节点已有的id重复
          if (ids.includes(value)) {
            this.$message.info('节点id不能重复!'+ this.currendId);
            this.activeElementBusinessObject.id = this.currendId;
          } else {
            this.modelingFun(() => {
              this.modeling.updateProperties(this.getShapeById(), {
                id: value
              })
            });
            // 如果修改的是ID的话，修改结束后把ID赋值给当前的ID，
            this.activeElementBusinessObject.id = value;
            //符合判断的值存入备份
            this.currendId = value;
            console.log('修改完后的值',this.activeElementBusinessObject)
          }
        }else {
          this.$message.info('节点id不能为空!' + this.currendId);
          this.activeElementBusinessObject.id = this.currendId;
        }
      }else{
        let attrObj = {};
        attrObj[key] = value;
        this.modeling.updateProperties(this.getShapeById(), attrObj);
      }
    },
    // 更新元素文档
    updateDocumentation() {
      const element = this.elementRegistry.get(this.elementId);
      const documentation = this.bpmnFactory.create("bpmn:Documentation", { text: this.documentation });
      this.modeling.updateProperties(element, {
        documentation: [documentation]
      });
    },
    // 更新事件监听器
    updateElementListener(listeners) {
      console.log('更新监听器返回的内容',listeners)
      const element = this.elementRegistry.get(this.elementId);
      const extensionElements = element.businessObject.get("extensionElements");
      // 截取不是监听器的属性
      const otherExtensions = extensionElements?.get("values")?.filter(ex => ex.$type !== `${this.prefix}:ExecutionListener` && ex.$type !== `${this.prefix}:TaskListener`) || [];
      // 重建扩展属性
      const extensions = this.moddle.create("bpmn:ExtensionElements", {
        values: otherExtensions.concat(listeners)
      });
      this.updateElementExtensions(element, extensions);
    },
    // 更新扩展属性
    updateElementAttributes(attributes) {
      console.log('扩展属性的值',attributes)
      // attributes 是普通数组，需要重新创建实例
      const properties = this.moddle.create(`${this.prefix}:Properties`, {
        values: attributes.map(attr => {
          return this.moddle.create(`${this.prefix}:Property`, { name: attr.name, value: attr.value });
        })
      });
      const element = this.elementRegistry.get(this.elementId);
      const extensionElements = element.businessObject.get("extensionElements");
      // 截取不是扩展属性的属性
      const otherExtensions = extensionElements?.get("values")?.filter(ex => ex.$type !== `${this.prefix}:Properties`) || [];
      // 重建扩展属性
      const extensions = this.moddle.create("bpmn:ExtensionElements", { values: otherExtensions.concat([properties]) });
      this.updateElementExtensions(element, extensions);
    },
    // 更新扩展配置 extensionElements 到元素
    updateElementExtensions(element, extensions) {
      this.modeling.updateProperties(element, { extensionElements: extensions });
      // 更新表单
      this.initFormOnChanged(this.elementId);
    }
  }
};
</script>
