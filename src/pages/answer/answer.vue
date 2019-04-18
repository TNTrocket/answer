<template>
  <div class="answerContent">
    <SpinnerLoading :loading="loading"></SpinnerLoading>
    <AlertModal></AlertModal>
    <AnswerCard
      :questionList="questionList"
      :hadAnswerData="hasAnswerArr"
      @card:clickInto="cardIntoCurrent"
      @closeCard="cardClose"
      @cardSubmit="submitAnswer"
      v-if="questionList.length > 0 && showCard"
    ></AnswerCard>
    <div class="header">
      <div class="n_bar">
        <div
          class="barProess"
          :class="{rightCircular: currentQuestion+1 === questionList.length}"
          :style="{width: barProess}"
        ></div>
        <div class="barTxt"> {{currentQuestion + 1}}/{{questionList.length}}</div>
      </div>
      <div class="a_time">{{limitTimeTxt}}</div>
      <div
        class="a_card"
        @click="viewAnswerRecord"
      ></div>
    </div>
    <div class="quenstionContent">
      <div class="topic">
        <div class="titleBg">{{currentQuestionObj.question}}</div>
        <div class="t_tips">请接诗词的下一句</div>
      </div>
      <div class="useInput">
        <ul>
          <li
            v-for="(item, index) in inputList"
            :key="index"
            @click="changeInput(index)"
          >{{inputAnswer[index]}}</li>
        </ul>
      </div>
      <div class="options">
        <ul>
          <li
            v-for="(item, index) in optionList"
            :key="index"
            @click="changeAnswer(item, index)"
            :class="{liHidden: item.click}"
          >{{item.txt}}</li>
        </ul>
      </div>
    </div>
    <div class="btnsBar">
      <div
        class="prev"
        v-if="currentQuestion > 0"
        @click="goPrev"
      >上一题</div>
      <div
        class="submitBtn"
        @click="toSubmitAnswer"
      >提前交卷</div>
      <div
        class="next"
        v-if="currentQuestion + 1 < questionList.length"
        @click="goNext"
      >下一题</div>
    </div>
  </div>
</template>
<script>
import Api from '@/utils/api'
import utils from '@/utils/index'
import SpinnerLoading from '@/components/spinner/index.vue'
import AnswerCard from '@/components/answer/card.vue'
import AlertModal from '@/components/alert/index.vue'
export default {
  data() {
    return {
      orderNo: 0, // 轮次
      activtyId: '',
      currentQuestion: 0, // 当前题目的下标
      questionList: [], // 题目list
      limitTime: 0, // 倒计时
      limitTimeTxt: '',
      inputAnswer: '', // 展示的输入
      hasAnswerArr: [], // 收集每次作答的输入
      loading: true,
      showCard: false
    }
  },
  components: {
    SpinnerLoading,
    AnswerCard,
    AlertModal
  },
  computed: {
    barProess: function() {
      let allNumber = this.questionList.length || 1
      let current = this.currentQuestion + 1
      let perent = (current / allNumber * 100).toFixed(2) + '%'
      return perent
    },
    currentQuestionObj: function() {
      return this.questionList[this.currentQuestion] || {}
    },
    inputList: function() {
      let inputLength = this.currentQuestionObj.answer
        ? this.currentQuestionObj.answer.length
        : 0
      let temp = []
      for (let i = 0; i < inputLength; i++) {
        temp.push(i)
      }
      return temp
    },
    optionList: function() {
      let options = this.currentQuestionObj.optionList || []
      options = options.map(item => {
        return { txt: item }
      })
      return options
    }
  },
  watch: {
    currentQuestion: function(value) {
      this.inputAnswer = this.hasAnswerArr[this.currentQuestion]
        ? this.hasAnswerArr[this.currentQuestion].answer
        : ''
    }
  },
  onLoad(options) {
    this.orderNo = options.orderNo
    this.activtyId = options.activtyId
    this.getQuestionList()
  },
  mounted() {},
  methods: {
    submitAnswer() {
      this.toSubmitAnswer().then(() => {
        this.cardClose()
      })
    },
    toSubmitAnswer() {
      return this.customAlert({
        content: '答题时间还未用完，确定提交答卷吗？',
        okText: '提交答卷',
        cancelText: '暂不提交',
        onSure: () => {
          this.finalSumit()
        },
        onCancel: () => {}
      })
    },
    finalSumit() {
      // todo: 提交所有作答的答案
      console.log('finalSubmit')
    },
    // 自定义弹窗
    customAlert(alertObj) {
      let action = {}
      this.$emit('alert:show', {
        ...alertObj,
        okCallback: () => {
          alertObj.onSure()
          action.reslove()
        },
        cancelCallback: () => {
          alertObj.onCancel && alertObj.onCancel()
          action.reject()
        }
      })
      return new Promise((reslove, reject) => {
        action = {
          reslove,
          reject
        }
      })
    },
    // 答题卡关闭
    cardClose() {
      this.showCard = false
    },
    // 答题卡里点击题目跳转
    cardIntoCurrent(index) {
      this.currentQuestion = index
      this.showCard = false
    },
    // 收集所有答过的答案
    collectAllAnswer() {
      this.hasAnswerArr[this.currentQuestion] = {
        idNo: this.currentQuestion,
        answer: this.inputAnswer
      }
    },
    // 上一题
    goPrev() {
      if (this.currentQuestion <= 0) {
        this.currentQuestion = 0
      }
      this.currentQuestion--
    },
    // 下一题
    goNext() {
      if (this.currentQuestion >= this.questionList.length) {
        this.currentQuestion = this.questionList.length
      }
      this.currentQuestion++
    },
    // 点击选项
    changeAnswer(item) {
      let index = this.inputAnswer.indexOf(' ')
      if (index < 0 && this.inputAnswer.length === this.inputList.length) {
        return
      }
      item.click = true
      if (index >= 0) {
        this.inputAnswer = this.replaceString(this.inputAnswer, index, item.txt)
      } else {
        this.inputAnswer = this.inputAnswer + item.txt
      }
      this.collectAllAnswer()
    },
    replaceString(answerStr, index, newStr) {
      let startIndex = 0
      let forntStr = answerStr.substring(startIndex, index)
      let afterStr = answerStr.substr(index + 1)
      return `${forntStr}${newStr || ' '}${afterStr}`
    },
    checkOption(opt) {
      this.optionList.map(item => {
        if (item.txt === opt) {
          item.click = false
        }
      })
    },
    // 点击输入框
    changeInput(index) {
      if (!this.inputAnswer[index]) {
        return
      } else {
        this.checkOption(this.inputAnswer[index])
        this.inputAnswer = this.replaceString(this.inputAnswer, index)
      }
    },
    viewAnswerRecord() {
      this.showCard = true
    },
    // 获取题目list
    getQuestionList() {
      Api.post('activityContro/getActivityRoundSubjectList', {
        orderNo: this.orderNo,
        activtyId: this.activtyId
      })
        .then(data => {
          this.questionList = data.questionList || []
          this.limitTime = data.limitTime || 0
          this.limitTimeTxt = utils.formatToMin(this.limitTime)
          this.countDown()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 倒计时到了的弹窗
    countDownModal() {
      this.customAlert({
        content: '答题时间到，已自动提交答卷',
        okText: '我知道了',
        onSure: () => {
          this.finalSumit()
        }
      })
    },
    // 倒计时
    countDown() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.limitTime <= 0) {
          clearInterval(this.timer)
          this.countDownModal()
        } else {
          this.limitTime = this.limitTime - 1
          this.limitTimeTxt = utils.formatToMin(this.limitTime)
        }
      }, 1000)
    }
  }
}
</script>
<style lang="less">
.liHidden {
  visibility: hidden;
}
.rightCircular {
  border-bottom-right-radius: 16rpx;
  border-top-right-radius: 16rpx;
}
.answerContent {
  width: 100%;
  height: 100%;
  background: url('../../../static/images/bg.png');
  background-size: cover;
  overflow-y: auto;
  .header {
    display: flex;
    align-items: center;
    padding: 30rpx 50rpx 0 50rpx;
    .n_bar {
      width: 460rpx;
      height: 30rpx;
      background: rgba(210, 210, 210, 1);
      border-radius: 16rpx;
      position: relative;
      .barProess {
        height: 30rpx;
        width: 0;
        background: rgba(224, 111, 0, 1);
        border-top-left-radius: 16rpx;
        border-bottom-left-radius: 16rpx;
        transition: width 1s;
      }
      .barTxt {
        font-size: 24rpx;
        color: #fff;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .a_time {
      font-size: 30rpx;
      font-weight: 400;
      margin-left: 34rpx;
      color: rgba(132, 93, 50, 1);
    }
    .a_card {
      margin-left: 40rpx;
      width: 42rpx;
      height: 42rpx;
      background: url('../../../static/images/tips2.png');
      background-size: cover;
    }
  }
  .quenstionContent {
    margin-top: 62rpx;
    .topic {
      .titleBg {
        width: 644rpx;
        height: 178rpx;
        line-height: 178rpx;
        font-weight: bold;
        margin: 0 auto;
        background: url('../../../static/images/questionBg.png');
        background-size: cover;
        text-align: center;
        font-size: 44rpx;
        color: rgba(132, 93, 50, 1);
      }
      .t_tips {
        margin-top: 6rpx;
        font-size: 28rpx;
        color: rgba(153, 110, 65, 1);
        text-align: center;
      }
    }
    .useInput {
      margin-top: 54rpx;
      ul {
        width: 100%;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        li {
          width: 96rpx;
          height: 92rpx;
          line-height: 92rpx;
          background: url('../../../static/images/aitem.png');
          background-size: cover;
          text-align: center;
          font-size: 44rpx;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
    .options {
      margin: 82rpx 152rpx 80rpx 152rpx;
      ul {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        li {
          width: 96rpx;
          height: 92rpx;
          line-height: 92rpx;
          background: url('../../../static/images/aoption.png');
          background-size: cover;
          text-align: center;
          font-size: 34rpx;
          font-weight: 400;
          color: rgba(132, 93, 50, 1);
          margin-bottom: 30rpx;
        }
      }
    }
  }
}
.btnsBar {
  display: flex;
  justify-content: space-around;
  .prev,
  .next {
    width: 188rpx;
    height: 74rpx;
    border: 2rpx solid rgba(153, 110, 65, 1);
    border-radius: 37rpx;
    font-weight: 400;
    color: rgba(132, 93, 50, 1);
    font-size: 30rpx;
    text-align: center;
    line-height: 74rpx;
  }
  .submitBtn {
    width: 266rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: url('../../../static/images/submitBg.png');
    background-size: 100% 100%;
    font-size: 30rpx;
    font-weight: 400;
    text-align: center;
    color: #fff;
  }
}
</style>
