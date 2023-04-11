// 生产环境下清除console打印
const plugins = []
if (process.env.NODE_ENV === 'production') {
  //exclude(忽略)
  plugins.push(["transform-remove-console", { "exclude": ["error", "warn"] }])
}
// @babel/plugin-proposal-optional-chaining 支持 ?.可选链操作符 ，？？ 空值合并操作符 @babel/plugin-proposal-nullish-coalescing-operator
plugins.push("@babel/plugin-proposal-optional-chaining","@babel/plugin-proposal-nullish-coalescing-operator")
plugins.push(["import", { libraryName: "ant-design-vue", libraryDirectory: "es", style: 'css' }])
module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset'
  ],
  plugins,
  'env': {
    'development': {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      'plugins': ['dynamic-import-node']
    }
  }
}
