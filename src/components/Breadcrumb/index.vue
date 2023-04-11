<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      levelList: null,
      routeHidden: false,
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      //  切换页面的时候,把左侧的菜单高亮重置
      this.$store.dispatch('settings/setMenu','')
      // console.log('过滤后的路由',this.$store.state.permission.routes)
      // console.log('666',this)
      console.log(this.$store.state.settings.menu)
      
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/index', meta: { title: '首页' }}].concat(matched)
      }
      // console.log('要展示的标题集合',matched)
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
      // console.log('标题面包屑列表',this.levelList)
      this.routerHiddenJoinName();
    },
    routerHiddenJoinName(){
      // 路由集合
      let routes = this.$store.state.permission.sidebarRouters.slice();
      let pageRoute = this.$route;
      let PurchaseProjects = routes.filter((routeItem)=>{
        return  routeItem.path == '/purchaseProject'
      });
      let parentRoutes = PurchaseProjects[0].hidden ? PurchaseProjects[1] : PurchaseProjects[0];
      let childRoutes = PurchaseProjects[0].hidden ? PurchaseProjects[0] : PurchaseProjects[1];
      
      // console.log('父节点路由，显示在左侧菜单',parentRoutes)
      // console.log('子节点路由，不显示在左侧菜单',childRoutes)
      // 问题1：如何判断当前页面是否走这个方法，而不是自带方法，
      childRoutes.children.forEach((item)=>{
        // 相同表示当前页面是隐藏的菜单
        if(item.name == pageRoute.name){
          this.routeHidden = true;
          // console.log('当前页面是隐藏的菜单,做特殊处理',item)
          this.levelList = [{ path: '/index', meta: { title: '首页' }}].concat(this.getRouteTiles(item,parentRoutes));
        }
      })
    },
    // 获取标题集合返回
    getRouteTiles(route,parentRoutes) {
      // 去除了当前路径上的条件，只保留路由
      let routerArr = [];
      let routeThree = (route.path.split('/')).filter((item)=>{
        if(!item.includes(':')){
          return item;
        }
      });
      routeThree = routeThree.slice(0,routeThree.length - 1);
      // 先把顶层元素加进去
      routerArr.push({
        meta: parentRoutes.meta,
        redirect: parentRoutes.redirect,
        path: parentRoutes.path
      })
      // 中间的遍历添加
      this.getSetObjArr(parentRoutes,routeThree,routerArr,0);

      // 最后把当前页面元素加进去
       routerArr.push({
        meta: route.meta,
        redirect: route.redirect,
        path: route.path
      })
      // console.log(routeThree,routerArr)
      return routerArr;
    },
    // 递归方法，循环遍历获取路由节点对象,用于组建标题面包屑
    getSetObjArr(routes, routeThree , routerArr, ind) {
      routes.children.forEach((item) => {
        if(routeThree[ind] && item.path == routeThree[ind]) {
          // 过滤几个一级路由来符合框架上的展示
          if(!['budgetManagement','applyManagement','purchaseExcute','supplierManagement'].includes(routeThree[ind])){
            routerArr.push({
              meta: item.meta,
              redirect: 'noRedirect',
              path: item.path
            })
          }
          if(item.children && item.children.length > 1){
            this.getSetObjArr(item,routeThree,routerArr,ind+1);
          }
           if((ind + 1) === routeThree.length) {
            //  点击内页,把左侧的菜单高亮设为上一级路由
            this.$store.dispatch('settings/setMenu', ['/purchaseProject',...routeThree].join('/'))
           }
          
        }
      })
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim() === '首页'
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
