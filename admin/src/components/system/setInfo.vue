<template>
    <div class="main">
        <span class="title">修改账号信息</span>
        <el-alert title="以下操作都需要重新登录，请确认记得当前登录密码或新修改的密码" type="info" show-icon
            style="width: 600px; line-height: 40px; margin-bottom: 30px;"></el-alert>
        <el-form label-width="90px">
            <el-form-item label="修改昵称">
                <el-input v-model="form.nickname" placeholder="请输入新的昵称" style="width: 300px;"></el-input>
                <el-button type="primary" @click="updateAccount" style="margin-left: 22px;">立即修改</el-button>
            </el-form-item>
            <div class="setPass">
                <span class="ptit">修改密码</span>
                <el-form-item label="当前密码">
                    <el-input v-model="form.oldpassword" type="password" placeholder="请输入当前密码"
                        style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="新的密码">
                    <el-input v-model="form.password" type="password" placeholder="请输入新的密码"
                        style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="重复新密码">
                    <el-input v-model="form.password_confirmation" type="password" placeholder="请再次输入新的密码"
                        style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item style="text-align: right; padding-right: 8px;">
                    <el-button type="primary" @click="updateAccountPassword">立即修改</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                nickname: '',
                password: '',
                oldpassword: '',
                password_confirmation: ''
            }
        }
    },
    methods: {
        updateAccount() {
            if (this.form.nickname == '') {
                this.$message.error('请输入新的昵称');
                return;
            }
            this.$confirm('修改账号之后需要重新登录，是否确认修改并且记得当前登录密码?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.put('admin/admin/nickname', this.form).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('修改成功');
                        localStorage.setItem('adminName', '')
                        localStorage.setItem('tokenStartTime', '')
                        localStorage.setItem('menu', '')
                        this.$router.push('/login')
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消修改'
                });
            });

        },
        updateAccountPassword() {
            if (this.form.oldpassword == '' || this.form.password == '' || this.form.password_confirmation == '') {
                this.$message.error('请输入完整的密码信息');
                return;
            }
            if (this.form.password != this.form.password_confirmation) {
                this.$message.error('两次输入的密码不一致');
                return;
            }
            this.$confirm('修改密码之后需要重新登录，是否确认修改并且记得新密码?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    oldpass: this.form.oldpassword,
                    newpass: this.form.password,
                }
                this.$http.put('admin/admin/password', data).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('修改成功');
                        localStorage.setItem('adminName', '')
                        localStorage.setItem('tokenStartTime', '')
                        localStorage.setItem('menu', '')
                        this.$router.push('/login')
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消修改'
                });
            });

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
    background-color: #fff;
    box-sizing: border-box;
    text-align: left;
    padding: 20px;

    .ptit {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
        display: inline-block;
    }

    .title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 28px;
        display: inline-block;
    }

    .time {
        margin-left: 20px;
        color: #999;
    }

    .setPass {
        margin-top: 40px;
        border: 1px solid #eee;
        width: 440px;
        padding: 20px;
        box-sizing: border-box;
    }
}
</style>