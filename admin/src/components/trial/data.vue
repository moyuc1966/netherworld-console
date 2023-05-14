<template>
    <div class="main">
        <el-card class="box-card">
            <div class="tableHead">
                <el-input style="width: 300px" :maxlength="25" show-word-limit clear="searchInput" clearable
                    placeholder="标题搜索" prefix-icon="el-icon-search" v-model="search">
                </el-input>
                <el-button class="searchButton" size="primary" plain @click="searchBind">搜索</el-button>
                <el-button v-if="isyuan" class="yuan" size="primary" plain @click="yuan">原数据
                </el-button>
            </div>
            <!-- 表格 -->
            <el-table :row-style="{ height: '55px' }" id="out-table" :data="list" style="width: 100%;height: 700px;"
                height="height" size="mini" :fit="true">
                <el-table-column fixed prop="uuid" label="审判ID" width="200" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column fixed prop="create_time" label="审判时间" width="150" align="left" show-overflow-tooltip>
                </el-table-column>
                <el-table-column fixed prop="title" label="标题" width="180" align="left" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="record" label="记录内容" min-width="280" align="left" show-overflow-tooltip>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-s-order" circle size="mini"
                            @click="info(scope.row.uuid)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 12, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="count">
            </el-pagination>
        </el-card>
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
            cardShow: false,
            editShow: false,
            status: 0
        }
    },
    activated() {
        this.$http.get(`/admin/getEnchanterList?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
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

        // 分页，页数改变时触发
        handleCurrentChange(val) {
            this.currentPage = val
            this.$http.get(`admin/getJudgementList?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
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
            this.$http.get(`admin/getJudgementList?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
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
            this.$http.get(`admin/getJudgementList?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
                loading.close()
                if (res.data.code == 200) {
                    this.list = res.data.data;
                    this.count = res.data.count;
                    loading.close()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        // 搜索功能
        searchBind() {
            if (this.search === '') return this.$message.error('请输入搜索内容')
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            this.$http.get(`admin/getJudgementList?title=${this.search}`).then(res => {
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
            this.$http.get(`admin/getJudgementList?page=1&limit=15`).then(res => {
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
        info(id) {
            localStorage.setItem('menu', '/lifebook/data')
            this.$router.push({
                path: '/trial/info',
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