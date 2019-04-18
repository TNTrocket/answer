<template>
  <div
    class="alertModal"
    v-if="show"
  >
    <div class="alertContent">
      <div
        class="title"
        v-if="alertObj.title"
      >{{alertObj.title}}</div>
      <div
        class="content"
        v-if="alertObj.content"
      >{{alertObj.content}}</div>
      <div class="btns">
        <div
          class="cancelBtn"
          v-if="alertObj.cancelText"
          @click="cancelModal"
        >{{alertObj.cancelText}}</div>
        <div
          class="okBtn"
          @click="okModal"
        >{{alertObj.okText}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      alertObj: {
        title: '',
        content: 'test',
        okText: '确定',
        cancelText: '',
        okCallback: function() {},
        cancelCallback: function() {}
      }
    }
  },
  created() {
    this.$parent.$on('alert:show', obj => {
      this.show = true
      this.alertObj = {
        ...this.alertObj,
        ...obj
      }
    })
  },
  methods: {
    modalHide() {
      this.show = false
      this.alertObj = {
        title: '',
        content: 'test',
        okText: '确定',
        cancelText: '',
        okCallback: function() {},
        cancelCallback: function() {}
      }
    },
    okModal() {
      this.alertObj.okCallback()
      this.modalHide()
    },
    cancelModal() {
      this.alertObj.cancelCallback()
      this.modalHide()
    }
  }
}
</script>
<style lang="less" scoped>
.alertModal {
  position: fixed;
  z-index: 999;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .alertContent {
    width: 500rpx;
    background: #fff;
    text-align: center;
    border-radius: 20rpx;
    .title {
      padding: 20rpx;
      font-size: 34rpx;
    }
    .content {
      font-size: 28rpx;
      padding: 40rpx 20rpx;
      border-bottom: 1px solid #ebebeb;
    }
    .btns {
      display: flex;
      text-align: center;
      .cancelBtn {
        border-right: 1px solid #ebebeb;
      }
      > div {
        font-size: 30rpx;
        padding: 30rpx;
        flex: 1;
      }
    }
  }
}
</style>
