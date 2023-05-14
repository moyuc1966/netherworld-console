<template>
    <div class="main">
        <el-card class="box-card">
            <div class="tableHead">
                <el-input style="width: 300px" :maxlength="25" show-word-limit clear="searchInput" clearable
                    placeholder="姓名搜索" prefix-icon="el-icon-search" v-model="search">
                </el-input>
                <el-button class="searchButton" size="primary" plain @click="searchBind">搜索</el-button>
                <el-button v-if="isyuan" class="yuan" size="primary" plain @click="yuan">原数据
                </el-button>
            </div>
            <!-- 表格 -->
            <el-table :row-style="{ height: '55px' }" id="out-table" :data="list" style="width: 100%;height: 700px;"
                height="height" size="mini" :fit="true">
                <el-table-column fixed prop="name" label="姓名" min-width="100" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="photo" label="照片" min-width="60" align="center">
                    <template slot-scope="scope">
                        <el-image
                            style="width: 40px;top:3px; height: 40px;border:1px solid #eee; padding:1px;border-radius: 3px;"
                            :src="apiUrl + scope.row.photo" :preview-src-list="[apiUrl + list[scope.$index].photo]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="uuid" label="身份号" min-width="160" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="uuid" style="color:#3799e9;" @click="copy(scope.row.uuid)">{{ scope.row.uuid
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="year" label="八字" min-width="150" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="birthday" label="出生日期" min-width="140" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="deathday" label="死亡日期" min-width="140" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="gender" label="性别" min-width="90" align="center" :sortable="true">
                    <template slot-scope="scope">
                        <el-tag style="height:25px; line-height:25px;"
                            :type="scope.row.gender == '0' ? 'primary' : 'danger'" disable-transitions>{{
                                scope.row.gender == '0' ? "男" : "女"
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="money" label="命中财数" min-width="90" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="yinmoney" label="阴财" min-width="90" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="status" label="当前" min-width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag style="height:25px; line-height:25px;"
                            :type="scope.row.status == '0' ? 'warning' : scope.row.status == '1' ? 'success' : scope.row.status == '2' ? 'primary' : scope.row.status == '3' ? 'info' : 'danger'"
                            disable-transitions>{{
                                scope.row.status == '0' ? "未出生" : scope.row.status == '1' ? "在世" : scope.row.status == '2' ?
                                    "在地府"
                                    : scope.row.status == '3' ? "轮回中" : "受刑中"
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="yang" label="阳德" min-width="90" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="yin" label="阴德" min-width="90" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="type" label="死亡类型" min-width="90" align="center">
                    <template slot-scope="scope">
                        <el-tag style="height:25px; line-height:25px;" :type="scope.row.type == '0' ? 'primary' : 'danger'"
                            disable-transitions>{{
                                scope.row.type == '0' ? "自然死亡" : "意外死亡"
                            }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="child" label="后代数" min-width="90" align="center" :sortable="true"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.child }}个
                    </template>
                </el-table-column>
                <el-table-column prop="longevity" label="寿元" min-width="80" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="reason" label="死因" min-width="100" align="center" show-overflow-tooltip>
                </el-table-column>

                <el-table-column fixed="right" label="操作" min-width="190" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="det(scope.row.uuid)" size="mini">详情</el-button>
                        <el-button type="danger" size="mini" @click="enchanter(scope.$index)">完成勾魂</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 12, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="count">
            </el-pagination>
        </el-card>
        <el-dialog style="text-align: left;" :visible.sync="show" width="550px"
            :title="list.length > 0 ? '完成' + list[index].name + '的勾魂' : '勾魂'">
            <el-form label-width="115px" style="text-align: left;">
                <el-form-item label="是否提前勾魂">
                    <el-select v-model="set" placeholder="是否提前勾魂" value-key="value">
                        <el-option :label="item.lable" :value="item.value"
                            v-for="(item, index) in [{ value: 0, lable: '否' }, { value: 1, lable: '提前勾魂' }]"
                            :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="show = false">取 消</el-button>
                <el-button type="primary" @click="update()">完成勾魂</el-button>
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
            show: false,
            index: 0,
            set: 0
        }
    },
    activated() {
        this.$http.get(`admin/getEnchantData?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
            if (res.data.code == 200) {
                this.list = res.data.data
            } else {
                this.$message.error(res.data.msg)
            }
        })

    },
    methods: {
        // 字段筛选
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] == value;
        },
        copy(uuid) {
            //复制到剪切板
            navigator.clipboard.writeText(uuid);
            this.$message({
                type: 'success',
                message: '复制成功'
            })
        },
        enchanter(index) {
            this.index = index
            let date = this.list[this.index].deathday
            let todayDate = new Date().setHours(0, 0, 0, 0);
            let paramsDate = new Date(date).setHours(0, 0, 0, 0);
            let isToday = (todayDate === paramsDate);
            if (!isToday) this.set = 1
            this.show = true
        },
        update() {

            if (this.set == 1) {
                this.$prompt('是否确认提前勾魂，如已确认，请在下方输入 “ 提前勾魂 ”', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /提前勾魂/,
                    inputErrorMessage: '请确认提前勾魂',
                    dangerouslyUseHTMLString: true,
                    inputPlaceholder: '请输入提前勾魂'
                }).then(({ value }) => {
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)',
                    })
                    let data = {
                        id: this.list[this.index].id,
                        set: 1,
                    }
                    this.$http.put('admin/handleEnchanter', data).then(res => {
                        loading.close()
                        if (res.data.code == '200') {
                            this.$message.success('勾魂完成')
                            this.getInfo()
                            this.show = false
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            } else {
                this.$confirm('是否确认已完成勾魂', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)',
                    })
                    let data = {
                        id: this.list[this.index].id,
                        set: 1,
                    }
                    this.$http.put('admin/handleEnchanter', data).then(res => {
                        loading.close()
                        if (res.data.code == '200') {
                            this.$message.success('勾魂完成')
                            this.getInfo()
                            this.show = false
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });

            }
        },

        // 分页，页数改变时触发
        handleCurrentChange(val) {
            this.currentPage = val
            this.$http.get(`admin/getEnchantData?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
                if (res.data.code == 200) {
                    this.list = res.data.data
                    this.count = res.data.total;
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        // 分页，每页条数改变时触发
        handleSizeChange(val) {
            this.pageSize = val
            this.$http.get(`admin/getEnchantData?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
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
            this.$http.get('admin/getEnchantData?page=1&limit=12').then(res => {
                loading.close()
                if (res.data.code == 200) {
                    this.list = res.data.data;
                    this.count = res.data.total;
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
            this.$http.get(`admin/getEnchantData?name=${this.search}`).then(res => {
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
            this.$http.get(`admin/getEnchantData?page=1&limit=15`).then(res => {
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
}
</style>