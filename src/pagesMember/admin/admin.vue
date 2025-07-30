<script setup lang="ts">
import { ref } from 'vue'
import menuData from '@/pagesMember/config/menuList.json'

const menuList = ref(menuData)

const goPage = (url) => {
  console.log(url)
  uni.navigateTo({
    url,
  })
}
</script>

<template>
  <view class="admin-container">
    <view class="admin-title">后台管理系统</view>
    <view class="menu-list">
      <view class="menu-item" v-for="item in menuList" :key="item.title" @click="goPage(item.path)">
        <view class="menu-title">{{ item.title }}</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.admin-container {
  padding: 40rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.admin-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
  color: $cx-brandColor;
  text-align: center;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.menu-item {
  background-color: #fff;
  padding: 24rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
    background-color: #e6f9f5;
  }

  .menu-title {
    font-size: 32rpx;
    color: #333333;
  }
}
</style>
