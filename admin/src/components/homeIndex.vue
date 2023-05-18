<template>
    <div class="main">
        <div class="head">
            <div class="head-block" style="background-color: #39da87;">
                <p>生死簿总数</p>
                <span>{{ statistics.lifebook_count }}</span>
            </div>
            <div class="head-block" style="background-color: #4680f2;">
                <p>待勾魂数量</p>
                <span>{{ statistics.enchant }}</span>
            </div>
            <div class="head-block" style="background-color: #082f44;">
                <p>今日入府数</p>
                <span>{{ statistics.today_count }}</span>
            </div>
            <div class="head-block" style="background-color: #f56833;">
                <p>地狱受刑数</p>
                <span>{{ statistics.punished }}</span>
            </div>
        </div>
        <div class="box">
            <div class="tools">
                <p class="tools-title">常用功能导航</p>
                <div class="toolsmain">
                    <div class="tools-item" @click="uigo('/lifebook/data')">
                        <img src="../../images/u200.png" alt="">
                        <span>生死簿</span>
                    </div>
                    <div class="tools-item">
                        <img src="../../images/u185.png" alt="">
                        <span>加功德</span>
                    </div>
                    <div class="tools-item">
                        <img src="../../images/u198.png" alt="">
                        <span>汇款</span>
                    </div>
                    <div class="tools-item">
                        <img src="../../images/u201.png" alt="">
                        <span>作业流程</span>
                    </div>
                    <div class="tools-item">
                        <img src="../../images/u199.png" alt="">
                        <span>十殿</span>
                    </div>
                    <div class="tools-item">
                        <img src="../../images/u201.png" alt="">
                        <span>信息修改</span>
                    </div>
                    <div class="tools-item" @click="uigo('/lifebook/dataAdd')">
                        <img src="../../images/u200.png" alt="">
                        <span>生死同步</span>
                    </div>
                    <div class="tools-item" @click="filebookShow = true">
                        <img src="../../images/card.png" alt="">
                        <span>命书</span>
                    </div>
                    <div class="tools-item">
                        <img src="../../images/pan.png" alt="">
                        <span>审判书</span>
                    </div>
                    <div class="tools-item" @click="sub_lun_show">
                        <img src="../../images/zhuan.png" alt="">
                        <span>轮回盘</span>
                    </div>
                    <div class="tools-item" @click="back()">
                        <img src="../../images/back.png" alt="">
                        <span>退出</span>
                    </div>
                </div>
            </div>
            <div class="box-number">
                <div id="getReincarnationCount" style="width: 528px; height: 350px;"></div>
            </div>
        </div>
        <div class="box">
            <div class="box-item" style="margin-right: 10px;">
                <div id="getDeathCount" style="width: 100%; height: 300px;"></div>
            </div>
            <div class="box-item" style="margin-left: 10px;">
                <div id="getPunishedCount" style="width: 100%; height: 300px;"></div>
            </div>
        </div>
        <el-dialog title="请选择生死簿记录" :visible.sync="filebookShow" width="580px" style="text-align: left;">
            <el-form label-width="50px">
                <el-form-item label="uuid">
                    <el-input placeholder="请输入uuid搜索" style="width:250px" v-model="filebookuuid"></el-input>
                    <el-button type="primary" style="margin-left:22px;" @click="querySearchAsync">搜索</el-button>
                </el-form-item>
            </el-form>
            <div class="filelist">
                <div class="file-item" v-for="(item, index) in filebook" :key="index">
                    <span class="name">{{ item.name }}</span>
                    <span class="uuid">{{ item.uuid }}</span>
                    <span class="info" @click="handleSelect(item)">查看命图</span>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" plain @click="filebookShow = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible" width="1379.2px" title="生死簿">
            <img :src="imgurl" alt="" class="canvas">
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="drow()">下载</el-button>
            </span>
        </el-dialog>
        <el-dialog title="轮回盘" :visible.sync="lun_show" width="650px" style="text-align: left;">
            <div style="width: 100%;height: 775px;">
                <router-view name="default"></router-view>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    data() {
        return {
            statistics: {},
            getReincarnationCount: [],
            getDeathCount: [],
            filebookShow: false,
            filebookuuid: '',
            filebook: [],
            dialogVisible: false,
            inner: '',
            imgurl: '',
            lun_show: false
        }
    },

    created() {

        this.$router.push('/index/samsara/selection', () => { }, () => { })
        this.$http.get('admin/statistics').then(res => {
            this.statistics = res.data.data
        })
        //获取轮回变化
        this.$http.get('/admin/getReincarnationCount').then(res => {
            this.getReincarnationCount = res.data.data
            var myChart = echarts.init(document.getElementById('getReincarnationCount'));
            var option;
            let rechargeList = res.data.data
            let arr = [];
            let arr1 = [];
            rechargeList.forEach(item => {
                arr.push(item.date)
                arr1.push(item.count)
            })

            option = {
                title: {
                    show: true,
                    text: '进入轮回数量变化',
                },
                color: ['#fda150'],
                xAxis: { type: 'category', data: arr },
                yAxis: { type: 'value' },
                series: [
                    {
                        data: arr1,
                        type: 'line',
                        name: '轮回数量',
                        smooth: true,
                        label: { show: true, position: 'top', textStyle: { fontSize: 16 } },
                        lineStyle: { normal: { width: 6 } }
                    }
                ]
            };
            option && myChart.setOption(option);
        })
        this.$http.get('admin/getDeathCount').then(res => {
            console.log(res);
            this.getReincarnationCount = res.data.data
            var myChart = echarts.init(document.getElementById('getDeathCount'));
            var option;
            let rechargeList = res.data.data
            let arr = [];
            let arr1 = [];
            rechargeList.forEach(item => {
                arr.push(item.date)
                arr1.push(item.count)
            })

            option = {
                title: {
                    show: true,
                    text: '死亡人数变化',
                },
                color: ['#fda150'],
                xAxis: { type: 'category', data: arr },
                yAxis: { type: 'value' },
                series: [
                    {
                        data: arr1,
                        type: 'line',
                        name: '死亡人数变化',
                        smooth: true,
                        label: { show: true, position: 'top', textStyle: { fontSize: 16 } },
                        lineStyle: { normal: { width: 6 } }
                    }
                ]
            };
            option && myChart.setOption(option);
        })
        this.$http.get('admin/getPunishedCount').then(res => {
            this.getReincarnationCount = res.data.data
            var myChart = echarts.init(document.getElementById('getPunishedCount'));
            var option;
            let rechargeList = res.data.data
            let arr = [];
            let arr1 = [];
            rechargeList.forEach(item => {
                arr.push(item.date)
                arr1.push(item.count)
            })

            option = {
                title: {
                    show: true,
                    text: '进入地狱数量变化',
                },
                color: ['#fda150'],
                xAxis: { type: 'category', data: arr },
                yAxis: { type: 'value' },
                series: [
                    {
                        data: arr1,
                        type: 'line',
                        name: '地狱数量变化',
                        smooth: true,
                        label: { show: true, position: 'top', textStyle: { fontSize: 16 } },
                        lineStyle: { normal: { width: 6 } }
                    }
                ]
            };
            option && myChart.setOption(option);
        })
    },
    methods: {
        back() {
            this.$confirm('确认退出登录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                localStorage.setItem('adminName', '')
                localStorage.setItem('tokenStartTime', '')
                localStorage.setItem('menu', '')
                this.$router.push('/login')
            }).catch(() => {
            });
        },
        sub_lun_show() {
            this.lun_show = true
        },
        uigo(path) {
            this.$router.push(path)
        },
        handleSelect(item) {
            let a = item
            let inner = `${a.name}，身份号${a.uuid}，于${a.birthday}出生于${a.birthplace}，生辰八字为${a.year}，于${a.deathday}在${a.deathplace}因${a.reason}${a.type == 0 ? '自然死亡' : '意外死亡'}离世入府，计寿元${a.longevity}年。
            命中带财${a.money}阴财${a.yinmoney}，所积阳德${a.yang}阴德${a.yin}，${a.marriage}，有${a.child}个子女。${a.event}。${a.description}，${a.name}${a.characterinfo}。死后${a.afterlife}，判得赏罚${a.reward}，
            现在${a.status == 0 ? '还未出世。' : a.status == 1 ? '在世生活。' : a.status == 2 ? '魂归地府' : a.status == 3 ? '已进入轮回。' : '已打入地狱受刑。'}`
            this.inner = inner
            const loading = this.$loading({
                lock: true,
                text: '正在生成图片...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$http.post('/api/lifebook/export', {
                inner: this.inner
            }, { responseType: 'blob' }).then((response) => {
                this.dialogVisible = true
                loading.close();
                const myBlob = new window.Blob([response.data], { type: 'image/png' })
                console.log(myBlob)
                const qrUrl = window.URL.createObjectURL(myBlob)
                this.imgurl = qrUrl
            }).catch((err) => {
                console.log(err);
                loading.close();
                this.$message({
                    type: 'error',
                    message: '生成失败'
                })
            })
        },
        querySearchAsync() {
            if (this.filebookuuid == '') return this.$message.error('请输入完整')
            let search = this.filebookuuid.toLocaleUpperCase()
            this.$http.get('admin/lifeBookSearch?uuid=' + search).then(res => {
                if (res.data.data.length > 0) {
                    this.filebook = res.data.data
                } else {
                    this.$message.error('暂无数据')
                }
            })
        },
        drow() {
            const loading = this.$loading({
                lock: true,
                text: '正在生成图片...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            const imgElement = document.querySelector('.canvas');
            const link = document.createElement('a');
            link.download = this.filebookuuid + '.png';
            fetch(imgElement.src)
                .then((response) => response.blob())
                .then((blob) => {
                    const imageURL = URL.createObjectURL(blob);
                    link.href = imageURL;
                    link.click();
                    loading.close();
                    URL.revokeObjectURL(imageURL);
                })
                .catch((error) => {
                    loading.close();
                    console.error('Error:', error);
                });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
* {
    box-sizing: border-box;
}

.filelist {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;

    .file-item {
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        align-items: center;
        height: 56px;
        width: calc(100% - 180px);
        margin-left: 100px;
        box-sizing: border-box;

        .info {
            color: #185ed1;
            display: block;
            margin-left: 62px;
            cursor: pointer;
        }

        .uuid {
            display: clock;
        }

        .name {
            display: block;
            width: 80px;
            text-align: left;
        }
    }
}

.main {
    width: calc(100% - 15px);
    min-height: 100%;
    height: auto;
    background: #fff;
    padding: 15px;
    box-sizing: border-box;

    .head {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 25px;

        .head-block {
            width: 23%;
            height: 120px;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 0 5px #ccc;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            p {
                font-size: 14px;
                color: #ebe9e9;
            }

            span {
                font-size: 24px;
                color: #fff;
            }
        }
    }

    .box {
        width: 100%;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .tools-title {
            display: block;
            width: 100%;
            font-size: 18px;
            font-weight: bold;
            color: #464646;
            margin: 0;
            text-align: left;
        }

        .tools {
            width: calc(60% - 10px);
            height: 350px;
            // border: 1px solid #e9e7e7;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            padding: 10px;

            .toolsmain {
                width: 100%;
                height: calc(100% - 65px);
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                grid-gap: 10px;
                border-radius: 5px;
                margin-top: 25px;
            }


            .tools-item {
                width: 100%;
                height: 30%;
                // border: 1px solid #dbd7d7;
                min-height: 90px;
                padding-top: 10px;
                min-width: 90px;
                cursor: pointer;

                img {
                    width: 45px;
                    height: 45px;
                    display: block;
                    margin: 5px auto;
                    padding: 10px;
                    border: 1px solid #dbd7d7;
                    box-sizing: border-box;
                    border-radius: 100%;
                }

                span {
                    display: block;
                    text-align: center;
                    width: 100%;
                    font-size: 14px;
                }
            }
        }

        .box-number {
            width: calc(40% - 10px);
            height: 360px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
            margin-left: 20px;
            border-radius: 5px;
            padding-left: 10px;
            padding-top: 10px;
        }

        .box-item {
            width: calc(50% - 10px);
            height: 310px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
            border-radius: 5px;
            padding-left: 10px;
            padding-top: 10px;
        }
    }
}
</style>
