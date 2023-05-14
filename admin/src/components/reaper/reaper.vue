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
                <el-button class="addButton" size="primary" plain @click="addBind">添加</el-button>
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
                <el-table-column prop="gender" label="性别" min-width="90" align="center" :sortable="true">
                    <template slot-scope="scope">
                        <el-tag style="height:25px; line-height:25px;"
                            :type="scope.row.gender == '0' ? 'primary' : 'danger'" disable-transitions>{{
                                scope.row.gender == '0' ? "男" : "女"
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="介绍" min-width="220" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span style="cursor: pointer;" @click="lookDescription(scope.row.description)">{{
                            scope.row.description }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="当前" min-width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag style="height:25px; line-height:25px;"
                            :type="scope.row.status == '0' ? 'success' : scope.row.status == '1' ? 'primary' : 'danger'"
                            disable-transitions>{{
                                scope.row.status == '0' ? "在职" : scope.row.status == '1' ? "休息" : '离职'
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="上任时间" min-width="150" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="type" label="是否是管理员" min-width="110" align="center">
                    <template slot-scope="scope">
                        <el-tag style="height:25px; line-height:25px;" :type="scope.row.type == '0' ? 'primary' : 'danger'"
                            disable-transitions>{{
                                scope.row.role == '2' ? "否" : "管理员"
                            }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" min-width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-s-order" circle size="mini"
                            @click="card(scope.$index)"></el-button>
                        <el-button type="primary" icon="el-icon-edit" circle size="mini"
                            @click="edit(scope.$index)"></el-button>
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
        <el-dialog :visible.sync="cardShow" width="490px" height="257px">
            <div class="card" id="card">
                <div class="card-head">
                    <img :src="apiUrl + item.photo" alt=""
                        style="width: 50px;height: 50px;border:1px solid #eee; padding:1px;border-radius: 3px;">
                    <div class="card-info">
                        <span class="card-name">{{ item.name }} <i
                                :style="{ color: item.gender == '0' ? '#185ed1' : 'red' }"
                                :class="item.gender == '0' ? 'el-icon-male' : 'el-icon-female'"></i> </span>
                        <span class="card-uuid">{{ item.uuid }}</span>
                    </div>
                </div>
                <span class="card-dosc">介绍：{{ item.description }}</span>
                <span class="card-status">地府勾魂使者</span>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cardShow = false">关 闭</el-button>
                <el-button type="primary" @click="drow()">下 载</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="editShow" width="550px" title="修改勾魂使者信息">
            <el-form label-width="65px" style="text-align: left;">
                <el-form-item label="名称">
                    <el-input v-model="item.name"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="item.status" placeholder="请选择状态" value-key="value">
                        <el-option :label="item.lable" :value="item.value"
                            v-for="(item, index) in [{ value: 0, lable: '在职' }, { value: 1, lable: '休息' }, { value: 2, lable: '离职' }]"
                            :key="index"></el-option>
                    </el-select>
                    <el-button type="primary" @click="updateSet()" style="margin-left: 10px;">修改</el-button>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="item.gender" placeholder="请选择性别" value-key="value">
                        <el-option :label="item.lable" :value="item.value"
                            v-for="(item, index) in [{ value: 0, lable: '男' }, { value: 1, lable: '女' }]"
                            :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="介绍">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入介绍内容.."
                        :show-word-limit="true" maxlength="100" v-model="item.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editShow = false">取 消</el-button>
                <el-button type="primary" @click="update()">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import html2canvas from 'html2canvas';
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
        lookDescription(info) {
            this.$alert(info, '介绍', {
                confirmButtonText: '确定',
                callback: action => {
                }
            });
        },
        card(index) {
            this.item = this.list[index]
            this.cardShow = true
            this.status = this.item.status
        },
        edit(index) {
            this.item = this.list[index]
            this.editShow = true
        },
        addBind() {
            this.$router.push('/reaper/addReaper')

        },
        update() {
            for (var key in this.item) {
                if (this.item[key] === '') {
                    return this.$message.error('请填写完整信息');
                }
            }
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            let data = {
                id: this.item.id,
                name: this.item.name,
                gender: this.item.gender,
                description: this.item.description
            }
            this.$http.put('admin/updateEnchanter', data).then(res => {
                loading.close()
                if (res.data.code == '200') {
                    this.$message.success('修改成功')
                    this.editShow = false
                    this.getInfo()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        updateSet() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            let data = {
                set: 1,
                id: this.item.id,
                status: this.item.status
            }
            console.log(data);
            this.$http.put('admin/updateEnchanter', data).then(res => {
                loading.close()
                if (res.data.code == '200') {
                    this.$message.success('修改成功')
                    this.editShow = false
                    this.getInfo()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        del(index) {
            this.item = this.list[index]
            // / admin / deleteEnchanter
            this.$prompt('此操作会删除重要数据，<span style="color:#a93a3a">管理员勾魂使者会变成普通管理员</span>，如确认删除，请在下方输入 “ 确认删除 ”', '提示', {
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
                this.$http.delete('/admin/deleteEnchanter?uuid=' + this.list[index].uuid).then(res => {
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
        drow() {
            let filename = '勾魂使者_' + this.item.name
            html2canvas(document.getElementById('card'), {
                useCORS: true, // 使用跨域
            }).then(canvas => {
                var myBlob = dataURLtoBlob(canvas.toDataURL('img/png', 0.92))
                // blob转URL对象
                let url = URL.createObjectURL(myBlob)
                // 创建a标签，下载图片
                let a = document.createElement("a")
                let clickEvent = document.createEvent("MouseEvents");
                a.setAttribute("href", url)
                a.setAttribute("download", filename)
                a.setAttribute("target", '_blank')
                clickEvent.initEvent('click', true, true)
                a.dispatchEvent(clickEvent);
            });
            function dataURLtoBlob(dataurl) {
                var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], { type: mime });
            }
        },

        // 分页，页数改变时触发
        handleCurrentChange(val) {
            this.currentPage = val
            this.$http.get(`/admin/getEnchanterList?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
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
            this.$http.get(`/admin/getEnchanterList?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
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
            this.$http.get(`/admin/getEnchanterList?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
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
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            this.$http.get(`/admin/getEnchanterList?name=${this.search}`).then(res => {
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
            this.$http.get(`/admin/getEnchanterList?page=1&limit=15`).then(res => {
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