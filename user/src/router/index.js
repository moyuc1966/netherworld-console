import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../components/home.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/home', meta: { title: '地府管理系统' } },
    { path: '/home', component: home, meta: { title: '地府管理系统' } },
    { path: '/woodenFish', component: () => import('../components/woodenFish.vue'), meta: { title: '敲木鱼-地府管理系统' }, },
    { path: '/lifebook', component: () => import('../components/lifebook.vue'), meta: { title: '生死簿-地府管理系统' }, },
    { path: '/404', component: () => import('../components/404.vue'), meta: { title: '404-页面走丢了-地府管理系统' } },
    { path: '*', redirect: '/404' },
]



const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    // 根据路由元信息设置文档标题
    window.document.title = to.meta.title
    next()
})


export default router
