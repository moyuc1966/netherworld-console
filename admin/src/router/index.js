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
            {
                path: '/index', component: () => import('../components/homeIndex.vue'), meta: { title: '地府管理系统' }, children: [
                    { path: '/index/samsara/selection', component: () => import('../components/samsara/selection.vue'), meta: { title: '轮回盘-地府管理系统' }, name: 'lun' }
                ]
            },
            { path: '/lifebook/data', component: () => import('../components/lifebook/lifebookData.vue'), meta: { title: '生死簿-地府管理系统' } },
            { path: '/lifebook/dataAdd', component: () => import('../components/lifebook/lifebookAdd.vue'), meta: { title: '数据同步-地府管理系统' } },
            { path: '/lifebook/info', component: () => import('../components/lifebook/info.vue'), meta: { title: '生死簿详情-地府管理系统' } },
            { path: '/lifebook/edit', component: () => import('../components/lifebook/edit.vue'), meta: { title: '生死簿编辑-地府管理系统' } },
            { path: '/reaper/reaper', component: () => import('../components/reaper/reaper.vue'), meta: { title: '勾魂使者-地府管理系统' } },
            { path: '/reaper/enchantData', component: () => import('../components/reaper/enchantData.vue'), meta: { title: '勾魂数据-地府管理系统' } },
            { path: '/reaper/addReaper', component: () => import('../components/reaper/add.vue'), meta: { title: '新增勾魂使者-地府管理系统' } },
            { path: '/trial/flowpath', component: () => import('../components/trial/flowpath.vue'), meta: { title: '十殿-地府管理系统' } },
            {
                path: '/trial/add', component: () => import('../components/trial/add.vue'), meta: { title: '审判-地府管理系统' }, children: [
                    { path: '/trial/add/samsara/selection', component: () => import('../components/samsara/selection.vue'), meta: { title: '轮回盘-地府管理系统' }, name: 'lun' }
                ]
            },
            { path: '/trial/data', component: () => import('../components/trial/data.vue'), meta: { title: '审判记录-地府管理系统' } },
            { path: '/trial/info', component: () => import('../components/trial/info.vue'), meta: { title: '审判记录详情-地府管理系统' } },
            { path: '/hell/device', component: () => import('../components/hell/device.vue'), meta: { title: '地狱设备管理-地府管理系统' } },
            { path: '/hell/flowpath', component: () => import('../components/hell/flowpath.vue'), meta: { title: '作业流程-地府管理系统' } },
            { path: '/hell/data', component: () => import('../components/hell/data.vue'), meta: { title: '地狱数据-地府管理系统' } },
            { path: '/hell/addHellLog', component: () => import('../components/hell/addHellLog.vue'), meta: { title: '添加受刑记录-地府管理系统' } },
            { path: '/samsara/selection', component: () => import('../components/samsara/selection.vue'), meta: { title: '轮回盘-地府管理系统' } },
            { path: '/samsara/data', component: () => import('../components/samsara/data.vue'), meta: { title: '轮回记录-地府管理系统' } },
            { path: '/samsara/addSamsaraLog', component: () => import('../components/samsara/add.vue'), meta: { title: '添加轮回记录-地府管理系统' } },
            { path: '/money/remittance', component: () => import('../components/money/remittance.vue'), meta: { title: '汇款-地府管理系统' } },
            { path: '/money/admin', component: () => import('../components/money/admin.vue'), meta: { title: '汇款管理-地府管理系统' } },
            { path: '/system/system', component: () => import('../components/system/system.vue'), meta: { title: '系统设置-地府管理系统' } },
            { path: '/system/setInfo', component: () => import('../components/system/setInfo.vue'), meta: { title: '信息修改-地府管理系统' } },
            { path: '/admin/admin', component: () => import('../components/admin/admin.vue'), meta: { title: '管理员管理-地府管理系统' } },
            { path: '/admin/add', component: () => import('../components/admin/add.vue'), meta: { title: '添加管理员-地府管理系统' } },
            { path: '/role/role', component: () => import('../components/role/role.vue'), meta: { title: '角色管理-地府管理系统' } },
            { path: '/role/authority', component: () => import('../components/role/authority.vue'), meta: { title: '权限设置-地府管理系统' } },
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
