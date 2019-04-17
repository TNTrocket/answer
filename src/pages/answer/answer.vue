<template>
  <div class="answerContent">
    <div class="header">
      <div class="n_bar">
        <div class=""></div>
      </div>
      <div class="a_time"></div>
      <div class="a_card"></div>
    </div>
  </div>
</template>
<script>
import Api from '@/utils/api'
import utils from '@/utils/index'
import SpinnerLoading from '@/components/spinner/index.vue'
export default {
  data(){
    return{
      orderNo: 0,
      activtyId: '',
      currentQuestion: 0,
      hasAnswerArr: []
    }
  },
  onLoad(options){
    this.orderNo = options.orderNo
    this.activtyId = options.activtyId
  },
  methods:{
    getQuestionList(){
      Api.post('activityContro/getUserRoundsAnswerList', {
        orderNo: this.orderNo,
        activtyId: this.activtyId
      }).then(()=>{

      })
    }
  }
}
</script>
<style lang="less">
.answerContent {
  width: 100%;
  height: 100%;
  background: url('../../../static/images/bg.png');
  background-size: cover;
  overflow-y: auto;
  .header {
    display: flex;
    padding: 30rpx 50rpx 0 50rpx;
    .n_bar {
      width: 460rpx;
      height: 30rpx;
      background: rgba(210, 210, 210, 1);
      border-radius: 16rpx;
    }
  }
}
</style>
