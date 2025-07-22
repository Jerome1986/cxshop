<!-- 每日精选商品区域 -->
<script setup lang="ts">
import type { ProductItem } from '@/types/ProductItem'
import { ref } from 'vue'

defineProps<{
  productData: ProductItem[]
}>()

// 跳转商品详情
const goDetail = (productId: string) => {
  console.log('go detail', productId)
}

// 点击登录
const token = ref('')
const login = () => {
  console.log('login')
}
</script>
<template>
  <view class="productList">
    <slot></slot>
    <!-- 商品卡片区域 -->
    <view class="proList">
      <view @tap="goDetail(item._id)" class="proCard" v-for="item in productData" :key="item._id">
        <image class="proPic" :src="item.cover" mode="aspectFill"></image>
        <!-- 内容文本区域 -->
        <view class="proText">
          <view class="proName">{{ item.name }}</view>
          <view class="dec">{{ item.dec }}</view>
          <view class="price" v-if="true">￥{{ item.price.toFixed(2) }}</view>
          <view class="price" v-else @tap="login">登录获取报价</view>
          <view class="addPro">+</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.productList {
  padding-bottom: 40rpx;
  .proList {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .proCard {
      position: relative;
      margin-top: 30rpx;
      width: 343rpx;
      // height: 470rpx;
      background-color: #fff;
      border-radius: 20rpx;
      .proPic {
        width: 100%;
        height: 248rpx;
        border-radius: 20rpx 20rpx 0 0;
      }
      view {
        margin-bottom: 10rpx;
      }
      view:nth-child(3) {
        margin-bottom: 0;
      }
      .proText {
        padding: 20rpx;
        .proName {
          @include ellipsis(1);
          font-size: 28rpx;
          font-weight: 700;
        }
        .dec {
          @include ellipsis(1);
          color: $cx-dec;
          font-size: 24rpx;
        }

        .price {
          color: $cx-price;
          font-size: 28rpx;
        }
      }
      .addPro {
        position: absolute;
        bottom: 10rpx;
        right: 10rpx;
        width: 60rpx;
        height: 60rpx;
        line-height: 55rpx;
        color: #fff;
        font-size: 52rpx;
        text-align: center;
        border-radius: 50%;
        background-color: $cx-brandColor;
      }
    }
  }
}
</style>
