<!-- 每日精选商品区域 -->
<script setup lang="ts">
import type { ProductItem } from '@/types/ProductItem'
import { ref } from 'vue'
import { useUserStore } from '@/store'

defineProps<{
  needType: number
  cateName?: string
  productData: ProductItem[]
}>()

// 定义store
const userStore = useUserStore()

// 跳转商品详情
const goDetail = (productId: string) => {
  console.log('go detail', productId)
  // 去详情之前判断是否登录
  if (!userStore.profile._id) {
    return uni.showModal({
      title: '提示',
      content: '登陆后查看详情',
      confirmColor: '#27ba9b',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      },
    })
  }

  // 登录就直接跳转
  uni.navigateTo({
    url: `/pages/productDetail/productDetail?productId=${productId}`,
  })
}

// 点击登录
const login = () => {
  uni.navigateTo({
    url: '/pages/login/login',
  })
}
</script>
<template>
  <!-- 首页 -->
  <view class="productList" v-if="needType === 1">
    <slot></slot>
    <!-- 商品卡片区域 -->
    <view class="proList">
      <view @tap="goDetail(item._id)" class="proCard" v-for="item in productData" :key="item._id">
        <image class="proPic" :src="item.cover" mode="aspectFit"></image>
        <!-- 内容文本区域 -->
        <view class="proText">
          <view class="proName">{{ item.name }}</view>
          <view class="dec">{{ item.dec }}</view>
          <view class="price" v-if="userStore.profile._id">￥{{ item.price.toFixed(2) }}</view>
          <view class="price" v-else @tap="login">登录获取报价</view>
          <view class="addPro">+</view>
        </view>
      </view>
    </view>
  </view>
  <!-- 分类 -->
  <view class="productContent" v-else>
    <view class="title">
      <text>{{ cateName }}</text>
    </view>
    <scroll-view scroll-y="true" class="scroll">
      <view @tap="goDetail(item._id)" class="proList" v-for="item in productData" :key="item._id">
        <image :src="item.cover" mode="aspectFill"></image>
        <view class="text">
          <view class="proName">{{ item.name }}</view>
          <view class="dec">{{ item.dec }}</view>
          <view class="price" v-if="userStore.profile._id">￥{{ item.price }}</view>
          <view class="price" v-else @tap="login">需登录</view>
        </view>
        <view class="addPro">+</view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
/*首页样式*/
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
/*分类样式*/
.productContent {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .title {
    margin: 30rpx 0;
    height: 30rpx;
    text-align: center;
  }
  .scroll {
    height: 840rpx;
    .proList {
      position: relative;
      display: flex;
      margin-bottom: 30rpx;
      height: 200rpx;
      image {
        margin-right: 20rpx;
        width: 200rpx;
        height: 180rpx;
      }
      .text {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-evenly;
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
          font-size: 24rpx;
        }
      }
    }
    .addPro {
      position: absolute;
      bottom: 20rpx;
      right: 20rpx;
      width: 40rpx;
      height: 40rpx;
      line-height: 38rpx;
      color: #fff;
      font-size: 40rpx;
      text-align: center;
      border-radius: 50%;
      background-color: $cx-brandColor;
    }
  }
}
</style>
