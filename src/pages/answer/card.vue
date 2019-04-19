<template>
  <div class="answeCard">
    <div
      class="cardClose"
      @click="closeCard"
    ></div>
    <div class="cardBg">
      <div class="title">
        答题卡
      </div>
      <div class="cardNo">
        <ul>
          <li
            v-for="(item, index) in questionList"
            :key="index"
          >
            <div
              class="quan"
              :class="{active: hadAnswerData[index]}"
              @click="goCurrent(index)"
            >
              {{index + 1}}
            </div>
          </li>
          <li class="empty"></li>
          <li class="empty"></li>
          <li class="empty"></li>
        </ul>
        <div
          class="submitBtn"
          @click="submit"
        >提前交卷</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    questionList: {
      type: Array,
      default: []
    },
    hadAnswerData: {
      type: Array,
      default: []
    }
  },
  created() {},
  methods: {
    closeCard() {
      this.$emit('closeCard')
    },
    submit() {
      this.$emit('cardSubmit')
    },
    goCurrent(index) {
      this.$emit('card:clickInto', index)
    }
  }
}
</script>
<style lang="less" scoped>
.cardClose {
  width: 64rpx;
  height: 64rpx;
  background: url('../../../assets/images/close.png');
  background-size: cover;
  position: absolute;
  top: 30rpx;
  left: 20rpx;
}
.submitBtn {
  margin: 0 auto;
  color: #fff;
  text-align: center;
  line-height: 80rpx;
  width: 409rpx;
  height: 80rpx;
  background: url('../../../assets/images/lbtn.png');
  background-size: cover;
}
.answeCard {
  position: fixed;
  z-index: 88;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #fff;
}
.cardBg {
  padding-top: 34rpx;
  width: 100%;
  height: 100%;
  background: url('../../../assets/images/bg.png');
  background-size: cover;
  overflow-y: auto;
  .title {
    text-align: center;
    font-size: 30rpx;
    color: rgba(54, 75, 99, 1);
  }
}
.cardNo {
  margin-top: 46rpx;
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    li {
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
      .quan {
        width: 76rpx;
        height: 76rpx;
        border: 4rpx solid rgba(225, 111, 0, 1);
        border-radius: 50%;
        font-size: 36rpx;
        font-weight: 400;
        color: rgba(225, 111, 0, 1);
        text-align: center;
        line-height: 76rpx;
        margin-bottom: 40rpx;
        &.active {
          background: rgba(225, 111, 0, 1);
          color: #fff;
        }
      }
      &.empty{
        // width: 0;
      }
    }
  }
}
</style>
