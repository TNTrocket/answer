<template>
  <div class="answerResult">
    <SpinnerLoading :loading="loading"></SpinnerLoading>
    <ResultAlert
      :mode="resultType"
      v-if="!isNeedWait && showModal"
      :resultData="modalData"
      @closeModal="modalClose"
    ></ResultAlert>
    <div class="answerHeaderContent">
      <div class="header">
        <span>第{{orderNo}}轮</span>
        <span class="orderNoName">第二轮标题</span>
      </div>
      <div
        class="headerTips"
        v-if="isNeedWait"
      >
        <div class="right"></div>
        <div class="r_txt">提交成功</div>
        <div class="r_desc">比赛结果即将公布，请耐心等候</div>
        <div class="r_countDown">{{countDownStr}}</div>
      </div>
    </div>
    <div class="answerDetail">
      <div
        class="detailTitle"
        v-if="isNeedWait"
      >
        答题情况
      </div>
      <div class="d_content">
        <div class="d_time">
          <div>用时</div>
          <div class="d_txt">{{detailObj.ansTime}}</div>
        </div>
        <div class="d_score">
          <div>得分</div>
          <div class="d_number">{{detailObj.score}}</div>
        </div>
        <div class="d_rate">
          <div>正确率</div>
          <div class="d_txt">{{detailObj.rightRate}}</div>
        </div>
      </div>
      <div class="d_desc">
        <div>共答{{detailObj.totalCount}}道题</div>
        <div>答对{{detailObj.rightCount}}道题</div>
      </div>
      <div class="d_footer">
        <ul class="d_answerList">
          <li
            v-for="(item, index) in detailObj.subjectList"
            :key="index"
          >
            <div
              class="quan"
              :class="{orange: item.status == 0, green: item.status == 1}"
            >{{item.orderNo}}</div>
          </li>
          <li class="empty"></li>
          <li class="empty"></li>
          <li class="empty"></li>
        </ul>
        <div class="d_f_desc">
          <div class="hadGot">
            <div class="coin">
              <div class="icon"></div>
              <div class="txt">奖励：{{detailObj.goldCoin}}银币</div>
            </div>
            <div class="experience">
              <div class="icon"></div>
              <div class="txt">获得：26学士值</div>
            </div>
          </div>
          <div class="d_f_tips">
            正确率太低了
            建议先去巩固一下基础知识，继续加油哦
          </div>
        </div>
        <div
          class="d_f_btn"
          @click="logoutToAnswer"
        >
          退出答题
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/utils/api'
import utils from '@/utils/index'
import SpinnerLoading from '@/components/spinner/index.vue'
import ResultAlert from './resultAlert.vue'

export default {
  data() {
    return {
      activityId: '',
      orderNo: '',
      detailObj: {},
      countDownStr: '',
      loading: true,
      resultType: '', // 判断是否晋级，根据返回的status
      isNeedWait: false, // 是否需要等待时间
      modalData: {}, //  晋级或失败的弹窗数据
      showModal: false
    }
  },
  components: {
    SpinnerLoading,
    ResultAlert
  },
  onLoad(options) {
    this.activityId = options.activityId
    this.orderNo = options.orderNo
  },
  onShow() {
    this.getDetail()
  },
  onHide() {
    clearInterval(this.timer)
  },
  onUnload() {
    clearInterval(this.timer)
  },
  methods: {
    logoutToAnswer() {
      wx.redirectTo({
        url: `/pages/waitForAnswer/main?activityId=${this.activtyId}&orderNo=${
          this.orderNo
        }`
      })
    },
    modalClose() {
      this.showModal = false
    },
    getDetail() {
      Api.post('activityContro/getUserRoundsAnswerList')
        .then(data => {
          this.detailObj = data
          this.loading = false
          if (this.detailObj.actUser) {
            this.resultType =
              this.detailObj.actUser.status == 1 ? 'success' : 'failure'
          }
          if (this.detailObj.limitTime) {
            this.showModal = false
            this.isNeedWait = true
            clearInterval(this.timer)
            this.countDownStr = utils.formatToMin(
              Number(this.detailObj.limitTime)
            )
            this.timer = setInterval(() => {
              if (this.detailObj.limitTime <= 0) {
                this.getDetail()
                clearInterval(this.timer)
                return
              }
              this.detailObj.limitTime--
              this.countDownStr = utils.formatToMin(
                Number(this.detailObj.limitTime)
              )
            }, 1000)
          } else {
            this.modalData = {
              score: this.detailObj.score,
              rankNo: this.detailObj.actUser.rankNo
            }
            this.isNeedWait = false
            this.showModal = true
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
.answerResult {
  padding: 22rpx 0 0 0;
  .answerHeaderContent {
    .header {
      padding: 0 30rpx;
      font-size: 30rpx;
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
      .orderNoName {
        margin-left: 30rpx;
      }
    }
    .headerTips {
      margin-top: 50rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid rgba(137, 137, 137, 1);
      .right {
        width: 128rpx;
        height: 128rpx;
        background: url('../../../static/images/right.png');
        background-size: 100% 100%;
      }
      .r_txt {
        padding: 30rpx 0;
        font-size: 40rpx;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);
      }
      .r_desc {
        font-size: 30rpx;
        color: rgba(54, 75, 99, 1);
      }
      .r_countDown {
        font-size: 47rpx;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        padding: 50rpx 0 46rpx 0;
      }
    }
  }
  .answerDetail {
    padding-top: 26rpx;
    .detailTitle {
      padding: 0 30rpx;
      font-size: 30rpx;
      font-weight: bold;
    }
    .d_content {
      margin-top: 30rpx;
      display: flex;
      font-size: 30rpx;
      font-weight: 400;
      justify-content: center;
      align-items: center;
      .d_time,
      .d_rate {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .d_txt {
          font-weight: bold;
        }
      }
      .d_score {
        width: 282rpx;
        height: 262rpx;
        margin: 0 30rpx;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: url('../../../static/images/bigOpt.png');
        background-size: cover;
        .d_number {
          color: #ad1313;
          font-size: 60rpx;
          font-weight: bold;
        }
      }
    }
    .d_desc {
      width: 569rpx;
      height: 156rpx;
      margin: 32rpx auto 0 auto;
      background: url('../../../static/images/questionBg.png');
      background-size: cover;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 30rpx;
    }
    .d_footer {
      margin-top: 58rpx;
      background: #f2f2f2;
      padding: 30rpx 30rpx 50rpx 30rpx;
      .d_answerList {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        li {
          width: 20%;
          display: flex;
          justify-content: center;
          margin-bottom: 60rpx;
          &.empty {
            margin: 0;
          }
          .quan {
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
            color: #fff;
            text-align: center;
            line-height: 60rpx;
            &.orange {
              background: #dc8229;
            }
            &.green {
              background: #7ed85b;
            }
          }
        }
      }
      .d_f_desc {
        margin-top: 30rpx;
        padding: 30rpx 30rpx 40rpx 30rpx;
        background: rgba(255, 255, 255, 1);
        border-radius: 20rpx;
        .hadGot {
          display: flex;
          font-size: 28rpx;
          font-weight: bold;
          color: rgba(228, 113, 0, 1);
          justify-content: space-between;
          .coin {
            display: flex;
            justify-content: space-around;
            align-items: center;
            .icon {
              width: 40rpx;
              height: 40rpx;
              background: url('../../../static/images/coin.png');
              background-size: cover;
              margin-right: 20rpx;
            }
          }
          .experience {
            display: flex;
            justify-content: space-around;
            align-items: center;
            .icon {
              width: 63rpx;
              height: 54rpx;
              background: url('../../../static/images/tips1.png');
              background-size: cover;
              margin-right: 20rpx;
            }
          }
        }
        .d_f_tips {
          text-align: center;
          margin-top: 30rpx;
          font-size: 28rpx;
          font-weight: 400;
          color: rgba(36, 36, 36, 1);
        }
      }
      .d_f_btn {
        width: 408rpx;
        height: 80rpx;
        background: url('../../../static/images/lbtn.png');
        background-size: cover;
        margin: 20rpx auto 0 auto;
        color: #fff;
        font-size: 30rpx;
        text-align: center;
        line-height: 80rpx;
      }
    }
  }
}
</style>
