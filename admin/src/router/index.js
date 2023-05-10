import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import home from '../components/home.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login, meta: { title: '登录-地府管理系统' } },
    {
        path: '/home', component: home, meta: { title: '地府管理系统' }, redirect: '/index', children: [
            { path: '/index', component: () => import('../components/homeIndex.vue'), meta: { title: '地府管理系统' } },


        ]
    },
    { path: '/404', component: () => import('../components/404.vue'), meta: { title: '404-页面走丢了-地府管理系统' } },
    { path: '*', redirect: '/404' },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.meta.title) {//判断是否有标题
        document.title = to.meta.title
    }
    // if (to.path == '/home' && from.path == '/login') return next();
    if (to.path === '/login') {
        const token = localStorage.getItem('adminToken');
        const time = Number(localStorage.getItem('tokenStartTime'))
        if (token && time + (7 * 24 * 60 * 60) - (60 * 60) > Math.round(new Date().getTime() / 1000)) return next('/home')
        return next()
    }
    if (to.path === '/index') {
        const token = localStorage.getItem('adminToken');
        const time = Number(localStorage.getItem('tokenStartTime'));
        if (token && time + (7 * 24 * 60 * 60) - (60 * 60) > Math.round(new Date().getTime() / 1000)) return next()
        return next('/login')
    }
    next()
})

export default router
