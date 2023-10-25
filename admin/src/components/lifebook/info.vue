<template>
    <div class="human-details">
        <el-form ref="form" label-width="80px" style="width: 100%;">
            <div class="head">
                <div class="human-photo">
                    <img :src="apiUrl + human.photo" :alt="'Photo for ' + human.name">
                </div>
                <div class="human-info" style="border:none;margin-top:0;">
                    <p class="name">{{ human.name }}</p>
                    <p class="card" style="cursor: pointer;" @click="copy(human.uuid)"><strong
                            style="width:60px;">身份号:</strong>
                        <span style="border-bottom: 1px solid #3799e9; padding-bottom:2px;color: #3799e9;">{{ human.uuid
                        }}</span>
                    </p>
                </div>
                <el-button class="searchButton" size="primary" plain @click="back()">返回上一页</el-button>
                <el-button class="editButton" size="primary" plain @click="editShow()">修改</el-button>
                <el-button class="exprotButton" size="primary" plain @click="exprotButton()">生成生死簿</el-button>
                <el-button class="delButton" size="danger" plain @click="delButton()">删除数据</el-button>
            </div>
            <div class="human-info-wrapper">
                <div class="human-info column">
                    <p><strong>数据ID:</strong> {{ human.id }}</p>
                    <p><strong>性别:</strong> {{ human.gender == 0 ? '男' : '女' }}</p>
                    <p><strong>出生日期:</strong> {{ human.birthday }}</p>
                    <p><strong>出生地址:</strong> {{ human.birthplace }}</p>
                    <p><strong>死亡日期:</strong> {{ human.deathday }}</p>
                    <p><strong>死亡地址:</strong> {{ human.deathplace }}</p>
                    <p><strong>寿元:</strong> {{ human.longevity }}岁</p>
                    <p><strong>死亡类型:</strong> {{ human.type == 0 ? '自然死亡' : '意外死亡' }}</p>
                    <p><strong>死因:</strong> {{ human.reason }}</p>
                    <p><strong>创建时间:</strong> {{ human.create_time }}</p>
                </div>
                <div class="human-info column">
                    <p><strong>状态:</strong> {{ human.state == '0' ? "未出生" : human.state == '1' ? "在世" : human.state == '2' ?
                        "在地府"
                        : human.state == '3' ? "轮回中" : "受刑中" }}</p>
                    <p><strong>命中财数:</strong> {{ human.money }} </p>
                    <p><strong>阴财:</strong> {{ human.yinmoney }} </p>
                    <p><strong>阳德:</strong> {{ human.yang }}</p>
                    <p><strong>阴德:</strong> {{ human.yin }}</p>
                    <p><strong>婚姻情况:</strong> {{ human.marriage }}</p>
                    <p><strong>子女数量:</strong> {{ human.child }}个</p>
                </div>
                <div class="human-info column">
                    <p><strong>人生大事:</strong> {{ human.event || '暂无' }}</p>
                    <p><strong>属性描述:</strong> {{ human.attribute || '暂无' }}</p>
                    <p><strong>人生描述:</strong> {{ human.description || '暂无' }}</p>
                    <p><strong>人物描述:</strong> {{ human.characterinfo || '暂无' }}</p>
                    <p><strong>轮回情况:</strong> {{ human.reincarnation || '暂无' }}</p>
                    <p><strong>受刑情况:</strong> {{ human.punishment || '暂无' }}</p>
                    <p><strong>死后情况:</strong> {{ human.afterlife || '暂无' }}</p>

                </div>
            </div>
        </el-form>

        <el-dialog :visible.sync="dialogVisible" width="1379.2px" title="生死簿">
            <img :src="imgurl" alt="" class="canvas">
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="drow()">下载</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            human: {},
            dis: true,
            dialogVisible: false,
            inner: '',
            imgurl: '',
        }
    },
    methods: {
        back() {
            //返回上一页
            this.$router.go(-1);
        },
        editShow() {
            //跳转到编辑页面
            this.$router.push({
                path: '/lifebook/edit',
                query: {
                    uuid: this.human.uuid
                }
            })
        },
        exprotButton() {
            if (this.imgurl != '') {
                this.dialogVisible = true
                return
            }
            //开始生成图片
            let a = this.human
            let inner = `${a.name}，身份号${a.uuid}，于${a.birthday}出生于${a.birthplace}，生辰八字为${a.year}，于${a.deathday}在${a.deathplace}因${a.reason}${a.type == 0 ? '自然死亡' : '意外死亡'}离世入府，计寿元${a.longevity}年。
            命中带财${a.money}阴财${a.yinmoney}，所积阳德${a.yang}阴德${a.yin}，${a.marriage}，有${a.child}个子女。${a.event}。${a.description}，${a.name}${a.characterinfo}。死后${a.afterlife}，判得赏罚${a.reward}，
            现在${a.status == 0 ? '还未出世。' : a.status == 1 ? '在世生活。' : a.status == 2 ? '魂归地府' : a.status == 3 ? '已进入轮回。' : '已打入地狱受刑。'}`
            this.inner = inner
            const loading = this.$loading({
                lock: true,
                text: '正在生成图片，一般10秒内完成...',
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
        copy(uuid) {
            //复制到剪切板
            navigator.clipboard.writeText(uuid);
            this.$message({
                type: 'success',
                message: '复制成功'
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
            link.download = this.human.name + '.png';
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
                    console.error('Error:', error);
                });
        },
        delButton() {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                })
                this.$http.delete('admin/lifeBookDelete?id=' + this.human.id).then(res => {
                    loading.close()
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.$router.go(-1);
                    } else {
                        loading.close()
                        this.$message.error(res.data.msg)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
    mounted() {
        this.uuid = this.$route.query.uuid;
        this.$http.get('admin/lifeBookSearch?uuid=' + this.uuid)
            .then((response) => {
                this.human = response.data.data[0];
            })
            .catch((err) => {
                this.$message({
                    type: 'error',
                    message: '出现错误'
                })
            })
    }
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.imgbox {
    /* width: 223.2px;
    height: 142.5px; */
    width: 1339.2px;
    height: 855px;
    background-image: url(../../../images/lifebook_bg.png);
    background-size: 100% 100%;
    padding: 30px 60px;
    box-sizing: border-box;
    padding-bottom: 63px;
}

.canvas {
    width: 1339.2px;
    height: 855px;
}

.inner {
    font-family: '华文隶书 Bold', '华文隶书';
    font-weight: 700;
    font-style: normal;
    font-size: 28px;
    color: rgba(0, 0, 0, 0.627450980392157);
    line-height: 45px;
    writing-mode: vertical-rl;
    display: block;
    width: 100%;
    height: 100%;
    text-align: right;
    line-height: 53px;
    text-orientation: mixed;
}

.human-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    width: 100%;
    min-height: 100%;
    overflow: auto;
    padding: 20px;
}

strong {
    display: inline-block;
    width: 83px;
}

.human-photo {
    width: 60px;
    height: 60px;
    border: 1px solid #ccc;
    border-radius: 50%;
    overflow: hidden;
}

.head {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding-bottom: 20px;
    position: relative;
    align-items: center;
    align-content: center;
    height: 75px;
    border-bottom: 1px solid #d8d8d8;
}

.searchButton {
    position: absolute;
    right: 20px;
}

.editButton {
    position: absolute;
    right: 160px;
}

.exprotButton {
    position: absolute;
    right: 260px;
}

.delButton {
    position: absolute;
    right: 410px;
}

.human-info {
    margin-left: 10px;
    margin-top: 30px;
    border: 1px solid #e1e1e1;
    border-top: 40px solid #e2e2e2;
    padding-left: 10px;
    box-sizing: border-box;
    padding-bottom: 20px;
    line-height: 27px;
}

.name {
    display: block;
    font-size: 15px;
    font-weight: bold;
    margin: 0;
}

.card {
    display: block;
    font-size: 15px;
    font-weight: bold;
    margin: 0;
    color: #999;
    margin-top: 5px;
}

.human-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.human-info-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
}

.column {
    flex: 0 0 calc(33.333% - 20px);
    margin-bottom: 20px;
}

.human-info {
    text-align: left;
}
</style>