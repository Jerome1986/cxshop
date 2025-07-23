<!-- 金刚区一级导航 -->
<script setup lang="ts">
import type { CateItem } from '@/types/CateItem'

defineProps<{
  cateData: CateItem[]
}>()

// 跳转分类
const goNavigation = (cate_id: string) => {
  console.log('goNavigation')
  uni.navigateTo({
    url: '/pages/cate/cateB',
  })
}
</script>

<template>
  <view class="navigation">
    <view class="item" v-for="item in cateData" :key="item._id" @tap="goNavigation(item._id)">
      <image :src="item.cate_imageUrl" mode="aspectFill"></image>
      <text>{{ item.cate_name }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8rpx;
  flex-wrap: wrap;
  padding: 10rpx;
  height: 320rpx;
  border-radius: 20rpx;
  background-color: #fff;
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120rpx;
    height: 140rpx;
    font-size: 24rpx;
    image {
      margin-bottom: 8rpx;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
    }
  }
}
</style>
