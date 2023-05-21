import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'


Vue.prototype.apiUrl = 'http://localhost:3000'

Vue.prototype.adminUrl = 'http://localhost:8081' //后台管理系统地址

axios.defaults.baseURL = 'http://localhost:3000/';
//请求拦截器
axios.interceptors.request.use(function (config) {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
    return config
}, function (err) {
})
//响应拦截器
axios.interceptors.response.use(function (res) {
    return res
}, function (err) {
    Vue.prototype.$message.error("访问被拒绝");
    console.log(err);
})

Vue.prototype.$http = axios;

Vue.config.productionTip = false


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')


