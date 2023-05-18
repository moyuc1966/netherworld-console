<template>
    <div class="main">
        <el-card class="box-card">
            <div class="tableHead">
                <el-input style="width: 300px" :maxlength="25" show-word-limit clear="searchInput" clearable
                    placeholder="昵称搜索" prefix-icon="el-icon-search" v-model="search">
                </el-input>
                <el-button class="searchButton" size="primary" plain @click="searchBind">搜索</el-button>
                <el-button v-if="isyuan" class="yuan" size="primary" plain @click="yuan">原数据
                </el-button>
            </div>
            <!-- 表格 -->
            <el-table :row-style="{ height: '55px' }" id="out-table" :data="list" style="width: 100%;height: 700px;"
                height="height" size="mini" :fit="true">
                <el-table-column fixed prop="nickname" label="昵称" min-width="100" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="username" label="账号" min-width="160" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="username" style="color:#3799e9;" @click="copy(scope.row.username)">{{
                            scope.row.username
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed prop="role_name" label="角色" min-width="100" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-tag style="height:25px; line-height:25px;"
                            :type="scope.row.role == '1' ? 'success' : scope.row.role == '2' ? 'primary' : scope.row.role == '3' ? 'danger' : 'info'"
                            disable-transitions>{{
                                scope.row.role_name
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" min-width="150" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="update_time" label="更新时间" min-width="150" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="status" label="状态" min-width="110" align="center">
                    <template slot-scope="scope">
                        <el-switch :value="scope.row.status == 0 ? true : false" @change="change(scope.row, scope.$index)"
                            active-color="#13ce66" inactive-color="#aaa">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="380" align="left">
                    <template slot-scope="scope">
                        <el-tag type="warning" size="mini" style="margin-right: 10px;cursor: pointer;"
                            @click="resetting(scope.row, scope.$index)" effect="dark">重置密码</el-tag>
                        <el-tag type="success" size="mini" style="margin-right: 10px;cursor: pointer;" effect="dark"
                            @click="convert(scope.row, scope.$index)">设为勾魂使者</el-tag>
                        <el-tag size="mini" style="margin-right: 10px;cursor: pointer;" effect="dark"
                            @click="updateShowBind(scope.$index)">设置角色</el-tag>
                        <el-tag type="danger" @click="del(scope.$index)" size="mini"
                            style="margin-right: 10px;cursor: pointer;" effect="dark">删除</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 12, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="count">
            </el-pagination>
        </el-card>
        <el-dialog :visible.sync="convertShow" width="490px" height="257px" title="填写必要信息" style="text-align: left;">
            <el-form label-width="80px">
                <el-form-item label="性别">
                    <el-select v-model="convertInfo.gender" placeholder="请选择性别" value-key="value">
                        <el-option :label="item.lable" :value="item.value"
                            v-for="(item, index) in [{ value: 0, lable: '男' }, { value: 1, lable: '女' }]"
                            :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="convertInfo.description" placeholder="请输入描述"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="convertShow = false">关 闭</el-button>
                <el-button type="primary" @click="convertPost()">设 置</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="updateShow" width="490px" height="257px" title="设置角色" style="text-align: left;">
            <el-form label-width="80px">
                <el-form-item label="角色">
                    <el-select v-model="role" placeholder="请选择角色" value-key="value">
                        <el-option :label="item.name" :value="item.id" v-for="(item, index) in roleList"
                            :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="updateShow = false">关 闭</el-button>
                <el-button type="primary" @click="update()">设 置</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            currentPage: 1,
            count: 0,
            pageSize: 12,
            height: 670,
            search: '',
            isyuan: false,
            item: {},
            convertShow: false,
            updateShow: false,
            status: 0,
            index: 0,
            convertInfo: {
                gender: 0,
                description: ''
            },
            roleList: [],
            role: 1
        }
    },
    activated() {
        this.$http.get(`admin/admin/list?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
            if (res.data.code == 200) {
                this.list = res.data.data
            } else {
                this.$message.error(res.data.msg)
            }
        })

    },
    methods: {
        copy(uuid) {
            //复制到剪切板
            navigator.clipboard.writeText(uuid);
            this.$message({
                type: 'success',
                message: '复制成功'
            })
        },
        convert(item, index) {
            this.$confirm('是否确认设为勾魂使者?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.index = index
                this.convertShow = true

            }).catch(() => {
            });
        },
        updateShowBind(index) {
            this.role = this.list[index].role
            this.index = index
            this.updateShow = true
        },
        update() {
            this.$confirm('是否确认设置此用户角色?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('admin/role/admin', {
                    id: this.list[this.index].id,
                    role: this.role
                }).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success(res.data.msg)
                        this.updateShow = false
                        this.list[this.index].role = this.role
                        let name = ''
                        this.roleList.forEach(item => {
                            if (item.id == this.role) {
                                name = item.name
                            }
                        })
                        this.list[this.index].role_name = name
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }).catch(() => {
            });

        },
        convertPost() {
            if (this.convertInfo.description == '') return this.$message.error('请填写描述')
            this.$http.put('admin/admin/reaper', {
                id: this.list[this.index].id,
                gender: this.convertInfo.gender,
                description: this.convertInfo.description
            }).then(res => {
                if (res.data.code == 200) {
                    this.$alert(res.data.msg, '操作提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.convertShow = false
                            this.list[this.index].role = 2
                            this.list[this.index].role_name = '勾魂使者'
                        }
                    });
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        resetting(item, index) {
            this.$confirm('是否确认重置此用户密码?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('admin/admin/reset', {
                    id: item.id,
                }).then(res => {
                    if (res.data.code == 200) {
                        this.$alert(res.data.msg, '操作提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }).catch(() => {
            });
        },
        change(item, index) {
            let info = item.status == 1 ? '解封' : '禁用'
            this.$confirm(`是否确认${info}此账号?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.put('admin/admin/status', {
                    id: item.id,
                    status: item.status == 0 ? 1 : 0
                }).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success(res.data.msg)
                        this.list[index].status = item.status == 0 ? 1 : 0
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }).catch(() => {
            });
        },
        del(index) {
            this.item = this.list[index]
            // / admin / deleteEnchanter
            this.$prompt('此操作会删除重要数据，<span style="color:#a93a3a">管理员数据将不存在</span>，如确认删除，请在下方输入 “ 确认删除 ”', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /确认删除/,
                inputErrorMessage: '请确认删除',
                dangerouslyUseHTMLString: true,
                inputPlaceholder: '请输入确认删除'
            }).then(({ value }) => {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                })
                this.$http.delete('admin/admin/delete?id=' + this.list[index].id).then(res => {
                    loading.close()
                    if (res.data.code == '200') {
                        this.$message.success('删除成功')
                        this.getInfo()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });
            });
        },

        // 分页，页数改变时触发
        handleCurrentChange(val) {
            this.currentPage = val
            this.$http.get(`admin/admin/list?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
                if (res.data.code == 200) {
                    this.list = res.data.data
                    this.count = res.data.count;
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        // 分页，每页条数改变时触发
        handleSizeChange(val) {
            this.pageSize = val
            this.$http.get(`admin/admin/list?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
                if (res.data.code == 200) {
                    this.list = res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        // 初始化函数
        getInfo() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            this.$http.get(`admin/admin/list?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
                loading.close()
                if (res.data.code == 200) {
                    this.list = res.data.data;
                    this.count = res.data.count;
                    loading.close()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
            this.$http.get(`admin/role/list?page=1&limit=1000`).then(res => {
                loading.close()
                if (res.data.code == 200) {
                    let arr = res.data.data;
                    this.roleList = arr.filter(item => {
                        return item.id != 2
                    })
                    loading.close()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        // 搜索功能
        searchBind() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            this.$http.get(`admin/admin/list?nickname=${this.search}`).then(res => {
                console.log(res.data);
                loading.close()
                if (res.data.code == 200) {
                    this.list = res.data.data
                    this.count = res.data.total
                    this.isyuan = true
                    this.$message.success('搜索完成')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },

        // 切换原来的数据
        yuan() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            this.$http.get(`admin/admin/list?page=1&limit=15`).then(res => {
                loading.close()
                if (res.data.code == 200) {
                    this.list = res.data.data
                    this.count = res.data.count
                    this.isyuan = false
                } else {
                    this.$message.error(res.data.msg)
                }
            })

        },
        // 操作，跳转
        det(id) {
            localStorage.setItem('menu', '/lifebook/data')
            this.$router.push({
                path: '/lifebook/info',
                query: {
                    uuid: id
                }
            })

        },
    },
    created() {
        this.getInfo();
    }
}
</script>

<style lang="less" scoped>
.el-table /deep/ .el-icon-arrow-down:before {
    color: #000 !important;
    font-size: 20px !important;
    position: relative;
    top: 5px;
}

.uuid {
    cursor: pointer;
}

.uuid:hover {
    //下划线
    color: #0d4fbb;
}

.tableHead {
    width: 100%;

    .addButton {
        position: absolute;
        right: 126px
    }
}

.main {
    width: 100%;
    height: 100%;
    line-height: auto;

    .head {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        position: relative;
        background: #fff;

        .el-button /deep/ .el-icon-arrow-down:before {
            color: #1a7cff !important;
        }

        .el-dropdown {
            position: absolute;
            right: 20px;
        }

        .dy {
            position: absolute;
            right: 130px;
        }

        .tag {
            height: 8px;
            width: 25px;
            border-radius: 4px;
            background-color: #1a7cff;
        }

        .tagTitle {
            font-size: 14px;
            color: #000;
            margin-left: 20px;
        }

        .daoBack {
            position: absolute;
            right: 10px
        }


    }


    .el-card {
        // height: calc(100% - 60px);
        height: 100%;
        position: relative;
        // margin-top: 10px;
        box-shadow: 0px 0px 20px rgba(215, 215, 215, 1);
        overflow: auto;

        .tableHead {
            height: 60px;
            display: flex;
            align-items: center;

            /deep/ .searchInput {
                width: 300px !important;
                position: absolute;
                left: 30px;
            }

            .searchButton {
                position: absolute;
                left: 348px;
            }

            .yuan {
                position: absolute;
                left: 428px;
            }
        }

        .el-table {
            height: 100%;
        }

        .el-pagination {
            margin-top: 10px;
            display: flex;
            justify-content: flex-end;
            margin-right: 15px;
        }
    }

    .card {
        width: 450px;
        padding: 20px;
        background: #fff;
        text-align: left;
        position: relative;
        min-height: 257px;
        overflow: hidden;
        border-radius: 5px;
        overflow: hidden;
        box-sizing: border-box;
        background-image: url('../../../images/450.jpg');
        background-repeat: no-repeat;
        background-position: center;



        .card-status {
            position: absolute;
            top: 20px;
            right: 20px;
            font-family: '华文隶书 Bold', '华文隶书';
        }

        .card-head {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            text-align: left;

            .el-image {
                border-radius: 3px;
            }

            .card-info {
                margin-left: 10px;

                .card-name {
                    color: #185ed1;
                    font-weight: bold;
                    font-size: 18px;
                }

                .card-uuid {
                    display: block;
                    margin-top: 5px;
                    color: #aaa;
                }
            }
        }

        .card-dosc {
            display: block;
            line-height: 24px;
            font-size: 14px;
            margin-top: 16px;
            // margin-left: 65px;
            color: #979797;
        }
    }
}
</style>