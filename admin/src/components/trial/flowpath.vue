<template>
    <div class="main">
        <el-table :row-style="{ height: '75px' }" id="out-table" :data="list" style="width: 100%;height: 100%;"
            height="height" size="medium" :fit="true" :stripe="true">
            <el-table-column fixed prop="name" label="阎王殿" width="140" align="center">
            </el-table-column>
            <el-table-column fixed prop="homeman" label="阎王" width="140" align="left">
                <template slot-scope="scope">
                    <span style="color:#3884ff;">{{ scope.row.homeman }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed prop="docs" label="简介" min-width="300" align="left">
                <template slot-scope="scope">
                    <span style="cursor: pointer;" @click="info(scope.row.docs, scope.row.name)">{{ scope.row.docs }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [{
                name: '第一殿',
                homeman: '秦广王蒋',
                docs: '二月初一诞辰，司人间天寿生死，统管幽冥凶吉。善人寿终，接引超生。功过两半者，交送第十殿发放，仍投人世，男转为女，女转为男。恶多善少者，押赴殿右高台，名曰孽镜台，令之一望，照见在世之心好歹，随即批解第二殿，发狱受苦。'
            },
            {
                name: '第二殿',
                homeman: '楚江王厉',
                docs: '三月初一诞辰，司掌话大地狱，又名剥衣亭塞冰地狱，另设十六小狱。凡在阳间伤人肢体，奸盗杀生者，推入此狱，另发应到何小狱受苦，满期转解第三。殿，加刑发狱。'
            },
            {
                name: '第三殿',
                homeman: '宋帝王余',
                docs: '二月初八诞辰，司掌黑绳大地狱，又名剥戮血池地狱，另设十六小狱。九阳世许逆尊长、教唆兴讼者，推入此狱，另发应至几重小狱受苦，受满转解第四殿，加刑发狱。'
            },
            {
                name: '第四殿',
                homeman: '五官王吕',
                docs: '二月十八日诞辰，司掌合大地狱，又名剥 戮血池地狱，另设十六小狱。凡世人抗粮赖租，交易欺诈者，推入此狱，另再判发小狱受苦，满日送解第五殿察核。'
            },
            {
                name: '第五殿',
                homeman: '阎罗王天子包',
                docs: '正月初八诞辰，前本居第一殿，因怜屈死，屡放还阳伸雪，降调此殿，司掌叫唤大地狱并十六诛心小地狱。凡解到此殿者，押赴望乡台，令之闻见世上本家因罪遭殃各事与蛇食。受苦满日，另发别殿。'
            },
            {
                name: '第六殿',
                homeman: '卞城王毕',
                docs: '三月初八诞辰，司掌大叫唤大地狱及枉死城，另设十六小狱。凡世人怨天尤地、对北溺便涕泣者，发入此狱，查所犯事件，应发何小狱受苦。满日转解第七殿，再查有无别恶。'
            },
            {
                name: '第七殿',
                homeman: '泰山王董',
                docs: '三月二十七诞辰，司掌热恼地狱，又名碓磨肉酱地狱，另设十六小狱。凡阳世取骸合药、离人至戚者，发入此狱，再发何重小狱。受苦日满，转解第八狱，收狱查台。'
            },
            {
                name: '第八殿',
                homeman: '都主王黄',
                docs: '四月初一诞辰，司掌大热恼大地狱，又名热恼闷锅地狱，另设十六小狱。凡在世不孝、使父母翁姑愁闷烦恼者，掷入此狱，再交各小狱加刑。受尽痛苦，解交第十殿，改头换面，永为畜类。，发狱受 苦。'
            },
            {
                name: '第九殿',
                homeman: '平等王陆',
                docs: '四月初八诞辰，司掌丰都城铁网阿鼻地狱，另设十六小狱。凡阳世杀人放火、斩绞正法者，解到本殿，用空心钢柱炼其手足相抱，煽火焚烧，烫烬心府，随发阿鼻地狱受刑，直到被害者个个投生，方准提出，解交第十殿发生六道。'
            },
            {
                name: '第十殿',
                homeman: '转轮王薛',
                docs: '四月十七诞辰，专司各殿解到鬼魂，分别善恶，核定等级。发四大部洲投生。男女寿天，富贵贫贱，逐名详细开载，每月汇知第一殿注册。凡有作孽极恶之鬼，着令更变胎卵湿化，朝生暮死。罪满之后，再复人生，投胎蛮夷之地。凡发往投生者，先令押交孟婆神，忘台下，灌饮汤，使忘前生之事。'
            }
            ]
        }
    },
    methods: {
        info(item, name) {
            this.$alert(item, name, {
                confirmButtonText: '确定',
                callback: action => {
                }
            });
        }
    }

}
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 20px;
}
</style>