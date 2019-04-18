<template>
  <div>
    <div class="activityHeader">
      <div class="headerBg">
        <image
          :src="activityDetail.url"
          mode="aspectFill"
        ></image>
      </div>
      <div class="title">{{activityDetail.name}}</div>
      <div class="time">活动时间：{{activityDetail.startTimeStr}} - {{activityDetail.endTimeStr}}</div>
      <div class="signUp">{{activityDetail.accessNum}}人报名</div>
    </div>
    <div class="activityDesc">
      <div class="title">活动介绍</div>
      <div
        class="descContent"
        v-html="activityDetail.content"
      >
      </div>
    </div>
    <div class="btns">
      <div class="shareFrends">
        <button>邀请好友</button>
      </div>
      <div
        class="signUp"
        @click="goSignUp"
        v-if="!activityDetail.isAccess"
      >
        <div class="btn">立即报名</div>
      </div>
      <div
        class="enter"
        @click="enterActivity"
        v-if="activityDetail.isAccess"
      >
        <div class="btn">进入活动</div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/utils/api'
export default {
  data() {
    return {
      activityDetail: {},
      activityId: ''
    }
  },
  onLoad(option) {
    this.activityId = option.activityId
  },
  onShow() {
    this.getDetailData()
  },
  methods: {
    getDetailData() {
      Api.post('activityContro/getActivityDetail', {
        activityId: this.activityId
      }).then(data => {
        this.activityDetail = data
      })
    },
    goSignUp() {
      Api.post('activityContro/saveActivityUser', {
        activityId: this.activityId
      }).then(data => {
        this.enterActivity()
      })
    },
    enterActivity() {
      wx.navigateTo({
        url: `/pages/waitForAnswer/main?activityId=${this.activityId}`
      })
    }
  }
}
</script>
<style lang="less">
@images: 'http://172.22.0.18:8880/tpbigch/imagelibrary/images';
.activityHeader {
  padding-bottom: 20rpx;
  border-bottom: 1px solid rgba(137, 137, 137, 1);
  position: relative;
  .headerBg {
    image {
      width: 750rpx;
      height: 344rpx;
    }
  }
  .title {
    padding: 0 30rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
  }
  .time {
    margin: 10rpx 0 0 30rpx;
    font-size: 24rpx;
    font-weight: 400;
  }
  .signUp {
    position: absolute;
    right: 30rpx;
    bottom: 30rpx;
    font-size: 28rpx;
    font-weight: 400;
  }
}
.activityDesc {
  margin: 30rpx 30rpx 0 30rpx;
}
.btns {
  width: 100%;
  position: fixed;
  bottom: 88rpx;
  font-size: 30rpx;
  z-index: 33;
  display: flex;
  justify-content: space-around;
  color: #fff;
  button {
    appearance: none;
    width: 228rpx;
    height: 82rpx;
    font-size: 30rpx;
    background: url('@{images}/dbtn.png');
    background-size: 100% 100%;
    color: #fff;
    &:after {
      border: 0;
    }
  }
  .btn {
    text-align: center;
    line-height: 82rpx;
    width: 228rpx;
    height: 82rpx;
    background: url('../../../static/images/s_btn.png');
    background-size: 100% 100%;
  }
}
</style>

