import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import ParentView from '@/components/ParentView'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/purchaseProject',//顶部
    component: Layout,
    hidden: true,
    children: [
      // 预算管理
      {
        path: 'budgetManagement/budget/detail/:id/:status',
        component: (resolve) => require(['@/views/purchaseProject/budgetManagement/budget/detail/index'], resolve),
        name: '预算详情',
        noCache: true,
        meta: { title: '预算详情', icon: '' }
      },
      {
        path: 'budgetManagement/review/detail/:id/:bizId/:state',
        component: (resolve) => require(['@/views/purchaseProject/budgetManagement/review/detail/index'], resolve),
        name: '预算审核详情',
        noCache: true,
        meta: { title: '预算审核详情', icon: '' }
      },
      {
        path: 'budgetManagement/summaryReview/detail/:id/:bizId/:state',
        component: (resolve) => require(['@/views/purchaseProject/budgetManagement/summaryReview/detail/index'], resolve),
        name: '年度预算汇总审核详情',
        noCache: true,
        meta: { title: '年度预算汇总审核详情', icon: '' }
      },
      //申请管理
      {
        path: 'applyManagement/review/detail/:id/:bizId/:state',
        component: (resolve) => require(['@/views/purchaseProject/applyManagement/review/detail/index'], resolve),
        name: '申请审核详情',
        noCache: true,
        meta: { title: '申请审核详情', icon: '' }
      },
      {
        path: 'applyManagement/apply/detail/:id/:state/:year/:type',
        component: (resolve) => require(['@/views/purchaseProject/applyManagement/apply/detail/index'], resolve),
        name: '采购申请详情',
        noCache: true,
        meta: { title: '采购申请详情', icon: '' }
      },
      //采购任务
      {
        path: 'task/detail/:id',
        component: (resolve) => require(['@/views/purchaseProject/task/detail/index'], resolve),
        name: '采购任务详情',
        noCache: true,
        meta: { title: '采购任务详情', icon: '' }
      },
      // 采购执行 询价采购
      {
        path: 'purchaseExcute/purchaseTaskToDo/detail/:id/:type',
        component: (resolve) => require(['@/views/purchaseProject/purchaseExcute/purchaseTaskToDo/detail/index'], resolve),
        name: '询价采购详情',
        noCache: true,
        meta: { title: '询价采购详情', icon: '' }
      },
       // 采购执行 评选采购
       {
        path: 'purchaseExcute/selectionPurchase/detail/:id/:type',
        component: (resolve) => require(['@/views/purchaseProject/purchaseExcute/selectionPurchase/detail/index'], resolve),
        name: '评选采购详情',
        noCache: true,
        meta: { title: '评选采购详情', icon: '' }
      },
      // 供应商管理
      {
        path: 'supplierManagement/supplier/detail/:id/:type',
        component: (resolve) => require(['@/views/purchaseProject/supplierManagement/supplier/detail/index'], resolve),
        name: '供应商详情',
        noCache: true,
        meta: { title: '供应商详情', icon: '' }
      },
      {
        path: 'supplierManagement/review/detail/:id/:bizId/:state',
        component: (resolve) => require(['@/views/purchaseProject/supplierManagement/review/detail/index'], resolve),
        name: '供应商待办详情',
        noCache: true,
        meta: { title: '供应商待办详情', icon: '' }
      },
    ]
  },
  {
    path: '/workflow',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'monitor/detail/:id',
        component: (resolve) => require(['@/views/workflow/monitor/detail/index'], resolve),
        name: 'detail',
        meta: { title: '流程详情', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: (resolve) => require(['@/views/monitor/job/log'], resolve),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit/:tableId(\\d+)',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },
  // 外网特定打开的页面
  {
    hidden: true,
    path: '/outer/supplierManagement/supplier/detail/:id/:type',
    component: (resolve) => require(['@/views/purchaseProject/supplierManagement/supplier/detail/index'], resolve),
    name: '供应商详情-单独页面',
    noCache: true,
    meta: { title: '供应商详情', icon: '' }
  },
  {
    hidden: true,
    path: '/outer/budgetManagement/review/detail/:id/:bizId/:state',
    component: (resolve) => require(['@/views/purchaseProject/budgetManagement/review/detail/index'], resolve),
    name: '外网预算审核详情',
    noCache: true,
    meta: { title: '外网预算审核详情', icon: '' }
  },
  {
    hidden: true,
    path: '/outer/mobile/budgetManagement/review/detail/:id/:bizId/:state',
    component: (resolve) => require(['@/views/purchaseProject/budgetManagement/review/detail/mobile'], resolve),
    name: '外网移动端预算审核详情',
    noCache: true,
    meta: { title: '外网移动端预算审核详情', icon: '' }
  },
  {
    hidden: true,
    path: '/outer/budgetManagement/summaryReview/detail/:id/:bizId/:state',
    component: (resolve) => require(['@/views/purchaseProject/budgetManagement/summaryReview/detail/index'], resolve),
    name: '外网预算汇总审核详情',
    noCache: true,
    meta: { title: '外网预算汇总审核详情', icon: '' }
  },
  {
    hidden: true,
    path: '/outer/mobile/budgetManagement/summaryReview/detail/:id/:bizId/:state',
    component: (resolve) => require(['@/views/purchaseProject/budgetManagement/summaryReview/detail/mobile'], resolve),
    name: '外网移动端年度预算汇总审核详情',
    noCache: true,
    meta: { title: '外网移动端年度预算汇总审核详情', icon: '' }
  },
  {
    hidden: true,
    path: '/outer/applyManagement/review/detail/:id/:bizId/:state',
    component: (resolve) => require(['@/views/purchaseProject/applyManagement/review/detail/index'], resolve),
    name: '外网申请审核详情',
    noCache: true,
    meta: { title: '外网申请审核详情', icon: '' }
  },
  {
    hidden: true,
    path: '/outer/mobile/applyManagement/review/detail/:id/:bizId/:state',
    component: (resolve) => require(['@/views/purchaseProject/applyManagement/review/detail/mobile'], resolve),
    name: '外网移动端申请审核详情',
    noCache: true,
    meta: { title: '外网移动端申请审核详情', icon: '' }
  },
  {
    hidden: true,
    path: '/outer/supplierManagement/review/detail/:id/:bizId/:state',
    component: (resolve) => require(['@/views/purchaseProject/supplierManagement/review/detail/index'], resolve),
    name: '外网供应商待办详情',
    noCache: true,
    meta: { title: '外网供应商待办详情', icon: '' }
  },
  {
    hidden: true,
    path: '/outer/mobile/supplierManagement/review/detail/:id/:bizId/:state',
    component: (resolve) => require(['@/views/purchaseProject/supplierManagement/review/detail/mobile'], resolve),
    name: '外网移动端供应商待办详情',
    noCache: true,
    meta: { title: '外网移动端供应商待办详情', icon: '' }
  },
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
