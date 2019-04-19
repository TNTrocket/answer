<template>
  <div class="home">
    <SpinnerLoading :loading="loading" />
    <div class="personData">
      <div class="profile">
        <div class="avatarUrlBg"></div>
        <div class="avatarUrl">
          <image
            :src="userInfo.avatarUrl"
            mode="aspectFill"
          ></image>
        </div>
      </div>
      <div class="message">
        <div>
          <div class="name">{{userInfo.nickName}}</div>
          <div class="coin">
            <div class="icon"></div>
            <div class="number">{{answerData.userObj.goldCoin}}</div>
          </div>
          <div class="present"></div>
        </div>
        <div>
          <div class="level">{{answerData.titleName}}</div>
          <div class="bar">
            <div
              class="inPress"
              :style="{width: (answerData.userObj.integralCount/100)*100 + '%'}"
            ></div>
            <div class="barTxt">{{answerData.userObj.integralCount}}/100</div>
          </div>
        </div>
      </div>
    </div>
    <div class="viewTestData">
      <div>
        <div class="viewItem">{{answerData.totalTestDay}}</div>
        <div class="viewTxt">做题天数</div>
      </div>
      <div>
        <div class="viewItem">{{answerData.totalTestCount}}</div>
        <div class="viewTxt">做题数量</div>
      </div>
      <div>
        <div class="viewItem">{{answerData.rightRate}}</div>
        <div class="viewTxt">正确率</div>
      </div>
    </div>
    <div class="activity">
      <div class="tab">
        <div class="title">近期活动</div>
      </div>
      <div class="activityPicture">
        <swiper
          :indicator-dots="indicatorDots"
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
          class="swiper"
          :circular="true"
        >
          <block
            v-for="item in activityList"
            :key="item.id"
          >
            <swiper-item>
              <div @click="goDetail(item)">
                <image
                  :src="item.url"
                  class="slide-image"
                />
              </div>
            </swiper-item>
          </block>
        </swiper>
      </div>
    </div>
    <Auth></Auth>
  </div>
</template>

<script>
import Api from '@/utils/api'
import { mapGetters, mapState, mapActions } from 'vuex'
import Auth from '@/components/getAuthorization/index.vue'
import SpinnerLoading from '@/components/spinner/index.vue'
export default {
  data() {
    return {
      answerData: {},
      loading: true,
      activityList: [],
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  components: {
    Auth,
    SpinnerLoading
  },
  created() {
    this.getAnswerData()
    this.getActivityList()
  },
  methods: {
    getAnswerData() {
      Api.post('activityContro/userMainPage')
        .then(data => {
          console.log('user', this.userInfo)
          this.answerData = data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getActivityList() {
      Api.post('activityContro/getActivityList')
        .then(data => {
          this.activityList = data
        })
        .catch(e => {})
    },
    goDetail(obj) {
      wx.navigateTo({
        url: `/pages/activity/main?activityId=${obj.id}`
      })
    }
  }
}
</script>

<style lang="less">
@images: 'http://172.22.0.18:8880/tpbigch/imagelibrary/images';

.home {
  padding-top: 52rpx;
}

.personData {
  padding: 0 79rpx 0 69rpx;
  display: flex;
  .profile {
    width: 144rpx;
    height: 138rpx;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .avatarUrlBg {
      width: 144rpx;
      height: 138rpx;
      background: url('@{images}/userBg.png');
      background-size: 100% 100%;
    }
    .avatarUrl {
      width: 122rpx;
      height: 122rpx;
      position: absolute;
      z-index: 2;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .message {
    margin-left: 36rpx;
    > div {
      display: flex;
      align-items: center;
    }
    .name {
      font-size: 30rpx;
      font-weight: bold;
    }
    .coin {
      display: flex;
      align-items: center;
      margin-left: 30rpx;
      .icon {
        width: 40rpx;
        height: 40rpx;
        background: url('@{images}/coin.png');
        background-size: 100% 100%;
        margin-right: 12rpx;
      }
      .number {
        font-size: 30rpx;
        font-weight: bold;
        color: rgba(228, 113, 0, 1);
      }
    }
    .present {
      margin-left: 44rpx;
      width: 52rpx;
      height: 46rpx;
      background: url('@{images}/present.png');
      background-size: 100% 100%;
    }
    .level {
      margin-top: 40rpx;
      font-size: 28rpx;
      color: rgba(85, 85, 85, 1);
    }
    .bar {
      margin-top: 40rpx;
      margin-left: 20rpx;
      width: 346rpx;
      height: 26rpx;
      background: rgba(210, 210, 210, 1);
      border-radius: 11rpx;
      position: relative;
      .inPress {
        background: rgba(224, 111, 0, 1);
        height: 100%;
        width: 0;
        transition: width 1s;
        border-top-left-radius: 11rpx;
        border-bottom-left-radius: 11rpx;
      }
      .barTxt {
        position: absolute;
        z-index: 3;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        color: #fff;
        line-height: 1;
        font-size: 24rpx;
      }
    }
  }
}
.viewTestData {
  display: flex;
  margin-top: 42rpx;
  justify-content: space-around;
  border-bottom: 1px solid rgba(137, 137, 137, 1);
  padding-bottom: 50rpx;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    .viewItem {
      font-size: 40rpx;
      color: rgba(228, 113, 0, 1);
      line-height: 1;
      font-weight: bold;
    }
    .viewTxt {
      line-height: 1;
      font-size: 28rpx;
      margin-top: 18rpx;
    }
  }
}
.activity {
  margin-top: 22rpx;
  padding: 0 30rpx;
  .tab {
    .title {
      font-size: 30rpx;
      font-weight: bold;
    }
  }
}
.activityPicture {
  height: 185rpx;
  margin: 20rpx auto 0 auto;
  .swiper {
    height: 185rpx;
  }
  .slide-image {
    width: 689rpx;
    height: 185rpx;
    border-radius: 25rpx;
  }
}
</style>
