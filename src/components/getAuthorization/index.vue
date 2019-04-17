<template>
  <div
    class="mask"
    v-if="!userInfo.nickName"
  >
    <div class="content">
      <div class="text">为了参加活动，请授权信息</div>
      <div>
        <button
          class="btn"
          open-type="getUserInfo"
          lang="zh_CN"
          @getuserinfo="bindUserInfo"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/utils/api'
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  methods: {
    bindUserInfo(e) {
      let userInfo = e.mp.detail.userInfo
      // userInfo存在，点击授权
      if (userInfo) {
        this.setUserInfo(userInfo)
        userInfo.openid = this.userInfo.openid
        Api.post('activityContro/youkeLogin', {
          wxMsgJson: JSON.stringify(userInfo)
        })
      }
    },
     ...mapActions(['setUserInfo'])
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    console.log('created')
  },
}
</script>
<style lang="less" scoped>
.mask {
  position: fixed;
  z-index: 99;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  background: #fff;
  width: 500rpx;
  border-radius: 10rpx;
  .text {
    font-size: 28rpx;
    padding: 30rpx 0;
    text-align: center;
    border-bottom: 1px solid #ebebeb;
  }
  .btn {
    font-size: 30rpx;
    background: #fff;
    appearance: none;
    border-radius: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 10rpx;
    border-bottom-right-radius: 10rpx;
    &:after {
      border: 0;
    }
  }
}
</style>


