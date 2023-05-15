<template>
    <div class="main">
        <div class="tools">
            <el-button type="primary" @click="showbind()" plain>添加设备</el-button>
        </div>
        <el-tabs type="border-card" style="width: 100%;min-height: calc(100% - 60px);" @tab-click="click" value="1">
            <el-tab-pane :label="item.lable" v-for="(item, index) in tablelist" :key="index" :name="item.value">
                <div class="box">
                    <span v-if="show.length == 0" class="nono">暂无数据</span>
                    <div class="item" v-for="(item, index) in show" :key="index">
                        <span class="name" @click="uigo(item.id)">{{ item.name }}</span>
                        <span class="time">创建于：{{ item.create_time }}</span>
                        <el-switch :value="item.status == 0" active-color="#13ce66" :name="index + 'dev'"
                            inactive-color="#aaa" @change="change(index)">
                        </el-switch>
                        <i class="el-icon-edit" @click="edit(item, index)"></i>
                        <i class="el-icon-delete" @click="del(index, item.floor)"></i>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="添加设备" :visible.sync="addShow" width="30%">
            <el-form label-width="80px" class="demo-ruleForm">
                <el-form-item label="设备名称" prop="name">
                    <el-input v-model="item.name"></el-input>
                </el-form-item>
                <el-form-item label="所属地狱">
                    <el-select v-model="item.floor" placeholder="请选择所属地狱">
                        <el-option :label="item.lable" :value="item.value" v-for="(item, index) in tablelist"
                            :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addShow = false">取 消</el-button>
                <el-button type="primary" @click="add()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: [],
            tablelist: [{ value: '1', lable: '铁钳地狱' }, { value: '2', lable: '剪刀地狱' }
                , { value: '3', lable: '铁树地狱' }, { value: '4', lable: '孽镜地狱' }, { value: '5', lable: '蒸笼地狱' }
                , { value: '6', lable: '铜柱地狱' }, { value: '7', lable: '刀山地狱' }, { value: '8', lable: '冰山地狱' }
                , { value: '9', lable: '油锅地狱' }, { value: '10', lable: '牛坑地狱' }, { value: '11', lable: '石压地狱' }
                , { value: '12', lable: '舂臼地狱' }, { value: '13', lable: '血池地狱' }, { value: '14', lable: '枉死牢地狱' }
                , { value: '15', lable: '磔刑地狱' }, { value: '16', lable: '火山地狱' }, { value: '17', lable: '石磨地狱' }
                , { value: '18', lable: '刀锯地狱' }],
            item: {},
            addShow: false,
            floor: ''
        }
    },
    methods: {
        getInfo() {
            //此处有分页，但是考虑数量问题，暂时显示10条
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$http.get('admin/helllist?floor=1').then(res => {
                loading.close()
                this.show = res.data.data
            })
        },
        click(e) {
            this.floor = e.name
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$http.get('admin/helllist?floor=' + e.name).then(res => {
                console.log(res.data);
                loading.close()
                this.show = res.data.data
            })
        },
        change(index) {
            this.show[index].status = this.show[index].status == 0 ? 1 : 0
            let data = {
                id: this.show[index].id,
                status: this.show[index].status
            }
            this.$http.put('admin/hellstatus', data).then(res => {
                console.log(res.data);
                if (res.data.code == 200) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        edit(item, index) {
            this.item = item
            this.editShow = true
            this.$prompt('请新的设备名称', '修改设备名称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /$/,
                inputErrorMessage: '请输入新设备名称'
            }).then(({ value }) => {
                if (value == '' || value == null || value == ' ') return this.$message({
                    type: 'error',
                    message: '请输入新的名称'
                });
                let data = {
                    id: item.id,
                    name: value
                }
                this.$http.put('admin/hellupdate', data).then(res => {
                    console.log(res.data);
                    if (res.data.code == 200) {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.show[index].name = value
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                })
            }).catch(() => { });
        },
        del(index, floor) {
            this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete('/admin/helldel?id=' + this.show[index].id).then(res => {
                    if (res.data.code == 200) {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.show.splice(index, 1)
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        showbind() {
            this.addShow = true;
            this.item = {
                name: '',
                floor: ''
            }
        },
        add() {
            if (this.item.name == '' || this.item.floor === '') return this.$message({
                type: 'error',
                message: '请填写完整信息'
            });
            this.$http.post('admin/helladd', this.item).then(res => {
                console.log(res.data);
                if (res.data.code == 200) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.addShow = false
                    this.getInfo()
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        uigo(id) {
            this.$router.push({ path: '/hell/data', query: { id: id } })
        }
    },
    mounted() {
        this.getInfo()
    }
}
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    min-height: 100%;
    background-color: #fff;
    box-sizing: border-box;
    position: relative;
    text-align: left;

    .tools {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 30px;
    }

    .nono {
        display: block;
        width: 100%;
        line-height: 200px;
        text-align: center;
        font-size: 20px;
        color: #aaa;
    }

    .box {
        width: 100%;
        height: calc(100vh - 230px);
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 15px;
        padding: 12px;
        box-sizing: border-box;

        .item {
            width: 100%;
            box-shadow: 0 0 20px #e5e5e5;
            border-radius: 3px;
            box-sizing: border-box;
            padding: 12px;
            position: relative;
            height: 120px;
            padding-top: 22px;
            min-width: 230px;

            .name {
                display: block;
                font-size: 19px;
                color: #2e79f1;
                cursor: pointer;
            }

            .time {
                display: block;
                font-size: 12px;
                color: #aaa;
                margin-top: 10px;
                position: absolute;
                bottom: 12px;
                left: 12px;
            }

            .el-switch {
                position: absolute;
                right: 62px;
                top: 22px;
            }

            .el-icon-edit {
                position: absolute;
                right: 12px;
                bottom: 12px;
                font-size: 20px;
                color: #aaa;
                cursor: pointer;
            }

            .el-icon-delete {
                position: absolute;
                right: 12px;
                top: 22px;
                font-size: 20px;
                color: #f39c9c;
                cursor: pointer;
            }
        }
    }
}
</style>