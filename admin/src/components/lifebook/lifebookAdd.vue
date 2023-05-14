<template>
    <div class="main">
        <el-form ref="form" label-width="80px">
            <el-form-item label="姓名">
                <el-input v-model="info.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="info.gender" placeholder="请选择性别">
                    <el-option label="男" value="0"></el-option>
                    <el-option label="女" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="生辰八字">
                <el-input v-model="info.year" placeholder="请输入生辰八字" :show-word-limit="true" maxlength="8"></el-input>
            </el-form-item>
            <el-form-item label="出生时间">
                <el-date-picker @change="changeDateBirthday" v-model="info.birthday" type="datetime" placeholder="选择出生时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="出生地址">
                <el-input v-model="info.birthplace" placeholder="详细出生地址" :show-word-limit="true" maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="死亡时间">
                <el-date-picker @change="changeDateDeathday" v-model="info.deathday" type="datetime" placeholder="选择死亡时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="死亡地址">
                <el-input v-model="info.deathplace" placeholder="详细死亡地址" :show-word-limit="true" maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="寿元">
                <el-input v-model="info.longevity" :disabled="true" placeholder="请选择出生和死亡时间" :show-word-limit="true"
                    maxlength="3"></el-input>
            </el-form-item>
            <el-form-item label="死亡方式">
                <el-select v-model="info.type" placeholder="请选择死亡方式">
                    <el-option label="自然死亡" value="0"></el-option>
                    <el-option label="意外死亡" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="死因">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入死因" v-model="info.reason"
                    :show-word-limit="true" maxlength="200">
                </el-input>
            </el-form-item>
            <el-form-item label="命中财富">
                <el-input v-model="info.money" type="number" placeholder="单位/元，请输入" :show-word-limit="true"
                    maxlength="12"></el-input>
            </el-form-item>
            <el-form-item label="阴财数量">
                <el-input v-model="info.yinmoney" type="number" placeholder="单位/元，请输入" :show-word-limit="true"
                    maxlength="12"></el-input>
            </el-form-item>
            <el-form-item label="阳德">
                <el-input v-model="info.yang" type="number" placeholder="请输入功德数量" :show-word-limit="true"
                    maxlength="15"></el-input>
            </el-form-item>
            <el-form-item label="阴德">
                <el-input v-model="info.yin" type="number" placeholder="请输入阴的数量" :show-word-limit="true"
                    maxlength="15"></el-input>
            </el-form-item>
            <el-form-item label="婚配情况">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="23岁取得一妻子.."
                    :show-word-limit="true" maxlength="500" v-model="info.marriage">
                </el-input>
            </el-form-item>
            <el-form-item label="子女数量">
                <el-input v-model="info.child" type="number" placeholder="单位个"></el-input>
            </el-form-item>

            <el-form-item label="人生大事">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="如高考，中彩票"
                    :show-word-limit="true" maxlength="1200" v-model="info.event">
                </el-input>
            </el-form-item>
            <el-form-item label="人物描述">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="性格，爱好" :show-word-limit="true"
                    maxlength="1200" v-model="info.characterinfo">
                </el-input>
            </el-form-item>
            <el-form-item label="人物属性">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="技术宅，靓仔"
                    :show-word-limit="true" maxlength="500" v-model="info.attribute">
                </el-input>
            </el-form-item>
            <el-form-item label="人生描述">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="这一辈子过得怎么样"
                    :show-word-limit="true" maxlength="1800" v-model="info.description">
                </el-input>
            </el-form-item>
            <el-form-item label="审判奖赏">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="奖下辈子富二代.."
                    :show-word-limit="true" maxlength="800" v-model="info.reward">
                </el-input>
            </el-form-item>
            <el-form-item label="死后情况">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="打入无间地狱10年"
                    :show-word-limit="true" maxlength="200" v-model="info.afterlife">
                </el-input>
            </el-form-item>
            <el-form-item style="width:100%;display: flex;justify-content: flex-end;margin-top: 52px; margin-bottom: 60px;">
                <el-button type="primary" @click="clear" plain style="margin-right:15px;">清空</el-button>
                <el-button type="primary" @click="onSubmit" :disabled="disabled">立即创建</el-button>
            </el-form-item>
        </el-form>
        <div class="tall">
            <p class="title">填写提示</p>
            <span class="info">1. 姓名填写标准姓名，不是小名，如无姓名者，可填写一生中别人称呼最多的名称，可以是叫最多的外号，外号只限于无姓名者</span>
            <span class="info">2. 生辰八字按四柱顺序填写八个字</span>
            <span class="info">3. 出生地址以及死亡地址精确到某县某乡/某镇，例如浙江省台州市天台县南屏乡</span>
            <span class="info">4. 出生时间和死亡时间一般来说精确到小时就可以，这里为了规范精确到秒</span>
            <span class="info">5. 寿元，由出生时间减去死亡时间的年数</span>
            <span class="info">6. 死亡方式分两种，自然死亡和意外死亡，自然死亡一般是指寿终，死因应与死亡方式相对应</span>
            <span class="info">7. 死因填写范例：车祸，被一块饼干噎住；这里需要满足：因 + 死因 + 自然死亡/意外死亡 这句话是通顺的</span>
            <span class="info">8. 命中财富和阴财：活人要花钱死人也是要花钱的，命中的财富表示此人这辈子能赚到的最多的钱，也就是这一辈子中财产的总额，阴财是死后亲人烧的元宝纸钱之类的</span>
            <span class="info">9.
                阳德和阴德：只要是善行，都是积善。但德有“阳德”与“阴德”，阴德是隐藏的德行，与阳善的公开行善是相反的，阴德，是做好事而不为人们所知道，上天会加以赐福；而阳德，则是做好事让人们知道，得到群众的称赞而享有盛名。敲木鱼加的是阳德</span>
            <span class="info">10.
                婚配情况：描述一生中婚姻过程，距离，23岁结婚娶得一妻子得一字，28岁与之离婚，至此孤寡终生，此处也需要填写子女情况，但是只有简写，例如23岁得一子，被流产，28岁得一子</span>
            <span class="info">11. 子女数量：填写此生中所产生的孩子数量，怀了的就算</span>
            <span class="info">12. 人生大事：填写一生中的大事件，例如18岁高考得利进入清华，12岁取得世界技能大赛移动应用开发一等奖，不描述今天过程，只写事件和多少岁发生</span>
            <span class="info">13. 人物描述，填写此人性格，身高体重，特长，喜爱等，例如：身高180，体重120，喜欢敲键盘</span>
            <span class="info">14. 人物属性，填写此人标签，例如：技术宅，健身教练，一般来说使用逗号分隔</span>
            <span class="info">15. 人生描述，此处应该是完整描述这一生，例如：初从文,三年不中;后习武,校场发一矢,中鼓吏,逐之出;遂学医,有所成。自撰一良方,服之,卒。</span>
            <span class="indo">16. 审判奖赏，根据此人这一生的行为赏还是罚，例如奖下辈子富贵一生，罚鞭刑500后打入畜生道轮回，如：打入无间地狱...</span>
            <span class="info">17. 死后情况，此处不是填写葬礼怎么样，此处填写入府之后的情况，如：打入无间地狱....</span>
        </div>
        <el-backtop target=".el-main" :visibility-height="50"></el-backtop>
    </div>
</template>

<script>
export default {
    data() {
        return {
            info: {
                name: '',
                year: '',
                status: '',
                birthday: '',
                deathday: '',
                gender: '',
                birthplace: '',
                deathplace: '',
                photo: '',
                money: '',
                yinmoney: '',
                child: '',
                longevity: '',
                type: '',
                reason: '',
                marriage: '',
                event: '',
                description: '',
                characterinfo: '',
                yin: '',
                yang: '',
                reward: '',
                afterlife: '',
                reincarnation: '',
                attribute: '',
            },
            disabled: false,
            imageUrl: ''
        }
    },
    methods: {
        changeDateDeathday(val) {
            this.info.deathday = this.formatDate(val)
            if (this.info.birthday) {
                //计算寿元
                var birthday = new Date(this.info.birthday);
                var deathday = new Date(this.info.deathday);
                var longevity = deathday.getFullYear() - birthday.getFullYear();
                this.info.longevity = longevity;
            }

        },
        changeDateBirthday(val) {
            this.info.birthday = this.formatDate(val)
            if (this.info.deathday) {
                //计算寿元
                var birthday = new Date(this.info.birthday);
                var deathday = new Date(this.info.deathday);
                var longevity = deathday.getFullYear() - birthday.getFullYear();
                this.info.longevity = longevity;
            }
        },
        onSubmit() {
            //遍历this.info检查是否有空属性
            for (var key in this.info) {
                if (key != 'photo' && key != 'status' && key != 'reincarnation' && this.info[key] === '') {
                    return this.$message.error('请填写完整信息');
                } else if (!isNaN(this.info[key]) && this.info[key] < 0) {
                    return this.$message.error('请填写正确信息');
                }
            }
            //判断info.birthday是否大于info.deathday
            if (this.info.birthday > this.info.deathday) {
                return this.$message.error('出生日期不能大于死亡日期');
            }
            //设置状态
            if (new Date(this.info.birthday) > new Date()) this.info.status = 0
            if (new Date(this.info.birthday) < new Date() && new Date(this.info.deathday) > new Date()) this.info.status = 1
            if (new Date(this.info.deathday) < new Date()) {
                //是轮回还是受刑
                this.info.status = 2
                if (this.info.afterlife.indexOf('轮回') > -1) this.info.status = 3
                if (this.info.afterlife.indexOf('地狱') > -1 || this.info.afterlife.indexOf('地狱') > -1) this.info.status = 4
            }


            const loading = this.$loading({
                lock: true,
                text: '正在添加...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$http.post('admin/lifeBookAdd', this.info).then(res => {
                loading.close();
                if (res.data.code == 200) {
                    this.$message.success('添加成功');
                    this.clear();
                } else {
                    this.$message.error(res.data.msg);
                }
            })

        },
        clear() {
            this.info = {
                name: '',
                year: '',
                status: '',
                birthday: '',
                deathday: '',
                gender: '',
                birthplace: '',
                deathplace: '',
                photo: '',
                money: '',
                yinmoney: '',
                child: '',
                longevity: '',
                type: '',
                reason: '',
                marriage: '',
                event: '',
                description: '',
                characterinfo: '',
                yin: '',
                yang: '',
                reward: '',
                afterlife: '',
                reincarnation: '',
                attribute: '',
            }
        },
        //格式化时间
        formatDate(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            var second = date.getSeconds();
            second = minute < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
        },
    },
    mounted() {

    }
}
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    min-height: 100%;
    background: #fff;
    display: flex;
    justify-content: flex-start;

    .el-form {
        width: 50%;
        padding: 20px;
        box-sizing: border-box;
        text-align: left;
    }

    .photo {
        width: 149px;
        height: 148px;
        border-radius: 6px;
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