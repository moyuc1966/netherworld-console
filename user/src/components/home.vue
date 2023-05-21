<template>
    <div class="main">
        <h2 class="title">地府管理系统</h2>
        <div class="box">
            <div class="item" id="my-element1" @click="routerPush('/woodenFish', 1)">
                <span class="name">敲木鱼</span>
                <img class="icon" src="../../image/fish.png" alt="">
            </div>
            <div class="item" id="my-element2" @click="routerPush('/lifebook', 2)">
                <span class="name">生死簿</span>
                <img class="icon" src="../../image/lifebook.png" alt="">
            </div>
            <div class="item" id="my-element3" @click="uigo()">
                <span class="name">阎王殿</span>
                <img class="icon" src="../../image/admin.png" alt="">
            </div>
        </div>

        <span class="copy">2023 墨羽晨原创</span>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        uigo() {

            function performFlipAndZoom() {
                var element = document.getElementById("my-element3");
                element.classList.add("flipped");
                setTimeout(function () {
                    doSomething();
                }, 900);
            }
            performFlipAndZoom()

            let doSomething = () => {
                //移除flipped类，使其恢复正常状态
                document.getElementById("my-element3").classList.remove("flipped");
                document.getElementById("my-element3").style.transform = "scale(1)"
                window.open(this.adminUrl)
            }
        },
        routerPush(path, index) {
            function performFlipAndZoom() {
                let id = "my-element" + index
                var element = document.getElementById(id);
                element.classList.add("flipped");
                setTimeout(function () {
                    doSomething(index);
                }, 1000);
            }
            performFlipAndZoom()

            let doSomething = (index) => {
                //移除flipped类，使其恢复正常状态
                document.getElementById("my-element" + index).classList.remove("flipped");
                //让icon大小恢复
                document.getElementById("my-element" + index).style.transform = "scale(1)"
                this.$router.push(path)
            }
        }

    },
    mounted() {
        //禁止鼠标右键
        document.oncontextmenu = function () {
            return false;
        }
        //禁止键盘的一切操作
        document.onkeydown = function () {
            //F12
            if (window.event && window.event.keyCode == 123) {
                event.keyCode = 0;
                event.returnValue = false;
            }
            //Ctrl+Shift+I
            if (window.event && window.event.keyCode == 123) {
                event.keyCode = 0;
                event.returnValue = false;
            }
            //Shift+F10
            if (window.event && window.event.keyCode == 121) {
                event.keyCode = 0;
                event.returnValue = false;
            }
            //Ctrl+U
            if (window.event && window.event.keyCode == 85) {
                event.keyCode = 0;
                event.returnValue = false;
            }
            //Ctrl+Shift+J
            if (window.event && window.event.keyCode == 74) {
                event.keyCode = 0;
                event.returnValue = false;
            }
        }
        //禁止文本选择
        document.onselectstart = function () {
            return false;
        }

    },
}
</script>

<style scoped>
.main {
    background-image: url(../../image/bg1.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    width: 100%;
    height: 100%;
    position: fixed;
}

.title {
    display: block;
    width: 100%;
    color: #fff;
    font-weight: bold;
    font-size: 55px;
    text-align: center;
    font-style: normal;
    font-family: '华文隶书 Bold', '华文隶书';
    /* 字间距 */
    letter-spacing: 15px;
    margin-top: 40px;
    cursor: default;
}

.copy {
    font-size: 13px;
    color: #aaa;
    position: fixed;
    bottom: 20px;
    display: block;
    width: 100%;
    text-align: center;
    left: 0;
    letter-spacing: 3px;
    cursor: default;
}

.box {
    width: 70%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 30px auto;
    justify-content: space-between;
    margin-top: 10%;
    min-width: 700px;
}

.item {
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    width: 200px;
    height: 150px;
    border-radius: 5px;
    text-align: center;
    /* 毛玻璃效果 */
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    padding: 10px;
    margin: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
    transition: all 2s;
    transform-style: preserve-3d;
    /* 将元素沿y轴旋转180度，使其在翻转时不会出现镜面效果 */
    transform: perspective(1000px) rotateY(0deg);
}

#my-element1.flipped {
    transform: perspective(1000px) rotateY(180deg) scale(15);
    background-color: #38383d;
    transition: all 2s;
    opacity: 0.8;
}

#my-element2.flipped {
    transform: perspective(1000px) rotateY(180deg) scale(15);
    background-color: #38383d;
    transition: all 2s;
    opacity: 0.8;
}

#my-element3.flipped {
    transform: perspective(1000px) rotateY(180deg) scale(15);
    background-color: #38383d;
    /* 透明度 */
    opacity: 0.8;
    transition: all 2s;
}

#my-element3.flipped .icon {
    /* 缩小15倍 */
    transform: scale(0.07);
    transition: all 2.1s;
}

#my-element2.flipped .icon {
    transform: scale(0.07);
    transition: all 2.1s;
}

#my-element1.flipped .icon {
    transform: scale(0.07);
    transition: all 2.1s;
}

.item:hover {
    /* 放大上移以及阴影效果 */
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
    transition: all 0.3s;
}

.item:hover>.icon {
    transform: scale(1.1);
    transition: all 0.3s;
}

.item:hover>.name {
    transition: all 0.2s;
    font-size: 22px;
}

.icon {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    display: block;
    margin-top: 10px;
}
</style>