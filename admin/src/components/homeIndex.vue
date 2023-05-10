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
                    <div class="tools-item">
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
                    <div class="tools-item">
                        <img src="../../images/u200.png" alt="">
                        <span>生死同步</span>
                    </div>
                    <div class="tools-item">
                        <img src="../../images/card.png" alt="">
                        <span>命书</span>
                    </div>
                    <div class="tools-item">
                        <img src="../../images/pan.png" alt="">
                        <span>审判书</span>
                    </div>
                    <div class="tools-item">
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
                <div id="getReincarnationCount" style="width: 100%; height: 350px;"></div>
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
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    data() {
        return {
            statistics: {},
            getReincarnationCount: [],
            getDeathCount: []
        }
    },
    created() {
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
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
* {
    box-sizing: border-box;
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
