<template>
    <div class="main">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="一致性 Consistency" name="1">
                <template slot="title">
                    <span class="name">勾魂</span>
                </template>
                <div class="info"> 阎罗王的判官手中有一本记录着三界众生生卒年月时辰的本子，人的阳寿将尽之时，会有阴间的使者前来勾魂。勾魂使者通常是黑白无常，他们将生魂引出，带领它们踏上阳间通往阴间的旅途
                </div>
            </el-collapse-item>
            <el-collapse-item title="一致性 Consistency" name="2">
                <template slot="title">
                    <span class="name">过鬼门关</span>
                </template>
                <div class="info"> 阴阳交界之处，有一座雄伟的牌楼，上书苍劲有力的三个大字“鬼门关”。鬼门关是入地府的必经关卡，人死后先来鬼门关报道，过了这一关人的魂魄就变成了鬼。
                </div>
            </el-collapse-item>
            <el-collapse-item title="一致性 Consistency" name="3">
                <template slot="title">
                    <span class="name">走黄泉路</span>
                </template>
                <div class="info"> 鬼门关一过，便踏上了黄泉路。这是一条接引之路，路上还有很多孤魂野鬼，他们是那些阳寿未尽而非正常死亡的，他们既不能上天，
                    也不能投胎，更不能到阴间，只能在黄泉路上游荡，等待寿阳到了后才能到阴间报到，听候阎罗王的发落。
                    <br>
                    阴间有个枉死城，轻生的人是无法转世投胎的，须得在枉死城经受那百般折磨、千般历练，脱却有罪之身，洗尽前世铅华，方可重回六道
                </div>
            </el-collapse-item>
            <el-collapse-item title="一致性 Consistency" name="4">
                <template slot="title">
                    <span class="name">上望乡台</span>
                </template>
                <div class="info">
                    走出了黄泉路，便上了望乡台。传说这望乡台是大慈大悲的观世音菩萨体恤众生不愿死亡、惦念家中亲人的真情实意，发愿而成。鬼魂去地府报到前，对阳世亲人十分挂念，尽管鬼卒严催怒斥，还是强登望乡台，最后遥望家乡，大哭一声，才死心塌地继续前行，望乡台被传说这亡魂最后一次向阳世亲人告别的地方
                </div>
            </el-collapse-item>
            <el-collapse-item title="一致性 Consistency" name="5">
                <template slot="title">
                    <span class="name">过奈何桥</span>
                </template>
                <div class="info">
                    在黄泉路和冥府之间，有一条河，名叫忘川。忘川河水呈血红色，里面尽是不得投胎的孤魂野鬼，腥风扑面，奈何桥就架在忘川河上。亡魂都要过奈河桥，善者有神佛护佑顺利过桥，恶者被打入血河池受罪。相传奈何桥分三层，善人的鬼魂可以安全通过上层的桥，善恶兼半者过中间的桥，
                    恶人的鬼魂过下层的桥，多被鬼拦往桥下的污浊的波涛中，被铜蛇铁狗狂咬<br><br>
                    奈何桥前坐着一个老婆婆，叫孟婆，要过忘川河，必过奈何桥，要过奈何桥，就要喝孟婆汤，不喝孟婆汤，就过不得奈何桥，过不得奈何桥，就不得投生转世。孟婆汤可以让人忘记一切，彻底了却前尘过往。所以，死者心中所有对尘世执着都会化作奈何桥前的一声叹息，这也是这座连接各世轮回的桥命名为奈何桥的原因。<br><br>
                    奈何桥头还有一块三生石，它一直立在奈何桥边，张望着红尘中那些准备喝孟婆汤、轮回投胎的人们。传说三生石能照出人前世的模样。前世的因，今生的果，宿命轮回，缘起缘灭，都重重地刻在了三生石上。千百年来，它见证了芸芸众生的苦与乐、悲与欢、笑与泪。该了的债，该还的情，在三生石前，都一笔勾销。
                </div>
            </el-collapse-item>
            <el-collapse-item title="一致性 Consistency" name="6">
                <template slot="title">
                    <span class="name">入阎王殿</span>
                </template>
                <div class="info"> 进入冥府后，鬼魂就要接受十殿阎王的审讯了。民间传说正式进入阎王殿前，鬼魂还要喝下一碗迷魂水，喝下便能口吐真言。
                    <br>
                    十殿阎王分掌地府十殿，统摄不同地狱，掌握鬼魂投胎转世的“生死大权”，鬼魂到了阎王面前，阎王会根据其在阳间的所作所为进行奖惩，以善恶定夺它入六道轮回中的哪一道。
                </div>
            </el-collapse-item>
            <el-collapse-item title="一致性 Consistency" name="7">
                <template slot="title">
                    <span class="name">进六道轮回</span>
                </template>
                <div class="info"> 轮回便是鬼魂转生前的最后一项。鬼魂经阎王审判，进入自己的轮回之道。生平为善多于恶者入三善道，天道、阿修罗道、人道;生平为恶多于善者，入三恶道，畜生道、饿鬼道、地狱道。
                    <br><br>
                    天道，也就是成仙成佛，入极乐世界;阿修罗道中的阿修罗与我们常说的修罗不同，“阿修罗”为梵语，译成汉语为“非天”，这些人有天人之福，而无天人之德;人道，就是转世成人，苦乐参半;畜生道种类众多，简言之就是转生成为动物，六道中唯有“人道”和“畜生道”的转生者拥有实体;饿鬼道，化为鬼神妖魔;而地狱道是留给那些大奸大恶之人的，堕入地狱，受无尽之苦。
                    <br><br>
                    所以生者在世时应多行善事，死后才能有好的轮回
                </div>
            </el-collapse-item>
            <el-collapse-item title="一致性 Consistency" name="8">
                <template slot="title">
                    <span class="name">至此结束</span>
                </template>
                <div class="info"> 至此，结束
                </div>
            </el-collapse-item>

        </el-collapse>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeNames: ['1']
        }
    },
    methods: {

    },
    mounted() {
    },
}
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    min-height: 100%;
    background: #fff;
    text-align: left;
    box-sizing: border-box;
    padding: 20px;

    .name {
        color: #4089fd;
        font-size: 16px;
    }

    .info {
        padding-left: 30px;
        padding-right: 65px;
        box-sizing: border-box;
    }
}
</style>