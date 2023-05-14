<template>
    <div class="main">
        <el-form ref="form" label-width="80px" style="padding-top:65px;">
            <el-form-item label="姓名">
                <el-input v-model="info.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="info.gender" placeholder="请选择性别" value-key="value">
                    <el-option :label="item.lable" :value="item.value"
                        v-for="(item, index) in [{ value: 0, lable: '男' }, { value: 1, lable: '女' }]"
                        :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="info.status" placeholder="请选择当前状态" value-key="value">
                    <el-option :label="item.lable" :value="item.value"
                        v-for="(item, index) in [{ value: 0, lable: '在职' }, { value: 1, lable: '休息' }, { value: 2, lable: '离职' }]"
                        :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="介绍">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入该勾魂使者介绍"
                    :show-word-limit="true" maxlength="100" v-model="info.description">
                </el-input>
            </el-form-item>
            <el-form-item style="width:100%;display: flex;justify-content: flex-end;margin-top: 52px; margin-bottom: 60px;">
                <el-button type="primary" @click="clear" plain style="margin-right:15px;">清空</el-button>
            </el-form-item>
        </el-form>
        <div class="tall">
            <el-form label-width="80px"
                style="width:100%;background: #fff; border-bottom: 1px solid #e1e1e1;position: relative;">
                <el-form-item label="使者照片">
                    <el-upload style="margin-left:16px;" class="centerImg" :action="' '" list-type="picture-card"
                        :file-list="fileList" :auto-upload="false" :limit="1" :on-change="complete" ref="uploadicon">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmitPhoto" style="margin-left:68px;">立即添加</el-button>
                </el-form-item>
                <el-button class="searchButton" size="primary" plain @click="back()">返回上一页</el-button>
            </el-form>
            <el-backtop target=".el-main" :visibility-height="50"></el-backtop>

            <p class="title">填写提示</p>
            <span class="info">1. 状态包括在职。休息和离职，默认为在职</span>
            <span class="info">2. 介绍内容100字之内</span>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            info: {
                name: '',
                gender: 0,
                description: '',
                status: 0
            },
            disabled: false,
            imageUrl: '',
            fileList: []
        }
    },
    methods: {
        clear() {
            this.info = {
                name: '',
                gender: 0,
                description: '',
                status: 0
            }
        },
        complete(file, fileList) {
            const isJPG = file.raw.type === 'image/jpeg'
            const isPNG = file.raw.type === 'image/png'
            const isLt2M = file.raw.size / 1024 / 1024 < 5
            this.hideUploadIcon = fileList.length >= 1;
            if (!isPNG && !isJPG) {
                this.$message.error('上传图片只能是 JPG/PNG 格式!')
                return false
            } else if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 5MB!')
                return false
            } else if (isLt2M && (isPNG || isJPG)) {
                this.imageUrl = file.raw;//图片的url
            }
        },
        onSubmitPhoto() {
            for (var key in this.info) {
                if (this.info[key] === '') {
                    return this.$message.error('请填写完整信息');
                }
            }
            if (this.imageUrl === '') return this.$message.error('请上传图片');
            const loading = this.$loading({
                lock: true,
                text: '正在上传...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let data = new FormData();
            data.append('enchant', this.imageUrl);
            data.append('name', this.info.name);
            data.append('gender', this.info.gender);
            data.append('description', this.info.description);
            data.append('status', this.info.status);
            this.$http.post('admin/addEnchanter', data, {
                "Content-Type": "multipart/form-data"
            }).then(res => {
                loading.close();
                if (res.data.code == 200) {
                    this.$message.success('添加成功');
                    this.clear()
                    this.fileList = []

                } else {
                    console.log(res.data);
                    this.$message.error(res.data.msg);
                }
            })
        },
        back() {
            this.$router.go(-1)
        }
    },
}
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    min-height: 100%;
    background: #fff;
    display: flex;
    justify-content: flex-start;
    position: relative;

    .edit-title {
        display: block;
        font-size: 19px;
        color: #185ed1;
        position: absolute;
        top: 20px;
        left: 18px;
        width: calc(50% - 60px);
        text-align: left;
        border-bottom: 1px solid #185ed1;
        padding-bottom: 15px;
    }

    .el-form {
        width: 50%;
        padding: 20px;
        box-sizing: border-box;
        text-align: left;
        padding-top: 30px;
    }

    .photo {
        width: 149px;
        height: 148px;
        border-radius: 6px;
    }

    .searchButton {
        position: absolute;
        top: 20px;
        right: 20px;
    }

    .tall {
        width: calc(50% - 50px);
        box-sizing: border-box;
        padding: 10px;
        margin-left: 50px;
        background: #fbfbfb;
        text-align: left;

        .title {
            display: block;
            font-size: 18px;
            font-weight: bold;
            text-align: left;
        }

        .info {
            display: block;
            font-size: 16px;
            line-height: 30px;
            margin-top: 20px;
            width: 100%;
            text-align: left;
        }
    }
}
</style>