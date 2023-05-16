<template>
    <div class="main">
        <el-form label-width="80px" style="text-align: left;">
            <el-form-item label="轮回者" style="width:500px">
                <el-input placeholder="请选择需要轮回的人" v-model="user.name" @click="filebookShow = true"
                    @focus="filebookShow = true"></el-input>
            </el-form-item>
            <el-form :inline="true" label-width="80px">
                <el-form-item label="轮回类型">
                    <el-select v-model="type" placeholder="请选择轮回类型" value-key="value">
                        <el-option :label="item.lable" :value="item.value" v-for="(item, index) in  [{ value: '人间道', lable: '人间道' }, { value: '阿修罗道', lable: '阿修罗道' }
                            , { value: '畜生道', lable: '畜生道' }, { value: '饿鬼道', lable: '饿鬼道' }, { value: '地狱道', lable: '地狱道' }
                            , { value: '天神道', lable: '天神道' }]" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form-item label="理由" style="width:800px">
                <el-input placeholder="请输入轮回理由" v-model="reason" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }"
                    :show-word-limit="true" maxlength="1000"></el-input>
            </el-form-item>

            <el-form-item style="margin-top: 45px;">
                <el-button type="primary" @click="clear" plain>重 置</el-button>
                <el-button type="primary" style="margin-left: 20px;" @click="post">添加记录</el-button>
            </el-form-item>
        </el-form>



        <el-dialog title="请选择生死簿记录" :visible.sync="filebookShow" width="580px" style="text-align: left;">
            <el-form label-width="70px">
                <el-form-item label="轮回者">
                    <el-input placeholder="请输入uuid或姓名搜索" style="width:250px" v-model="filebookuuid"></el-input>
                    <el-button type="primary" style="margin-left:22px;" @click="querySearchAsync">搜索</el-button>
                </el-form-item>
            </el-form>
            <div class="filelist">
                <div class="file-item" v-for="(item, index) in filebook" :key="index">
                    <span class="name">{{ item.name }}</span>
                    <span class="uuid">{{ item.uuid }}</span>
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
                lifebook_id: '',
                record: '',
                title: ''
            },
            reason: '',
            type: ''
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
            this.info.lifebook_id = this.user.id
        },
        clear() {
            this.info = {
                lifebook_id: '',
                record: '',
                title: ''
            }
            this.stance = ''
            this.type = 2
            this.filebookuuid = ''
            this.filebook = []
            this.user = {}
            this.lun_type = ''
            this.time = ''
            this.yu_type = ''
        },
        post() {
            if (this.info.lifebook_id == '') return this.$message.error('请选择生死簿记录');
            //打入地府
            if (this.yu_type == '') return this.$message.error('请选择轮回类型');
            if (this.reason == '') return this.$message.error('请输入轮回理由');
            this.$confirm('是否确认添加此数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    uid: this.info.lifebook_id,
                    type: this.type,
                    reason: this.reason,
                }
                this.$http.post('admin/reincarnationadd', data).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success(res.data.msg);
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
            width: calc(100% - 180px);
            margin-left: 100px;
            box-sizing: border-box;

            .info {
                color: #185ed1;
                display: block;
                margin-left: 62px;
                cursor: pointer;
            }

            .uuid {
                display: clock;
            }

            .name {
                display: block;
                width: 80px;
                text-align: left;
            }
        }
    }
}
</style>
