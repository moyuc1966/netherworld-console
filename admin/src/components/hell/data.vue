<template>
    <div class="main">
        <el-card class="box-card">
            <div class="tableHead">
                <el-select v-model="search" placeholder="请选择所在地狱" style="width: 300px;" @change="change">
                    <el-option v-for="item in dyList" :key="item.value" :label="item.lable" :value="item.value">
                    </el-option>
                </el-select>
                <el-button class="searchButton" size="primary" plain @click="searchBind">搜索</el-button>
                <el-button v-if="isyuan" class="yuan" size="primary" plain @click="yuan">原数据
                </el-button>
                <el-button class="addButton" size="primary" plain @click="addBind">添加</el-button>
            </div>
            <!-- 表格 -->
            <el-table :row-style="{ height: '55px' }" id="out-table" :data="list" style="width: 100%;height: 700px;"
                height="height" size="mini" :fit="true">
                <el-table-column fixed prop="name" label="姓名" min-width="100" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="user_uuid" label="身份号" min-width="160" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="uuid" style="color:#3799e9;" @click="copy(scope.row.user_uuid)">{{ scope.row.user_uuid
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="gender" label="所在地狱" min-width="90" align="center" :sortable="true">
                    <template slot-scope="scope">
                        <span>{{ map[scope.row.floor] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="受刑理由" min-width="240" align="left" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span style="cursor: pointer;" @click="lookDescription(scope.row.reason)">{{
                            scope.row.reason }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="受刑时长" min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="create_time" label="判处时间" min-width="150" align="center" show-overflow-tooltip>
                </el-table-column>

                <el-table-column fixed="right" label="操作" min-width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini"
                            @click="edits(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini"
                            @click="del(scope.$index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 12, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="count">
            </el-pagination>
        </el-card>
        <!-- 修改理由 -->
        <el-dialog title="修改理由" :visible.sync="editShow" width="30%" :close-on-click-modal="false">
            <el-form :model="item" label-width="80px" class="demo-ruleForm">
                <el-form-item label="受刑理由" prop="reason">
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="edit.reason"></el-input>
                </el-form-item>
                <el-form-item label="受刑时间" prop="reason">
                    <el-input type="text" :rows="3" placeholder="请输入内容" v-model="edit.time"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editShow = false">取 消</el-button>
                <el-button type="primary" @click="editSubmit()">确 定</el-button>
            </div>
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
            searchValue: 0,
            editShow: false,
            edit: {},
            and: '',
            dyList: [{ value: '1', lable: '铁钳地狱' }, { value: '2', lable: '剪刀地狱' }
                , { value: '3', lable: '铁树地狱' }, { value: '4', lable: '孽镜地狱' }, { value: '5', lable: '蒸笼地狱' }
                , { value: '6', lable: '铜柱地狱' }, { value: '7', lable: '刀山地狱' }, { value: '8', lable: '冰山地狱' }
                , { value: '9', lable: '油锅地狱' }, { value: '10', lable: '牛坑地狱' }, { value: '11', lable: '石压地狱' }
                , { value: '12', lable: '舂臼地狱' }, { value: '13', lable: '血池地狱' }, { value: '14', lable: '枉死牢地狱' }
                , { value: '15', lable: '磔刑地狱' }, { value: '16', lable: '火山地狱' }, { value: '17', lable: '石磨地狱' }
                , { value: '18', lable: '刀锯地狱' }],
            map: { "1": "铁钳地狱", "2": "剪刀地狱", "3": "铁树地狱", "4": "孽镜地狱", "5": "蒸笼地狱", "6": "铜柱地狱", "7": "刀山地狱", "8": "冰山地狱", "9": "油锅地狱", "10": "牛坑地狱", "11": "石压地狱", "12": "舂臼地狱", "13": "血池地狱", "14": "枉死牢地狱", "15": "磔刑地狱", "16": "火山地狱", "17": "石磨地狱", "18": "刀锯地狱" }
        }
    },
    activated() {
        this.$http.get(`/admin/getEnchanterList?page=${this.currentPage}&limit=${this.pageSize}${this.and}`).then(res => {
            if (res.data.code == 200) {
                this.list = res.data.data
            } else {
                this.$message.error(res.data.msg)
            }
        })

    },
    methods: {
        addBind() {
            this.$router.push('/hell/addHellLog')
        },
        edits(item) {
            this.editShow = true
            this.edit = item
        },
        editSubmit() {
            if (this.edit.reason == '') {
                this.$message.error('请输入受刑理由')
                return
            }
            if (this.edit.time == '') {
                this.$message.error('请输入受刑时间')
                return
            }
            console.log(this.edit);
            this.$http.put('admin/hellrecordedit', {
                id: this.edit.id,
                reason: this.edit.reason,
                time: this.edit.time
            }).then(res => {
                if (res.data.code == 200) {
                    this.$message.success(res.data.msg)
                    this.editShow = false
                    this.getInfo()
                } else {
                    this.$message.error(res.data.msg)
                }
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
        lookDescription(info) {
            this.$alert(info, '详情', {
                confirmButtonText: '确定',
                callback: action => {
                }
            });
        },
        del(index) {
            this.item = this.list[index]
            // / admin / deleteEnchanter
            this.$prompt('此操作会删除重要数据，请在下方输入 “ 确认删除 ”', '提示', {
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
                this.$http.delete('/admin/hellrecorddel?id=' + this.list[index].id).then(res => {
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
            this.$http.get(`admin/hellrecordlist?page=${this.currentPage}&limit=${this.pageSize}${this.and}`).then(res => {
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
            this.$http.get(`admin/hellrecordlist?page=${this.currentPage}&limit=${this.pageSize}${this.and}`).then(res => {
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
            this.$http.get(`admin/hellrecordlist?page=${this.currentPage}&limit=${this.pageSize}${this.and}`).then(res => {
                loading.close()
                if (res.data.code == 200) {
                    this.list = res.data.data;
                    this.count = res.data.count;
                    console.log(res.data);
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        change(e) {
            this.searchValue = this.dyList[e - 1].value
        },
        // 搜索功能
        searchBind() {
            this.and = ''
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            this.$http.get(`admin/hellrecordlist?floor=${this.searchValue}`).then(res => {
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
            this.and = ''
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            this.$http.get(`admin/hellrecordlist?page=1&limit=15`).then(res => {
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
    },
    created() {
        let id = this.$route.query.id
        //如果id存在，则设置搜索条件
        if (id) {
            this.and = `&device=${id}`
        } else {
            this.and = ''
        }
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