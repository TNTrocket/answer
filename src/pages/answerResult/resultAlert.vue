<template>
  <div class="modalResult">
    <div class="modalResultContent">
      <div
        v-if="mode === 'success'"
        class="success"
      >
        <div class="successContent">
          <div class="title">恭喜您，晋级成功!</div>
          <div class="desc">
            <div class="score">得分：{{resultData.score}}</div>
            <div class="rank">排名: {{resultData.rankNo}}</div>
          </div>
          <div
            class="s_btn"
            @click="toSure"
          >知道了</div>
        </div>
      </div>
      <div
        v-if="mode==='failure'"
        class="failure"
      >
        <div class="failureContent">
          <div class="title">很遗憾，晋级失败</div>
          <div class="desc">
            <div class="score">得分：{{resultData.score}}</div>
            <div class="rank">排名: {{resultData.rankNo}}</div>
          </div>
          <div
            class="s_btn"
            @click="toSure"
          >知道了</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    mode: {
      type: String,
      default: ''
    },
    resultData: {
      type: Object,
      default: {}
    }
  },
  created() {},
  methods: {
    toSure() {
      this.$emit('closeModal')
    }
  }
}
</script>
<style lang="less" scoped>
.modalResult {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 68;
  display: flex;
  justify-content: center;
  align-items: center;
  .failure {
    width: 602rpx;
    height: 474rpx !important;
    background: url('../../../static/images/mfail.png') !important;
    background-size: cover !important;
  }
  .success,
  .failure {
    width: 602rpx;
    height: 590rpx;
    background: url('../../../static/images/s-modal.png');
    background-size: cover;
    position: relative;
    .successContent,
    .failureContent {
      width: 100%;
      position: absolute;
      bottom: 90rpx;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      .title {
        font-size: 40rpx;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);
      }
      .desc {
        margin: 24rpx 0 46rpx 0;
        font-size: 30rpx;
        font-weight: 400;
        color: rgba(54, 75, 99, 1);
        display: flex;
        justify-content: center;
        .score {
          margin-right: 30rpx;
        }
      }
      .s_btn {
        width: 408rpx;
        height: 80rpx;
        background: url('../../../static/images/lbtn.png');
        background-size: cover;
        margin: 0 auto;
        color: #fff;
        line-height: 80rpx;
      }
    }
  }
}
</style>
