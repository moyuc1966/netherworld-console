<template>
    <div class="main">
        <el-form label-width="80px" style="text-align: left;">
            <el-form-item label="汇款人" style="width: 500px;">
                <el-input placeholder="请输入汇款人" v-model="info.relationship" type="text" maxlength="20"
                    show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="收款人" style="width:500px">
                <el-input placeholder="请选择收款人" v-model="user.name" @click="filebookShow = true"
                    @focus="filebookShow = true"></el-input>
            </el-form-item>
            <el-form-item label="汇款金额" style="width: 500px;">
                <el-input placeholder="请输入汇款金额" v-model="info.money" type="number" maxlength="10"
                    show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="汇款备注" style="width:800px">
                <el-input placeholder="请输入轮回理由" v-model="info.reason" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }"
                    :show-word-limit="true" maxlength="1000"></el-input>
            </el-form-item>

            <el-form-item style="margin-top: 45px;">
                <el-button type="primary" @click="clear" plain>重 置</el-button>
                <el-button type="primary" style="margin-left: 20px;" @click="post">确认汇款</el-button>
            </el-form-item>
        </el-form>



        <el-dialog title="请选择生死簿记录" :visible.sync="filebookShow" width="620px" style="text-align: left;">
            <el-form label-width="70px">
                <el-form-item label="收款人">
                    <el-input placeholder="请输入uuid或姓名搜索" style="width:250px" v-model="filebookuuid"></el-input>
                    <el-button type="primary" style="margin-left:22px;" @click="querySearchAsync">搜索</el-button>
                </el-form-item>
            </el-form>
            <div class="filelist">
                <div class="file-item" v-for="(item, index) in filebook" :key="index">
                    <span class="name">{{ item.name }}</span>
                    <span class="uuid">{{ item.uuid }}</span>
                    <span style="margin-left: 10px;">余额{{ item.yinmoney }}</span>
                    <span class="info" @click="handleSelect(item)">选择</span>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" plain @click="filebookShow = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            filebookShow: false,
            filebookuuid: '',
            filebook: [],
            user: {},
            info: {
                uid: '',
                reason: '管理员汇款',
                money: '',
                relationship: '系统'
            },
        }
    },
    methods: {
        querySearchAsync() {
            if (this.filebookuuid == '') return this.$message.error('请输入完整')
            let search = ''
            let reg = /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/
            if (reg.test(this.filebookuuid)) {
                search = 'name=' + this.filebookuuid
            } else {
                let filebookuuid = this.filebookuuid.toLocaleUpperCase()
                search = 'uuid=' + filebookuuid
            }
            this.$http.get('admin/lifeBookSearch?' + search).then(res => {
                if (res.data.data.length > 0) {
                    this.filebook = res.data.data
                } else {
                    this.$message.error('暂无数据')
                }
            })
        },
        handleSelect(item) {
            this.user = item
            this.filebookShow = false
            this.info.uid = this.user.uuid
        },
        clear() {
            this.filebookShow = false
            this.filebookuuid = ''
            this.filebook = []
            this.user = {}
            this.info = {
                uid: '',
                reason: '管理员汇款',
                money: '',
                relationship: '系统'
            }
        },
        post() {
            if (this.info.uid == '') return this.$message.error('请选择生死簿记录');
            if (this.info.money == '') return this.$message.error('请输入汇款金额');
            if (this.reason == '') return this.$message.error('请输入汇款备注');
            if (this.money < 100) return this.$message.error('汇款金额至少100')
            this.$confirm('是否确认完成汇款?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('api/remittance', this.info).then(res => {
                    if (res.data.code == 200) {
                        this.$alert('当前该账户余额：' + res.data.data.yinmoney, res.data.msg, {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.clear()
                            }
                        });
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        }
    }

}
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 20px;
    text-align: left;

    .filelist {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;

        .file-item {
            border-bottom: 1px solid #e6e6e6;
            display: flex;
            align-items: center;
            height: 56px;
            width: calc(100% - 100px);
            margin-left: 50px;
            box-sizing: border-box;
            justify-content: space-between;

            .info {
                color: #185ed1;
                display: block;
                margin-left: 62px;
                cursor: pointer;
            }

            .uuid {
                display: block;
            }

            .name {
                display: block;
                width: 70px;
                text-align: left;
            }
        }
    }
}
</style>
