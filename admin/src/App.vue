<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}

::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background: #cfcbcb;
}

::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 10px;
    background: #ededed;
}

/* el-table 滚动条样式 */
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
    width: 10px;
}

.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
}

.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
}

.el-table__header-wrapper .has-gutter th:nth-last-child(2) {
    border-right: 0;
}

/* el-table 滚动条样式结束 */
</style>
