<template>
    <div class="main">
        <span class="title">添加管理员</span>
        <el-form label-width="100px">
            <el-form-item label="管理员账号">
                <el-input v-model="info.username" placeholder="请输入管理员账号" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="管理员昵称">
                <el-input v-model="info.nickname" placeholder="请输入管理员昵称" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item style="text-align: right; padding-right: 8px; width: 400px;">
                <el-button type="primary" @click="clear()" plain>重置</el-button>
                <el-button type="primary" @click="addAdmin">立即添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            info: {
                username: '',
                nickname: '',
            }
        }
    },
    methods: {
        addAdmin() {
            if (this.info.username == '' || this.info.nickname == '') {
                this.$message({
                    message: '请填写完整信息',
                    type: 'error'
                });
                return false;
            }
            this.$http.post('admin//admin/add', this.info).then(res => {
                if (res.data.code == 200) {
                    this.$alert(res.data.msg, '操作提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.clear()
                        }
                    });
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        clear() {
            this.info.username = '';
            this.info.nickname = '';
        }
    },
    mounted() {

    },
}
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 20px;
    text-align: left;

    .title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
        display: block;
    }
}
</style>