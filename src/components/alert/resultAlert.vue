<template>
  <div class="modalResult">
    <div
      class="modalResultContent"
      :class="{success: mode === 'success', fail: mode === 'fail'}"
    ></div>
  </div>
</template>
<script>
export default {
  props: {
    mode: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="less">
.modalResult {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.modalResultContent {
  width: 602rpx;
  height: 474rpx;
}
.success {
}
</style>
