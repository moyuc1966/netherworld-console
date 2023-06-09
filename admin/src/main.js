import Vue from 'vue'
import App from './App.vue'
import router from './router'
import less from 'less'
import axios from 'axios'
import '../element.js'

Vue.use(less)

Vue.prototype.andfunctionUrl = 'http://localhost:8080' //敲木鱼加功德等功能地址

Vue.prototype.apiUrl = 'http://localhost:3000'

axios.defaults.baseURL = 'http://localhost:3000/';
//请求拦截器
axios.interceptors.request.use(function (config) {
    config.headers.Authorization = localStorage.getItem('adminToken');
    return config
}, function (err) {
    Vue.prototype.$router.push('/login');
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

// 引入富文本组件
import QuillEditor from 'vue-quill-editor'
// 引入富文本组件样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(QuillEditor)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')


