<template>
    <div class="main">
        <img src="../../../images/u1144.png" class="top" alt="">
        <img src="../../../images/lunhui.png" alt="" class="lun">
        <el-button type="primary" @click="rotate">随机轮回</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            kss: "选择中"
        }
    },
    methods: {
        // 随机旋转转盘，计算还是you点问题，待解决
        rotate() {
            var lun = document.getElementsByClassName("lun")[0];
            lun.style.transform = "rotate(44.5deg)";
            var i = 44.5;
            var de = parseInt(Math.random() * (720 - 405 + 1) + 720, 10) + 44.5;
            let hs = setInterval(() => {
                if (i < de) {
                    i++;
                    lun.style.transform = "rotate(" + (i) + "deg)";
                } else {
                    clearInterval(hs);
                    var sy = (i) % 360 - 44.5;
                    if (sy <= 60) {
                        this.kss = "人间道";
                    } else if (sy > 60 && sy <= 120) {
                        this.kss = "阿修罗道";

                    } else if (sy > 120 && sy <= 180) {
                        this.kss = "畜生道";

                    } else if (sy > 180 && sy <= 240) {
                        this.kss = "饿鬼道";
                    } else if (sy > 240 && sy <= 300) {
                        this.kss = "地狱道";
                    } else {
                        this.kss = "天神道";
                    }
                }
            }, 1)
        }
    }
}
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;

    .top {
        position: absolute;
        top: 22px;
        left: calc(50% - 53px);
        width: 106px;
        z-index: 10;
    }

    .lun {
        width: 481px;
        position: absolute;
        top: 55px;
        left: calc(50% - 240.5px);
        z-index: 8;
        // transform: rotate(44.5deg);
        animation-duration: 1s;
    }

    .el-button {
        width: 180px;
        position: absolute;
        top: 595px;
        left: calc(50% - 90px);
        z-index: 11;
    }
}
</style>