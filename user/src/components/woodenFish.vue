<template>
    <div class="content">
        <div class="main">
            <div id="mubang" @click="clickMubang" class="mubang"></div>
            <div class="muyu" @click="clickMuyu" id="muyu"></div>
        </div>
        <div class="finduserbox" @click="findShow()">
            <span>{{ find }}</span>
        </div>

        <div class="control">
            <div class="autobox">
                <span class="auto_name">自动</span>
                <input type="checkbox" name="control" id="auto" class="auto">
            </div>
        </div>
        <!-- 音乐 -->
        <div class="music">
            <audio src="../../image/music.mp3" id="music"></audio>
        </div>
        <!-- 功德统计 -->
        <div class="count">
            <div>
                <span>今日已获得功德: </span>
                <span id="today_count" class="num">{{ todayNum }}</span>
            </div>
            <div>
                <span>本机总功德:</span>
                <span id="all_count" class="num">{{ allNum }}</span>
            </div>
        </div>
        <div id="tips">功德+1</div>
        <!-- 用户选择弹窗 -->
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

    </div>
</template>

<script>
export default {
    data() {
        return {
            info: {
                uuid: '',
                name: '',
                yang: ''
            },
            todayNum: 0,
            allNum: 0,
            find: '选择加功德的生死簿',
            findShowif: false,
            isToken: false,
            filebookuuid: '',
            filebook: [],

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
                    this.find = '加功德者：' + this.info.name
                }
            } else {
                this.isToken = false
            }
            this.findShowif = !this.findShowif
        },
        del() {
            localStorage.removeItem('token')
            localStorage.removeItem('tokenTime')
            localStorage.removeItem('info')
            this.find = '选择加功德的生死簿'
            this.isToken = false
            this.findShowif = false
            this.allNum = this.todayNum
            this.filebookuuid = ''
            this.filebook = []
            this.info = {}
            localStorage.setItem('allNum', this.allNum)
            this.tw('注销成功', 2000)
        },
        handleSearch() {
            if (document.getElementsByClassName("tips")[0]) document.getElementsByClassName("content")[0].removeChild(document.getElementsByClassName("tips")[0]);
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
                        if (document.getElementsByClassName("tips")[0]) document.getElementsByClassName("content")[0].removeChild(document.getElementsByClassName("tips")[0]);
                        this.tw('暂无数据', 2000)
                    }
                } else {
                    if (document.getElementsByClassName("tips")[0]) document.getElementsByClassName("content")[0].removeChild(document.getElementsByClassName("tips")[0]);
                    this.tw('暂无权限', 2000)
                }
            })
        },
        handleSelect(item) {
            this.info.uuid = item.uuid
            this.info.name = item.name
            this.info.yang = item.yang
            this.find = '加功德者：' + item.name
            this.findShowif = false
            this.todayNum = 0
            this.allNum = item.yang
            localStorage.setItem('info', JSON.stringify(this.info))
            localStorage.setItem("allNum", this.allNum);
            localStorage.setItem("todayNum", 0);
        },
        getToken() {
            this.tw('获取授权中...', 2000)
            this.$http.get('api/user/gettempauth').then(res => {
                if (res.data.code === 200) {
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('tokenTime', new Date().getTime())
                    this.isToken = true
                    if (document.getElementsByClassName("tips")[0]) document.getElementsByClassName("content")[0].removeChild(document.getElementsByClassName("tips")[0]);
                    this.tw('获取授权成功', 2000)
                } else {
                    this.tw(res.data.msg, 2000)
                }
            })
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
            document.getElementsByClassName("content")[0].appendChild(tips);
            setTimeout(function () {
                try {
                    document.getElementsByClassName("content")[0].removeChild(document.getElementsByClassName("tips")[0]);
                } catch (error) {
                    console.log(error);
                }
            }, time);
        },


        clickMubang() {
            document.querySelector(".mubang").className = "mubang";
            window.requestAnimationFrame(function (time) {
                window.requestAnimationFrame(function (time) {
                    document.querySelector(".mubang").className = "mubang move";
                });
            });
            setTimeout(this.playMusic, 200);
            setTimeout(this.addNum, 500);
        },
        playMusic() {
            let music = document.querySelector("#music");
            music.play();
        },
        autoPlay() {
            document.querySelector(".mubang").className = "mubang";
            window.requestAnimationFrame(function (time) {
                window.requestAnimationFrame(function (time) {
                    document.querySelector(".mubang").className = "mubang auto_move";
                });
            });
        },
        clickMuyu() {
            this.clickMubang()
        },
        getNum() {
            if (localStorage.getItem('info')) {
                this.info = JSON.parse(localStorage.getItem('info'))
                this.find = '加功德者：' + this.info.name
            }
            if (localStorage.key("todayNum")) {
                this.todayNum = +localStorage.getItem("todayNum");
            } else {
                localStorage.setItem("todayNum", 0);
            }
            if (localStorage.key("allNum")) {
                this.allNum = +localStorage.getItem("allNum");
            } else {
                localStorage.setItem("allNum", 0);
            }
        },
        addNum() {
            showtips();
            setTimeout(hiddenTips, 600);
            this.todayNum = +this.todayNum + 1;
            this.allNum = +this.allNum + 1;
            localStorage.setItem("allNum", this.allNum);
            if (this.info.uuid) {
                this.$http.post('/api/user/addmerit', {
                    "uniqueid": this.info.uuid
                }).then(res => {
                    console.log(res);
                    if (res.data.code != 200) {
                        this.tw(res.data.msg, 2000)
                    }
                })
            }

            function showtips() {
                let tips = document.querySelector("#tips");
                tips.style.visibility = "visible";
                tips.style.opacity = "1";
                tips.style.top = "50px";
            }
            function hiddenTips() {
                let tips = document.querySelector("#tips");
                tips.style.visibility = "hidden";
                tips.style.opacity = "0";
                tips.style.top = "100px";
            }
        },

    },
    mounted() {
        var auto = document.querySelector("#auto");
        let autoPlayMusic;
        let autoAddNum
        auto.addEventListener("change", () => {
            if (auto.checked) {
                this.autoPlay();
                this.addNum();
                setTimeout(() => {
                    this.playMusic();
                    autoPlayMusic = setInterval(this.playMusic, 1000);
                    autoAddNum = setInterval(this.addNum, 1000);
                }, 500);
            } else {
                clearInterval(autoPlayMusic);
                clearInterval(autoAddNum);
                document.querySelector(".mubang").className = "mubang";
            }
        });

        this.getNum();

    },
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
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

.content .tips {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #e7e7e780;
    color: #fff;
    padding: 10px 20px;
    border-radius: 4px;
    transition: all .3s;
    z-index: 1000000;
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


.content {
    width: 100%;
    height: 100%;
    background-color: black;
}

/*这一句是用来解决在安卓上的点击出现篮框问题*/
.content {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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


/*下面是解决ios上去除微信点击蓝色边框 */
a:focus,
input:focus,
p:focus,
div:focus {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-user-modify: read-write-plaintext-only;
}



.main {
    width: 300px;
    height: 300px;
    margin: 0 auto;
    position: relative;
}

/* 木鱼棒 */
.mubang {
    position: absolute;
    top: 105px;
    left: 0px;
    width: 200px;
    height: 200px;
    background: url('../../image/stick.png') no-repeat;
    background-size: contain;
    transform: rotate(-40deg);
    transform-origin: 10px 70px;
    cursor: pointer;
}

.autobox {
    width: 200px;
    display: inline-block;
    text-align: left;
    color: #aaa;
}

.move {
    animation: move 0.3s linear alternate;
}

.auto_move {
    animation: move 0.3s linear alternate infinite;
}

@keyframes move {
    0% {
        transform: rotate(-40deg);
    }

    100% {
        transform: rotate(-18deg);
    }
}

/* 木鱼 */
.muyu {
    position: absolute;
    top: 100px;
    left: 45px;
    width: 220px;
    height: 220px;
    background: url('../../image/muyu.png') no-repeat;
    transition: all 0.3s;
    cursor: pointer;
}

.muyu:active {
    transform: scale(0.9);
}

.music {
    display: none;
}

/* 自动开关 */
.control {
    width: 100%;
    margin-top: 100px;
    text-align: center;
    display: flex;
    justify-content: center;
}

.auto {
    width: 18px;
    height: 18px;
}

.auto_name {
    color: #aaa;
    font-size: 18px;
    padding-right: 12px;
    position: relative;
    top: -3px;
}

/* 计数器 */
.count {
    width: 200px;
    line-height: 40px;
    margin: 0 auto;
    margin-top: 20px;
    color: #aaa;
    font-size: 18px;
    padding-right: 12px;
}

.num {
    color: #fff;
    font-size: 26px;
    position: relative;
    top: 3px;
    left: 10px;
}

#tips {
    position: absolute;
    visibility: hidden;
    color: #aaa;
    font-size: 17px;
    margin: 0 auto;
    top: 100px;
    left: 40%;
    opacity: 0;
    transition: top 0.3s;
}
</style>