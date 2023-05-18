<template>
    <div class="main">
        <div v-for="(item, index) in list" :key="index">
            <div class="tree-box" v-if="show">
                <span class="name">{{ item.name }}</span>
                <el-tree :data="item.list" :default-expand-all="true" node-key="id" :props="defaultProps">
                </el-tree>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            show: false,
            defaultProps: {
                children: 'children',
                label: 'name'
            },
        }
    },
    methods: {
        getInfo() {
            let loading = this.$loading({
                lock: true,
                text: '加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$http.get(`admin/role/list?page=1&limit=100`).then(res => {
                if (res.data.code == 200) {
                    this.list = res.data.data;
                    this.list.forEach((item, index) => {
                        this.$http.get('admin/role/module?role=' + item.id).then(res => {
                            if (res.data.code == 200) {
                                item.list = res.data.data
                                if (index == this.list.length - 1) {
                                    loading.close()
                                    this.show = true
                                }
                            } else {
                                loading.close()
                                this.$message.error(res.data.msg)
                            }
                        })
                    })
                } else {

                    loading.close()
                    this.$message.error(res.data.msg)
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
    width: 100%;
    min-height: 100%;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;

    .tree-box {
        width: 180px;
        margin-bottom: 20px;
        border: 1px solid #ebeef5;
        margin: 0 20px 20px 0;
        border-top: 40px solid #f5f7fa;
        padding: 10px;
        position: relative;

        .name {
            position: absolute;
            top: -40px;
            left: 0;
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #458bff;
        }

        .el-tree-node__content {
            display: flex;
            align-items: center;

            .el-tree-node__label {
                flex: 1;
            }
        }
    }
}
</style>