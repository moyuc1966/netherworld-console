<template>
    <div class="main">
        <el-card class="box-card">
            <div class="tableHead">
                <el-button class="addButton" size="primary" plain @click="addBind">添加</el-button>
            </div>
            <!-- 表格 -->
            <el-table :row-style="{ height: '55px' }" id="out-table" :data="list" style="width: 100%;height: 700px;"
                height="height" size="mini" :fit="true">
                <el-table-column fixed prop="name" label="名称" min-width="100" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="description" label="描述" min-width="140" align="left" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span style="cursor: pointer;" @click="lookDescription(scope.row.description)">{{
                            scope.row.description }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="module" label="权限列表" min-width="280" align="left" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span style="cursor: pointer;" @click="lookDescription(scope.row.module)">{{
                            scope.row.module }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed prop="update_time" label="更新时间" width="150" align="center" show-overflow-tooltip>
                </el-table-column>

                <el-table-column fixed="right" label="操作" min-width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-s-order" circle size="mini"
                            @click="look(scope.$index)"></el-button>
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
        <el-dialog :visible.sync="editShow" width="590px" title="修改角色信息" :before-close="handleCloseTree">
            <el-form label-width="80px" style="text-align: left;">
                <el-form-item label="名称">
                    <el-input v-model="item.name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入描述内容.."
                        :show-word-limit="true" maxlength="100" v-model="item.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="权限列表">
                    <el-tree ref="edittree" :data="roleList" :default-checked-keys="moduleList.idList"
                        :default-expand-all="true" :check-strictly="true" show-checkbox node-key="id" :props="defaultProps"
                        @check-change="editchange">
                    </el-tree>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editShow = false">取 消</el-button>
                <el-button type="primary" @click="update()">保 存</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="cardShow" width="590px" title="添加角色">
            <el-form label-width="80px" style="text-align: left;">
                <el-form-item label="名称">
                    <el-input v-model="item.name" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入描述内容.."
                        :show-word-limit="true" maxlength="100" v-model="item.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="权限列表">
                    <el-tree ref="tree" :data="roleList" :default-checked-keys="[1, 2, 3, 8, 13, 16, 29, 11, 27, 7, 15]"
                        :default-expand-all="true" :check-strictly="true" show-checkbox node-key="id" :props="defaultProps"
                        @check-change="change">
                    </el-tree>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editShow = false">取 消</el-button>
                <el-button type="primary" @click="add()">保 存</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="lookShow" width="500px" title="查看权限列表">
            <el-tree :data="moduleList.data" :default-expand-all="true" node-key="id" :props="defaultProps">
            </el-tree>
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
            cardShow: false,
            editShow: false,
            status: 0,
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            lookShow: false,
            roleList: [
                {
                    "id": 1,
                    "name": "生死簿",
                    disabled: true,
                    "children": [
                        {
                            "id": 2,
                            "name": "数据管理",
                            disabled: true
                        },
                        {
                            "id": 3,
                            "name": "数据同步",
                            disabled: true
                        }
                    ]
                },
                {
                    "id": 4,
                    "name": "勾魂管理",
                    "children": [
                        {
                            "id": 5,
                            "name": "勾魂使者",
                        },
                        {
                            "id": 6,
                            "name": "勾魂数据",
                        }
                    ]
                },
                {
                    "id": 7,
                    "name": "阎王殿审判",
                    disabled: true,
                    "children": [
                        {
                            "id": 8,
                            "name": "十殿",
                            disabled: true
                        },
                        {
                            "id": 9,
                            "name": "审判记录",
                        },
                        {
                            "id": 10,
                            "name": "数据同步",
                        }
                    ]
                },
                {
                    "id": 11,
                    "name": "十八层地狱",
                    disabled: true,
                    "children": [
                        {
                            "id": 12,
                            "name": "设备管理",
                        },
                        {
                            "id": 13,
                            "name": "作业流程",
                            disabled: true
                        },
                        {
                            "id": 14,
                            "name": "地狱数据",
                        }
                    ]
                },
                {
                    "id": 15,
                    "name": "六道轮回",
                    disabled: true,
                    "children": [
                        {
                            "id": 16,
                            "name": "轮回盘",
                            disabled: true
                        },
                        {
                            "id": 17,
                            "name": "轮回记录",
                        }
                    ]
                },
                {
                    "id": 18,
                    "name": "冥币管理",
                    "children": [
                        {
                            "id": 19,
                            "name": "汇款",
                        },
                        {
                            "id": 20,
                            "name": "汇款管理",
                        }
                    ]
                },
                {
                    "id": 21,
                    "name": "角色权限",
                    "children": [
                        {
                            "id": 22,
                            "name": "角色管理",
                        },
                        {
                            "id": 23,
                            "name": "权限设置",
                        }
                    ]
                },
                {
                    "id": 24,
                    "name": "管理员",
                    "children": [
                        {
                            "id": 25,
                            "name": "管理员管理",
                        },
                        {
                            "id": 26,
                            "name": "管理员添加",
                        }
                    ]
                },
                {
                    "id": 27,
                    "name": "系统设置",
                    disabled: true,
                    "children": [
                        {
                            "id": 28,
                            "name": "系统设置",
                        },
                        {
                            "id": 29,
                            "name": "信息修改",
                            disabled: true
                        }
                    ]
                }
            ],
            moduleList: {
                data: [],
                idList: []
            }
        }
    },
    activated() {
        this.$http.get(`admin/role/list?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
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
            this.$alert(info, '详细信息', {
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
        look(index) {
            let a = JSON.stringify(this.list[index])
            this.item = JSON.parse(a)
            // this.editShow = true
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$http.get('admin/role/module?role=' + this.item.id).then(res => {
                loading.close()
                if (res.data.code == 200) {
                    let obj = {
                        data: res.data.data,
                        idList: res.data.idList.split(',')
                    }
                    obj.data.unshift({
                        "id": 0,
                        "name": "首页",
                        disabled: true,
                    })
                    this.moduleList = obj
                    this.lookShow = true
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        edit(index) {
            let a = JSON.stringify(this.list[index])
            this.item = JSON.parse(a)
            // this.editShow = true
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$http.get('admin/role/module?role=' + this.item.id).then(res => {
                loading.close()
                if (res.data.code == 200) {
                    let obj = {
                        data: res.data.data,
                        idList: res.data.idList.split(',')
                    }
                    this.moduleList = obj
                    this.editShow = true
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleCloseTree() {
            this.$refs.edittree.setCheckedKeys([], false)
            this.editShow = false
        },
        addBind() {
            this.item = {
                name: '',
                description: '',
                module: '1,2,3,8,13,16,29,11,27,7,15'
            }
            this.cardShow = true
        },
        add() {
            function removeParentIds(arr, data) {
                // const ids = data.map(item => item.id);
                let ids = arr
                data.forEach(item => {
                    if (arr.includes(item.id)) {
                        const childrenIds = item.children.map(child => child.id);
                        if (!childrenIds.some(id => arr.includes(id))) {
                            ids = ids.filter(id => id !== item.id);
                        }
                    }
                });
                return ids;
            }
            //修改需要增加权限的修改，还有一个是查看权限列表（增加一个查看角色权限接口，有id和list）以及权限管理，权限管理内容是所有的界面
            let arr = this.item.module.split(',').map(Number);
            let arrnode = removeParentIds(arr, this.roleList)
            this.item.module = arrnode.join(',')
            if (this.item.name == '' || this.item.description == '') return this.$message.error('请填写完整信息')
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            let data = {
                name: this.item.name,
                description: this.item.description,
                module: this.item.module
            }
            this.$http.post('admin/role/add', data).then(res => {
                loading.close()
                if (res.data.code == '200') {
                    this.$message.success('添加成功')
                    this.cardShow = false
                    this.getInfo()
                    this.item = {}
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        editchange() {
            const checkedKeys = this.$refs.edittree.getCheckedKeys();
            let arr = checkedKeys
            function findParentIds(node, arr) {
                if (node.children) {
                    for (const child of node.children) {
                        if (arr.includes(child.id)) {
                            arr.push(node.id);
                        }
                        findParentIds(child, arr);
                    }
                }
            }
            let yourArray = this.roleList;
            // 遍历每个节点
            for (const node of yourArray) {
                findParentIds(node, arr);
            }
            let arr1 = [...new Set(arr)]

            this.item.module = arr1.join(',')
        },
        change() {
            const checkedKeys = this.$refs.tree.getCheckedKeys();
            let arr = checkedKeys
            function findParentIds(node, arr) {
                if (node.children) {
                    for (const child of node.children) {
                        if (arr.includes(child.id)) {
                            arr.push(node.id);
                        }
                        findParentIds(child, arr);
                    }
                }
            }
            let yourArray = this.roleList;
            // 遍历每个节点
            for (const node of yourArray) {
                findParentIds(node, arr);
            }
            let arr1 = [...new Set(arr)]

            this.item.module = arr1.join(',')
        },
        update() {
            if (this.item.name == '' || this.item.description == '') return this.$message.error('请填写完整信息')
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            function removeParentIds(arr, data) {
                // const ids = data.map(item => item.id);
                let ids = arr
                data.forEach(item => {
                    if (arr.includes(item.id)) {
                        const childrenIds = item.children.map(child => child.id);
                        if (!childrenIds.some(id => arr.includes(id))) {
                            ids = ids.filter(id => id !== item.id);
                        }
                    }
                });
                return ids;
            }
            let arr = this.item.module.split(',').map(Number);
            let arrnode = removeParentIds(arr, this.roleList)
            this.item.module = arrnode.join(',')
            console.log(this.item.module);
            let data = {
                id: this.item.id,
                name: this.item.name,
                description: this.item.description,
                modules: this.item.module
            }
            this.$http.put('admin/role/edit', data).then(res => {
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
            this.$prompt('此操作会删除重要数据，<span style="color:#a93a3a">拥有该角色的用户会修改为普通管理员</span>，如确认删除，请在下方输入 “ 确认删除 ”', '提示', {
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
                this.$http.delete('admin/role/del?id=' + this.list[index].id).then(res => {
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
            this.$http.get(`admin/role/list?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
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
            this.$http.get(`admin/role/list?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
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
            this.$http.get(`admin/role/list?page=${this.currentPage}&limit=${this.pageSize}`).then(res => {
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
    position: relative;
    top: -10px;

    .addButton {
        position: absolute;
        right: 56px
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