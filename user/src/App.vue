<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style>
#app {
    width: 100%;
    height: 100%;
}

::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #e0e0e0;
}

::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #f1efef;
}

/* el-table 滚动条样式 */
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
    width: 10px;
}

.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
}

.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.05);
}

.el-table__header-wrapper .has-gutter th:nth-last-child(2) {
    border-right: 0;
}

/* el-table 滚动条样式结束 */
</style>
