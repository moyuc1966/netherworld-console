import Vue from 'vue'
import App from './App.vue'
import router from './router'
import less from 'less'
import axios from 'axios'
import '../element.js'

Vue.use(less)

Vue.prototype.apiUrl = 'http://localhost:3000'

axios.defaults.baseURL = 'http://localhost:3000/';
//请求拦截器
axios.interceptors.request.use(function (config) {
    config.headers.Authorization = localStorage.getItem('adminToken');
    return config
}, function (err) {
    this.$router.push('/login');
})
//响应拦截器
axios.interceptors.response.use(function (res) {
    if (res.data.code == 403) {
        this.$message.error("请先登录");
        this.$router.push('/login');
    } else {
        return res
    }
}, function (err) {
    this.$message.error("请先登录");
    this.$router.push('/login');
})

Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')


