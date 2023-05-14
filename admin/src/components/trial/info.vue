<template>
    <div class="main">
        <div class="tools">
            <span class="title">{{ info.title }}</span>
            <el-button type="primary" @click="$router.go(-1)" style="right: 200px;" plain>返回上一页</el-button>
            <el-button type="primary" style="right:100px" plain @click="editShowBind">编辑</el-button>
            <!-- 删除 -->
            <el-button type="danger" style="right:0px;" plain @click="del()">删除</el-button>
        </div>
        <div class="body-top">
            <div class="frialinfo">
                <span class="item" style="color: #185ed1;"><span class="tabel">审判记录ID：</span>{{ info.uuid }}</span>
                <span class="item"><span class="tabel">审判时间：</span>{{ info.create_time }}</span>
                <span class="item"><span class="tabel">审判长：</span>{{ info.judge_name }}</span>
                <span class="item"><span class="tabel">勾魂使者：</span>{{ info.reaper_name }}</span>
            </div>

            <div class="body-bottom">
                <img :src="apiUrl + info.photo" alt="">
                <div class="body-bottom-2">
                    <span class="item"><span class="tabel">被审判人：</span>{{ info.name }}</span>
                    <span class="item"><span class="tabel">被审判人性别：</span>{{ info.gender == '0' ? '男' : '女' }}</span> <br />
                    <span class="item"><span class="tabel">被审判人身份号：</span>{{ info.user_uuid }}</span>
                    <span class="item"><span class="tabel">被审判人生辰八字：</span>{{ info.year }}</span><br />
                    <span class="item"><span class="tabel">被审判人离世时间：</span>{{ info.deathday }}</span>
                    <span class="item"><span class="tabel">被审判人出生时间：</span>{{ info.birthday }}</span><br />
                    <span class="item"><span class="tabel">被审判人出生地址：</span>{{ info.birthplace }}</span>
                    <span class="item"><span class="tabel">被审判人离世地址：</span>{{ info.deathplace }}</span><br />
                    <span class="item"><span class="tabel">被审判人死后情况：</span>{{ info.afterlife }}</span>
                    <span class="item"><span class="tabel">被审判人死亡方式：</span>{{ info.type == 0 ? '自然死亡' : '意外死亡' }}</span>
                </div>
            </div>
        </div>
        <div class="content">
            <span class="label">审判记录</span>
            <span class="content-info" v-html="info.record"></span>
        </div>
        <el-dialog title="编辑审判记录" :visible.sync="editShow" width="70%" :before-close="handleClose">
            <el-form label-width="80px">
                <el-form-item label="审判标题" style="width:800px">
                    <el-input placeholder="请输入审判标题" v-model="editinfo.title" :show-word-limit="true"
                        maxlength="200"></el-input>
                </el-form-item>
                <el-form-item>
                    <quill-editor ref="myGQuillEditor" v-model="editinfo.record" :options="editorOption" class="editor"
                        style="height:300px;">
                    </quill-editor>
                </el-form-item>
                <el-form-item style="margin-top: 105px;">
                    <el-button type="primary" @click="clear" plain>重 置</el-button>
                    <el-button type="primary" style="margin-left: 20px;" @click="post">提交修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
]
export default {
    data() {
        return {
            id: this.$route.query.uuid,
            info: {},
            editShow: false,

            editorOption: {
                modules: {
                    toolbar: toolbarOptions
                },
                theme: 'snow',
                placeholder: '请输入审判内容'
            },
            editinfo: {
                title: '',
                record: ''
            }
        }
    },
    mounted() {
        this.getInfo()
    },
    methods: {
        getInfo() {
            this.$http.get('admin/getJudgementDetail?uuid=' + this.id).then(res => {
                this.info = res.data.data
                this.editinfo.title = this.info.title
                this.editinfo.record = this.info.record
            })
        },
        del() {
            this.$confirm('此操作将永久删除该审判记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const loading = this.$loading({
                    lock: true,
                    text: '正在删除中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.$http.delete('admin/deleteJudgement?uuid=' + this.id).then(res => {
                    loading.close();
                    if (res.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.$router.go(-1)
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        clear() {
            this.editinfo = {
                title: '',
                record: ''
            }
        },
        editShowBind() {
            this.editShow = true
            this.editinfo.title = this.info.title
            this.editinfo.record = this.info.record
        },
        post() {
            if (this.editinfo.title === '' || this.editinfo.record === '') {
                this.$message({
                    type: 'error',
                    message: '请填写完整信息'
                });
                return
            }
            let data = {
                id: this.info.id,
                title: this.editinfo.title,
                record: this.editinfo.record
            }
            this.$http.put('admin/updateJudgement', data).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    this.editShow = false
                    this.info.title = this.editinfo.title
                    this.info.record = this.editinfo.record
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    });
                }
            })
        }
    }

}
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: left;
    padding: 20px;
    box-sizing: border-box;

    .tools {
        width: 100%;
        position: relative;

        .title {
            font-size: 20px;
        }

        .el-button {
            position: absolute;
            right: 0;
            top: 0;
        }
    }

    .content {
        margin-top: 12px;
        height: calc(100% - 252px);
        min-height: 220px;

        span {
            display: block;
        }

        .label {
            display: block;
            width: 100%;
            color: #333;
            font-size: 16px;
            line-height: 26px;
        }

        .content-info {
            margin-top: 5px;
            border: 1px solid #c5c5c5;
            padding: 15px;
            box-sizing: border-box;
            line-height: 26px;
            height: calc(100% - 90px);
            border-radius: 3px;
            overflow: auto;
        }
    }

    .frialinfo {
        width: 100%;
        border-bottom: 1px solid #ebebeb;
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .item {
            display: block;
            margin-right: 35px;
            font-size: 16px;
            color: #000;
        }

        .tabel {
            color: #838383;

        }
    }

    .body-bottom {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        width: 100%;
        margin-top: 10px;
        box-sizing: border-box;
        border-bottom: 1px solid #ebebeb;
        padding-bottom: 10px;
        background: #edf1f5;

        .body-bottom-2 {
            width: calc(100% - 145px);
        }

        img {
            width: 115px;
            height: 135px;
            display: block;
            margin: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        .item {
            display: inline-block;
            margin-right: 35px;
            font-size: 16px;
            color: #333;
            max-width: calc(50% - 40px);
            min-width: 30%;
            line-height: 26px;
        }

        .tabel {
            color: #409EFF;
            display: inline-block;
            width: 145px;
            font-size: 15px;

        }
    }

}
</style>