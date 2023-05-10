<template>
    <div class="main">
        <div class="loginBox">
            <div class="title">
                <img src="../../images/u43.png" class="png" />
                <span class="xt_title">地府管理系统</span>
            </div>
            <el-form class="form" :rules="rules" ref="loginForm" :model="user">
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" placeholder="请输入登录账号" v-model="user.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input show-password prefix-icon="el-icon-warning-outline" placeholder="请输入密码"
                        v-model="user.password">
                    </el-input>
                </el-form-item>
                <span class="reg" @click="reg">注册账号</span>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
            <span class="info">此系统由墨羽晨开发-2023</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
            rules: {
                username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        }
    },
    methods: {
        reg() {
            this.$alert('注册请联系管理员', '提示', {
                confirmButtonText: '确定'
            });
        },
        login() {
            this.$refs.loginForm.validate(async (valid) => {
                if (!valid) return
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                })
                const { data: res } = await this.$http.post('api/login', {
                    username: this.user.username,
                    password: this.user.password,
                })
                loading.close()
                if (res.code == 200) {
                    this.$message.success('登录成功')
                    //获取当前面时间戳
                    var timestamp = Math.round(new Date().getTime() / 1000).toString()
                    localStorage.setItem('tokenStartTime', timestamp)
                    localStorage.setItem('adminToken', 'Bearer ' + res.token)
                    localStorage.setItem('adminName', res.adminName)
                    this.$router.push('/home')
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
    },
}
</script>

<style lang="less" scoped>
.info {
    display: block;
    text-align: center;
    width: 100%;
    font-size: 12px;
    color: #8d8d8d;
    position: absolute;
    bottom: 12px;
    left: 0;
}

.main {
    width: 100%;
    height: 100%;
    background: url('../../images/index_bg.jpeg') no-repeat;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0px;
    right: 0;

    .loginBox {
        background-image: url('../../images/u1.png');
        height: 550px;
        width: 480px;
        padding: 10px 20px;
        border: 1px solid #f2f2f2;
        background-position: left top;
        background-repeat: no-repeat;
        background-attachment: fixed;
        box-sizing: border-box;
        position: relative;
        top: -20px;
        background-size: cover;
        border-radius: 10px;
        box-shadow: 2px 2px 2px #ccc;

        .reg {
            display: block;
            width: 100%;
            margin: 12px auto;
            font-size: 13px;
            color: #3b86ff;
            text-align: right;
            cursor: pointer;
        }

        .title {
            width: 100%;
            margin-top: 30px;
            display: flex;
            justify-content: center;
            align-content: center;

            .png {
                height: 40px;
                width: 40px;
                display: block;
                margin-right: 10px;
            }

            .xt_title {
                font-family: '华文隶书 Bold', '华文隶书';
                font-weight: 700;
                font-style: normal;
                font-size: 28px;
                color: rgba(0, 0, 0, 0.627450980392157);
                line-height: 45px;
            }
        }

        .form {
            margin: 0 auto;
            margin-top: 30px;
            width: 80%;
        }

        .el-button {
            width: 100%;
            margin-top: 30px;
        }


    }
}
</style>