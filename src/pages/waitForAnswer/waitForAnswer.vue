<template>
  <div class="turnContent">
    <SpinnerLoading :loading="loading" />
    <div class="turnList">
      <ul>
        <li
          v-for="(item, index) in turnList"
          :key="item.id"
          :class="{active: item.orderNo == currentNo}"
          @click="changeTurn(item)"
        >
          {{turnListTitle[index]}}
        </li>
      </ul>
    </div>
    <div class="turnContentData">
      <button
        class="shareFriends"
        open-type="share"
      >
        <div class="icon"></div>
        <div class="txt">邀请好友</div>
      </button>
      <div
        class="rankTop"
        v-if="currentTurn.status == 2"
      >
        <div class="icon"></div>
        <div class="txt">排行榜</div>
      </div>
      <div class="t_content">
        <div class="txt_content">
          <div class="title">{{currentTurn.name}}</div>
          <div>开始时间:</div>
          <div class="startTime">{{startTimeStr}}</div>
          <div>结束时间:</div>
          <div class="endTime">{{endTimeStr}}</div>
        </div>
        <div
          class="activityStatus"
          :class="{disableStatus: currentTurn.status == 0 || currentTurn.status == 2, starting: currentTurn.status == 1}"
        >
          {{activityStatusTxt[currentTurn.status] || '未开始'}}
          <div class="triangle"></div>
        </div>
        <!-- 判断是否晋级 -->
        <div
          class="riseStatus"
          v-if="currentTurn.actUser && currentTurn.actUser.status == 1"
        ></div>
      </div>
    </div>
    <div class="answerRule">
      <text>
        {{currentTurn.ruleContent}}
      </text>
    </div>
    <div
      class="answerCondition"
      v-if="currentTurn.status == 2 && currentTurn.isSubmit"
      @click="viewAnswerResult"
    >答题情况</div>
    <div
      class="answerCondition"
      v-if="currentTurn.status == 1 && !currentTurn.isSubmit"
      @click="enterTesting"
    >开始答题</div>
  </div>
</template>
<script>
import Api from '@/utils/api'
import utils from '@/utils/index'
import SpinnerLoading from '@/components/spinner/index.vue'
export default {
  data() {
    return {
      activityId: '',
      loading: true,
      turnList: [],
      currentNo: 1, // 当前轮次
      turnListTitle: ['第一轮', '第二轮', '第三轮', '第四轮'],
      activityStatusTxt: { '0': '未开始', '1': '正在进行', '2': '已结束' }
    }
  },
  components: {
    SpinnerLoading
  },
  computed: {
    currentTurn: function() {
      console.log('currentTurn', this.turnList[this.currentNo - 1])
      return this.turnList[this.currentNo - 1] || {}
    },
    startTimeStr: function() {
      let startTime = this.currentTurn.startTime
        ? Number(this.currentTurn.startTime.time)
        : ''
      return utils.formatTime(new Date(startTime))
    },
    endTimeStr: function() {
      let endTime = this.currentTurn.endTime
        ? Number(this.currentTurn.endTime.time)
        : ''
      return utils.formatTime(new Date(endTime))
    }
  },
  onLoad(options) {
    this.activityId = options.activityId
  },
  onShow() {
    this.getTurnData()
  },
  onHide() {
    clearInterval(this.timer)
  },
  onUnload() {
    clearInterval(this.timer)
  },
  onShareAppMessage() {
    // todo: 设置分享的配置
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      imageUrl: ''
    }
  },
  methods: {
    viewAnswerResult() {
      wx.navigateTo({
        url: `/pages/answerResult/main?activityId=${this.activityId}&orderNo=${
          this.currentNo
        }`
      })
    },
    enterTesting() {
      wx.navigateTo({
        url: `/pages/answer/main?activityId=${
          this.currentTurn.activityId
        }&orderNo=${this.currentTurn.orderNo}`
      })
    },
    getTurnData() {
      Api.post('activityContro/getActivityRoundsList', {
        activityId: this.activityId
      })
        .then(data => {
          this.loading = false
          this.turnList = data || []
          for (let item of this.turnList) {
            if (item.status == 0 || item.status == 1) {
              // 每次进来轮次都会查询最近一次的轮次，并开启定时器，监听是否开始，结束
              this.currentNo = item.orderNo
              this.countTime(item)
              break
            }
          }
        })
        .catch(() => {
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        })
    },
    changeTurn(item) {
      this.currentNo = item.orderNo
    },
    countTime(item) {
      clearInterval(this.timer)
      let countDown = Number(item.startTime.time)
      this.checkActivityStatus(item, countDown)
      this.timer = setInterval(() => {
        countDown += 2000
        this.checkActivityStatus(item, countDown)
      }, 2000)
    },
    checkActivityStatus(activity, time) {
      let startTime = Number(activity.startTime.time)
      let endTime = Number(activity.endTime.time)
      let nowTime = new Date().getTime()
      if (startTime < nowTime && nowTime < endTime) {
        // 正在进行
        activity.status = '1'
      } else if (nowTime > endTime) {
        // 已经结束
        clearInterval(this.timer)
        activity.status = '2'
      }
    }
  }
}
</script>
<style lang="less">
@images: 'http://172.22.0.18:8880/tpbigch/imagelibrary/images';
.turnList {
  background: #fff;
  ul {
    display: flex;
    border-bottom: 1px solid rgba(137, 137, 137, 1);
    justify-content: space-around;
    li {
      padding: 18rpx 0 16rpx 0;
      font-size: 24rpx;
      &.active {
        border-bottom: 4rpx solid rgba(153, 0, 18, 1);
      }
    }
  }
}
.turnContent {
  width: 100%;
  height: 100%;
  background: url('../../../assets/images/bg.png');
  background-size: cover;
  overflow-y: auto;
}
.turnContentData {
  padding-top: 190rpx;
  position: relative;
  　.shareFriends {
    padding: 0;
    font-size: 28rpx;
    position: absolute;
    left: 58rpx;
    font-weight: 400;
    top: 20rpx;
    background: transparent;
    appearance: none;
    text-align: center;
    &:after {
      border: 0;
    }
    .icon {
      width: 113rpx;
      height: 113rpx;
      background: url('../../../assets/images/shareIcon.png');
      background-size: 100% 100%;
      margin-bottom: 10rpx;
    }
  }
  .rankTop {
    font-size: 28rpx;
    position: absolute;
    right: 30rpx;
    font-weight: 400;
    top: 10rpx;
    text-align: center;
    .icon {
      width: 155rpx;
      height: 130rpx;
      background: url('../../../assets/images/top.png');
      background-size: 100% 100%;
      margin-bottom: 10rpx;
    }
  }
}
.t_content {
  margin: 0 146rpx 0 166rpx;
  width: 438rpx;
  height: 408rpx;
  background: url('../../../assets/images/bigOpt.png');
  background-size: 100% 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .txt_content {
    text-align: center;
    font-size: 24rpx;
    .title {
      font-size: 28rpx;
      margin-bottom: 10rpx;
    }
  }
}
.answerRule {
  margin: 40rpx 30rpx 58rpx 82rpx;
  font-size: 30rpx;
}
.answerCondition {
  background: url('../../../assets/images/lbtn.png');
  background-size: 100% 100%;
  width: 410rpx;
  height: 82rpx;
  margin: 0 auto 30rpx auto;
  color: #fff;
  line-height: 82rpx;
  text-align: center;
}
.activityStatus {
  position: absolute;
  left: 30rpx;
  top: 30rpx;
  width: 42rpx;
  padding: 10rpx 0;
  line-height: 42rpx;
  writing-mode: vertical-lr;
  color: #fff;
  font-size: 24rpx;
  &.disableStatus {
    background: rgba(149, 149, 149, 1);
  }
  &.starting {
    background: green;
    .triangle {
      border-top: 20rpx solid green;
    }
  }
  .triangle {
    width: 0;
    height: 0;
    position: absolute;
    bottom: -20rpx;
    left: 0;
    border-left: 21rpx solid transparent;
    border-right: 21rpx solid transparent;
    border-top: 20rpx solid rgba(149, 149, 149, 1);
  }
}
.riseStatus {
  background: url('../../../assets/images/apIcon.png');
  background-size: 100% 100%;
  width: 75rpx;
  height: 172rpx;
  position: absolute;
  top: 10rpx;
  right: 20rpx;
  z-index: 3;
}
</style>


