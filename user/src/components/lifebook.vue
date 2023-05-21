<template>
    <div class="main">
        <div class="finduserbox" @click="findShow()">
            <span>{{ find }}</span>
        </div>
        <img :src="imgUrl" class="img" alt="">
        <div class="utw" v-if="findShowif" @click="findShowif = false">
            <div class="utw-box" v-if="isToken" @click.stop="1 + 1">
                <span class="del" @click="del">注销授权</span>
                <span class="title">选择生死簿</span>
                <div class="form">
                    <span class="label">搜索</span>
                    <input type="text" class="input" placeholder="请输入姓名或身份号" v-model="filebookuuid">
                    <span class="btn" @click="handleSearch">搜索</span>
                </div>

                <div class="filelist">
                    <div class="file-item" v-for="(item, index) in filebook" :key="index">
                        <span class="name">{{ item.name }}</span>
                        <span class="uuid">{{ item.uuid }}</span>
                        <span class="info" @click="handleSelect(item)">选择</span>
                    </div>
                </div>
            </div>
            <div class="utw-box" v-else @click.stop="1 + 1">
                <span class="title">选择生死簿</span>
                <span class="utw-info">为防止刷量，需获取系统管理员权限后再次获取生死簿内容，每次获取授权有效期为24小时</span>
                <span class="btn" @click="getToken()">获取授权</span>
            </div>
        </div>
        <div class="utw" v-if="loading">
            <span class="ts">正在导出生死簿{{ loadinginfo }}</span>
        </div>
    </div>
</template>

<script>
const img = require('../../image/def.png')
export default {
    data() {
        return {
            imgUrl: img,
            inner: '',
            find: '选择生死簿',
            findShowif: false,
            isToken: false,
            filebookuuid: '',
            filebook: [],
            info: {
                name: '',
                uuid: ''
            },
            loading: false,
            loadinginfo: '。。。',
            set: ''
        }
    },
    methods: {
        findShow() {
            let token = localStorage.getItem('token')
            let tokenTime = localStorage.getItem('tokenTime')
            let nowTime = new Date().getTime()
            if (token && tokenTime && nowTime - tokenTime < 1000 * 60 * 60 * 24) {
                this.isToken = true
                if (localStorage.getItem('info')) {
                    this.info = JSON.parse(localStorage.getItem('info'))
                    this.find = '生死簿记录：' + this.info.name
                    this.imgUrl = localStorage.getItem('imgurl')
                }
            } else {
                this.isToken = false
            }
            this.findShowif = !this.findShowif
        },
        getImg(item) {
            this.loading = true
            let set = setInterval(() => {
                this.loadinginfo += '。'
                if (this.loadinginfo.length == 7) this.loadinginfo = '。。。'
            }, 500);
            let a = item
            let inner = `${a.name}，身份号${a.uuid}，于${a.birthday}出生于${a.birthplace}，生辰八字为${a.year}，于${a.deathday}在${a.deathplace}因${a.reason}${a.type == 0 ? '自然死亡' : '意外死亡'}离世入府，计寿元${a.longevity}年。
            命中带财${a.money}阴财${a.yinmoney}，所积阳德${a.yang}阴德${a.yin}，${a.marriage}，有${a.child}个子女。${a.event}。${a.description}，${a.name}${a.characterinfo}。死后${a.afterlife}，判得赏罚${a.reward}，
            现在${a.status == 0 ? '还未出世。' : a.status == 1 ? '在世生活。' : a.status == 2 ? '魂归地府' : a.status == 3 ? '已进入轮回。' : '已打入地狱受刑。'}`
            this.inner = inner
            this.$http.post('/api/lifebook/export', {
                inner: this.inner
            }, { responseType: 'blob' }).then((response) => {
                const myBlob = new window.Blob([response.data], { type: 'image/png' })
                const qrUrl = window.URL.createObjectURL(myBlob)
                this.imgUrl = qrUrl
                clearInterval(set)
                localStorage.setItem('imgurl', qrUrl)
                this.findShowif = false
                this.loading = false
            }).catch((err) => {
                this.$message({
                    type: 'error',
                    message: '生成失败'
                })
            })
        },
        getNum() {
            if (localStorage.getItem('info')) {
                this.info = JSON.parse(localStorage.getItem('info'))
                this.find = '生死簿记录：' + this.info.name
            }
            if (localStorage.getItem('imgurl')) {
                this.imgUrl = localStorage.getItem('imgurl')
            }
        },
        tw(text, time) {
            //一个小提示弹窗
            let tips = document.createElement("div");
            tips.className = "tips";
            tips.style.position = "fixed";
            tips.style.top = "100px";
            tips.style.left = "50%";
            tips.style.transform = "translateX(-50%)";
            tips.style.backgroundColor = "#e7e7e780";
            tips.style.color = "#fff";
            tips.style.padding = "10px 20px";
            tips.style.borderRadius = "4px";
            tips.style.transition = "all .3s";
            tips.style.zIndex = "1000000";
            tips.innerHTML = text;
            document.getElementsByClassName("main")[0].appendChild(tips);
            setTimeout(function () {
                try {
                    document.getElementsByClassName("main")[0].removeChild(document.getElementsByClassName("tips")[0]);
                } catch (error) {
                    console.log(error);
                }
            }, time);
        },
        del() {
            localStorage.removeItem('token')
            localStorage.removeItem('tokenTime')
            localStorage.removeItem('info')
            this.find = '选择生死簿'
            this.isToken = false
            this.findShowif = false
            this.filebookuuid = ''
            this.imgUrl = img
            this.filebook = []
            this.info = {}
            this.tw('注销成功', 2000)
        },
        handleSearch() {
            if (document.getElementsByClassName("tips")[0]) document.getElementsByClassName("main")[0].removeChild(document.getElementsByClassName("tips")[0]);
            if (this.filebookuuid == '') return this.tw('请输入完整', 2000)
            let search = ''
            let reg = /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/
            if (reg.test(this.filebookuuid)) {
                search = 'name=' + this.filebookuuid
            } else {
                let filebookuuid = this.filebookuuid.toLocaleUpperCase()
                search = 'uuid=' + filebookuuid
            }
            this.$http.get('admin/lifeBookSearch?' + search).then(res => {
                if (res.data.code === 200) {
                    if (res.data.data.length > 0) {
                        this.filebook = res.data.data
                    } else {
                        if (document.getElementsByClassName("tips")[0]) document.getElementsByClassName("main")[0].removeChild(document.getElementsByClassName("tips")[0]);
                        this.tw('暂无数据', 2000)
                    }
                } else {
                    if (document.getElementsByClassName("tips")[0]) document.getElementsByClassName("main")[0].removeChild(document.getElementsByClassName("tips")[0]);
                    this.tw('暂无权限', 2000)
                }
            })
        },
        handleSelect(item) {
            this.info.uuid = item.uuid
            this.info.name = item.name
            this.find = '生死簿记录：' + item.name
            this.getImg(item)
            localStorage.setItem('info', JSON.stringify(this.info))
        },
        getToken() {
            this.tw('获取授权中...', 2000)
            this.$http.get('api/user/gettempauth').then(res => {
                if (res.data.code === 200) {
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('tokenTime', new Date().getTime())
                    this.isToken = true
                    if (document.getElementsByClassName("tips")[0]) document.getElementsByClassName("main")[0].removeChild(document.getElementsByClassName("tips")[0]);
                    this.tw('获取授权成功', 2000)
                } else {
                    if (document.getElementsByClassName("tips")[0]) document.getElementsByClassName("main")[0].removeChild(document.getElementsByClassName("tips")[0]);
                    this.tw(res.data.msg, 2000)
                }
            })
        },
    },
    mounted() {
        this.getNum()
    },
}
</script>

<style scoped>
.main {
    width: 100%;
    height: 100%;
    background: #000;
    position: relative;
    padding-top: 5%;
    box-sizing: border-box;
}

.ts {
    font-size: 15px;
    color: #fff;
}

.del {
    display: block;
    color: #409eff;
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 14px;
    cursor: pointer;
}

.img {
    width: 1071px;
    height: 684px;
    display: flex;
    margin: 0 auto;
    box-sizing: border-box;
}

.utw {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.utw-box {
    width: 580px;
    min-height: 300px;
    background-color: #fff;
    border-radius: 4px;
    padding: 10px;
    box-sizing: border-box;
    text-align: left;
    position: relative;
}

.utw-info {
    display: block;
    width: 100%;
    text-align: left;
    font-size: 14px;
    color: #aaa;
    margin-bottom: 20px;
    padding-left: 10px;
}

.utw-box .title {
    display: block;
    width: 100%;
    text-align: left;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
}

.utw-box .form {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.utw-box .form .label {
    display: block;
    width: 100px;
    text-align: right;
    margin-right: 10px;
    font-size: 14px;
}

.utw .form input {
    display: block;
    width: 300px;
    height: 40px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    padding: 0 10px;
    box-sizing: border-box;
}

.utw .form input::-webkit-input-placeholder {
    color: #c4c4c4;
}

.utw .form input:focus {
    outline: none;
    border-color: #409eff;
}

.btn {
    /* elementUI样式按钮 */
    display: inline-block;
    padding: 12px 20px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    transition: .1s;
    text-align: center;
    box-sizing: border-box;
    margin-left: 10px;
}

.btn:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
}

.filelist {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
}

.filelist .file-item {
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    height: 56px;
    width: calc(100% - 180px);
    margin-left: 100px;
    box-sizing: border-box;
}

.filelist .info {
    color: #185ed1;
    display: block;
    margin-left: 62px;
    cursor: pointer;
}

.filelist .uuid {
    display: clock;
}

.filelist .name {
    display: block;
    width: 80px;
    text-align: left;
}

.finduserbox {
    width: 200px;
    height: 48px;
    border-radius: 4px;
    border: 1px solid #fff;
    padding: 5px 10px;
    box-sizing: border-box;
    color: #fff;
    position: fixed;
    top: 10px;
    right: 10px;
    line-height: 38px;
    font-size: 14px;
    cursor: pointer;
}
</style>