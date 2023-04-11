module.exports = {
  // 项目 title，唯一定义地方
  title: '阳光采购平台',
  // 访问的域名地址
  path: {
    target: "http://localhost:8020",
    // target: "https://cg.nas.luckyh.cn/prod-api",
  },
  website: {
    key: 'ziguei'
  },
  /**
   * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
   */
  sideTheme: 'theme-dark',

  /**
   * 是否系统布局配置
   */
  showSettings: false,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  fixedHeader: false,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
  /**全局性质的状态属性 */
  states: {
    "-1": "删除",
    "0": "草稿",
    "1": "审批中",
    "2": "预算汇总审批中",
    "9": "结束"
  },
  /**全局私人自定义弹层容器宽度 */
  dialogWidth: "1200px"
}

function setPath(path) {
  console.log('测试路径----------------', process.env.NODE_ENV === "production" ? process.env.VUE_APP_BASE_API : path)
  return process.env.NODE_ENV === "production" ? process.env.VUE_APP_BASE_API : path;
}
