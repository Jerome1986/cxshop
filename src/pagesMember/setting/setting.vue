<script setup lang="ts">
import { useUserStore } from '@/store'

const userStore = useUserStore()

// 退出登录
const onLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    confirmColor: '#27ba9b',
    success: (result) => {
      if (result.confirm) {
        userStore.clearProfile()
        uni.showToast({
          icon: 'success',
          title: '退出成功',
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 800)
      }
    },
  })
}
</script>

<template>
  <view class="viewport">
    <!-- 列表2 -->
    <view class="list">
      <button hover-class="none" class="item" open-type="feedback">问题反馈</button>
      <button hover-class="none" class="item" open-type="contact">联系我们</button>
    </view>
    <!-- 操作按钮 -->
    <view class="action">
      <view class="button" @tap="onLogout">退出登录</view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: $cx-pageBackGroundColor;
}

.viewport {
  padding: 24rpx;
}

/* 列表 */
.list {
  padding: 0 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  .item {
    line-height: 90rpx;
    padding-left: 10rpx;
    font-size: 30rpx;
    color: #333;
    border-top: 1rpx solid #ddd;
    position: relative;
    text-align: left;
    border-radius: 0;
    background-color: #fff;
    &::after {
      width: auto;
      height: auto;
      left: auto;
      border: none;
    }
    &:first-child {
      border: none;
    }
    &::after {
      right: 5rpx;
    }
  }
}

/* 操作按钮 */
.action {
  text-align: center;
  line-height: 90rpx;
  margin-top: 40rpx;
  font-size: 32rpx;
  color: #333;
  .button {
    background-color: #fff;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
  }
}
</style>
