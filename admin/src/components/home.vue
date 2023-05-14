<template>
    <el-container>
        <!-- 头部区域 -->
        <el-header>
            <div class="title">地府管理中心</div>
            <span class="time">{{ time }}</span>
            <div class="back">
                <img src="../../images/u43.png" />
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">{{ adminName }}<i class="el-icon-arrow-down el-icon--right"
                            style="color: #000"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><span @click="goBack">退出登录</span></el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <el-container>
            <!-- 侧边栏菜单 -->
            <el-aside width="240px">
                <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :unique-opened="true"
                    :router="true" :default-active="menu">
                    <el-menu-item index="/index" @click="saveMenu('/index')">
                        <i class="el-icon-s-home"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>

                    <el-submenu :index="index.toString()" v-for="(item, index) in container"
                        :key="index + container.length">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span>{{ item.name }}</span>
                        </template>
                        <el-menu-item v-for="(item, index) in item.children" :key="index" :index="item.path"
                            @click="saveMenu(item.path)">{{ item.name }}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- main区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    data() {
        return {
            adminName: '',
            menu: '',
            container: [],
            time: ''
        }
    },
    mounted() {
        this.adminName = localStorage.getItem('adminName')
    },
    created() {
        this.$http.get('admin/role').then(res => {
            this.container = res.data.data
        })
        this.menu = localStorage.getItem('menu')
        //实时获取时间到this.time
        setInterval(() => {
            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let hour = date.getHours()
            let minute = date.getMinutes()
            let second = date.getSeconds()

            this.time = `${year}年${month < 10 ? '0' + month : month}月${day < 10 ? '0' + day : day}日 ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? "0" + second : second}`
        }, 1000)

    },
    methods: {
        goBack() {
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
        saveMenu(menu) {
            localStorage.setItem('menu', menu)
            this.menu = menu
            console.log(this.menu);
        },
    },
}
</script>

<style lang="less" scoped>
/deep/.el-icon-arrow-down:before {
    color: #fff !important;
}

.el-header {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    //   line-height: 60px;
    display: flex;
    padding: 0;
    margin: 0;
    justify-content: space-between;
    padding-right: 30px;
    box-sizing: border-box;
    box-shadow: 0px 5px 5px rgb(215 215 215 / 35%) !important;

    .time {
        position: absolute;
        left: 270px;
        line-height: 60px;
    }

    .title {
        font-size: 23px;
        color: #fff;
        // background: #1a7cff;
        background: #545c64;
        width: 240px;
        height: 60px;
        line-height: 60px;
    }

    .back {
        display: flex;
        align-items: center;
        padding-right: 15px;

        img {
            width: 40px;
            height: 40px;
            border-radius: 100%;
            // background: #1a7cff;
            // border: 1px solid #ccc;
            padding: 5px;
            box-sizing: border-box;
            margin-right: 10px;
        }

        .el-dropdown-link {
            //设置鼠标样式为手指
            cursor: pointer;
        }

        .el-icon-arrow-down:before {
            color: #000 !important;
            font-size: 16px;
        }
    }
}

.el-aside {
    // background-color: #1a7cff;
    background: #545c64;
    color: #333;
    //   text-align: center;
    line-height: 200px;

    .el-menu {
        // border: 1px solid rgb(26, 124, 255);
        border: 1px solid #545c64;
        margin-top: 20px;

        .el-submenu .el-menu-item {
            padding-left: 70px !important;
        }

        i:before {
            color: #fff;
        }

        .el-icon-arrow-down:before {
            color: #fff;
            font-size: 16px;
        }
    }

    .el-menu-item:hover {
        background: #41484e !important;
    }

    .el-menu-item.is-active {
        // background: #006eff !important;
        background: #41484e !important;
    }

    .el-submenu__title:focus,
    .el-submenu__title:hover {
        // background: #006eff !important;
        background: #434950 !important;
    }

    .el-submenu /deep/ .el-submenu__title:hover {
        // background: #006eff !important;
        background: #4c5157 !important;
    }
}

.el-main {
    background-color: #f3f8ff;
    color: #333;
    text-align: center;
    margin-top: 0px;
    margin-right: 00px;
    margin-left: 00px;
}

body>.el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}

.el-container {
    height: 100%;
    overflow: auto;
}
</style>