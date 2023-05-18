<template>
    <div class="main">
        <span class="title">修改系统信息</span>
        <el-form label-width="130px">
            <el-form-item label="汇款开关">
                <el-switch :value="findValue('remittance')" @change="updateValue('remittance', $event)"
                    active-color="#13ce66" inactive-color="#aaa"></el-switch>
                <span class="time">修改于：{{ findTime('remittance') }}</span>
                <el-alert title="关闭此开关之后所有的汇款都将无法操作，包括管理员执行汇款操作也会被禁止" type="info" show-icon
                    style="width: 700px;"></el-alert>
            </el-form-item>
            <el-form-item label="敲木鱼加功德开关">
                <el-switch :value="findValue('woodenfish')" @change="updateValue('woodenfish', $event)"
                    active-color="#13ce66" inactive-color="#aaa"></el-switch>
                <span class="time">修改于：{{ findTime('woodenfish') }}</span>
                <el-alert title="关闭此开关之后敲木鱼将不会增加功德，但是木鱼仍然可敲" type="info" show-icon style="width: 700px;"></el-alert>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: []
        }
    },
    methods: {
        getInfo() {
            this.$http.get('admin/systemset').then(res => {
                this.list = res.data.data;
                console.log(this.list);
            })
        },
        findValue(key) {
            let value = '';
            this.list.forEach(item => {
                if (item.key == key) {
                    value = item.value;
                }
            });
            if (value == '1' || value == '0') return value == '1' ? true : false;
            return value;
        },
        findTime(key) {
            let value = '';
            this.list.forEach(item => {
                if (item.key == key) {
                    value = item.create_time;
                }
            });
            return value;
        },
        addZero(num) {
            return num < 10 ? '0' + num : num;
        },
        updateValue(key, value) {
            let setValue = ''
            //value是否是布尔值
            if (typeof value == 'boolean') {
                setValue = value ? '1' : '0';
            } else {
                setValue = value;
            }
            this.$http.put('admin/systemset', {
                key: key,
                value: setValue
            }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    //获取当前时间并且格式化然后修改对应的时间，时间要补0
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    let hour = date.getHours();
                    let minute = date.getMinutes();
                    let second = date.getSeconds();
                    let time = year + '-' + this.addZero(month) + '-' + this.addZero(day) + ' ' + this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(second);
                    //修改对应的值
                    this.list.forEach(item => {
                        if (item.key == key) {
                            item.value = setValue;
                            item.create_time = time;
                        }
                    });
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        }
    },
    mounted() {
        this.getInfo()
    },
}
</script>
        

<style lang="less" scoped>
.main {
    background: #fff;
    width: 100%;
    height: 100%;
    padding: 20px;
    text-align: left;
    box-sizing: border-box;

    .title {
        display: block;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 20px;
    }

    .time {
        margin-left: 20px;
        color: #aaa;
        font-size: 14px;
    }
}
</style>