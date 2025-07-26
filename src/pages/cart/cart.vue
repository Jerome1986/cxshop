<script setup lang="ts">
import { useCartStore, useUserStore } from '@/store'

//定义store
const userStore = useUserStore()
const cartStore = useCartStore()

// 点击选中
const onChecked = (id: string) => {
  console.log('add', id)
  cartStore.isSelected(id)
}

// 减少商品数量
const subProNum = (id: string) => {
  cartStore.decreaseQuantity(id)
}

// 增加商品数量
const addProNum = (id: string) => {
  cartStore.increaseQuantity(id)
}

// 提交订单
const orderSubmit = () => {
  console.log('orderSubmit')
  uni.navigateTo({
    url: '/pagesMember/order/confirmOrder',
  })
}
</script>

<template>
  <scroll-view :scroll-y="true" class="scroll-view">
    <!-- 已登录: 显示购物车 -->
    <template v-if="userStore.profile._id">
      <!-- 购物车列表 -->
      <view class="cart-list" v-if="cartStore.cartList.length">
        <!-- 优惠提示 -->
        <view class="tips">
          <text class="label">满减</text>
          <text class="desc">满1件, 即可享受9折优惠</text>
        </view>
        <!-- 商品项 -->
        <view class="cart-item" v-for="item in cartStore.cartList" :key="item.productId">
          <view class="goods">
            <!-- 选中状态 -->
            <text
              @tap="onChecked(item.productId)"
              class="checkbox"
              :class="{ checked: item.isSelected }"
            ></text>

            <navigator
              :url="`/pages/goods/goods?id=${item.productId}`"
              hover-class="none"
              class="navigator"
            >
              <image mode="aspectFill" class="picture" :src="item.cover"></image>
              <view class="meta">
                <view class="name ellipsis">{{ item.productName }}</view>
                <view class="attrsText ellipsis">{{ item.dec }}</view>
                <view class="price">{{ item.price.toFixed(2) }}</view>
              </view>
            </navigator>

            <!-- 商品数量 -->
            <view class="count">
              <text class="text" @tap="subProNum(item.productId)">-</text>
              <input class="input" disabled="true" type="number" :value="item.quantity" />
              <text class="text" @tap="addProNum(item.productId)">+</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 购物车空状态 -->
      <view class="cart-blank" v-else>
        <image src="/static/blank_cart.png" class="image" />
        <text class="text">购物车还是空的，快来挑选好货吧</text>
        <navigator open-type="switchTab" url="/pages/home/home" hover-class="none">
          <button class="button">去首页看看</button>
        </navigator>
      </view>
      <!-- 吸底工具栏 -->
      <view class="toolbar" v-if="cartStore.cartTotal">
        <text class="text">合计:</text>
        <text class="amount">{{ cartStore.cartTotal.toFixed(2) }}</text>
        <view class="button-group">
          <view @tap="orderSubmit" class="button payment-button"> 提交订单 </view>
        </view>
      </view>
    </template>
    <!-- 未登录: 提示登录 -->
    <view class="login-blank" v-else>
      <text class="text">登录后可查看购物车中的商品</text>
      <navigator url="/pages/login/login" hover-class="none">
        <button class="button">去登录</button>
      </navigator>
    </view>
    <!-- 底部占位 -->
    <view class="toolbar-height"></view>
  </scroll-view>
</template>

<style lang="scss" scoped>
// 滚动容器
.scroll-view {
  height: 100vh;
  background-color: $cx-pageBackGroundColor;
  overflow-y: auto;
}

.cart-list {
  padding: 20rpx;
  background-color: #f8f8f8;

  .tips {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    font-size: 24rpx;
    color: #666;

    .label {
      background-color: $cx-brandColor;
      color: #fff;
      padding: 4rpx 12rpx;
      border-radius: 6rpx;
      margin-right: 10rpx;
      font-weight: bold;
    }

    .desc {
      flex: 1;
      color: #333;
    }
  }

  .cart-item {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .goods {
      display: flex;
      align-items: center;
      position: relative;

      .checkbox {
        width: 40rpx;
        height: 40rpx;
        border: 2rpx solid #ccc;
        border-radius: 50%;
        margin-right: 20rpx;

        &.checked {
          background-color: $cx-brandColor;
          border-color: $cx-brandColor;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            left: 12rpx;
            top: 8rpx;
            width: 10rpx;
            height: 18rpx;
            border: solid #fff;
            border-width: 0 4rpx 4rpx 0;
            transform: rotate(45deg);
          }
        }
      }

      .navigator {
        display: flex;
        flex: 1;

        .picture {
          width: 160rpx;
          height: 160rpx;
          border-radius: 8rpx;
          margin-right: 20rpx;
        }

        .meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .name {
            font-size: 28rpx;
            font-weight: 600;
            color: #333;
          }

          .attrsText {
            font-size: 24rpx;
            color: #999;
            margin: 8rpx 0;
          }

          .price {
            font-size: 28rpx;
            color: $cx-price;
            font-weight: bold;
          }
        }
      }

      .count {
        display: flex;
        align-items: center;
        margin-left: 20rpx;

        .text {
          width: 50rpx;
          height: 50rpx;
          text-align: center;
          line-height: 50rpx;
          background-color: #f0f0f0;
          font-size: 30rpx;
          color: #333;
        }

        .input {
          width: 60rpx;
          height: 50rpx;
          text-align: center;
          border: 1rpx solid #ccc;
          border-left: none;
          border-right: none;
        }
      }
    }
  }
}

// 空状态
.cart-blank,
.login-blank {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60vh;
  .image {
    width: 400rpx;
    height: 281rpx;
  }
  .text {
    color: #444;
    font-size: 26rpx;
    margin: 20rpx 0;
  }
  .button {
    width: 240rpx !important;
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 20rpx;
    font-size: 26rpx;
    border-radius: 60rpx;
    color: #fff;
    background-color: #27ba9b;
  }
}

// 吸底工具栏
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--window-bottom);
  z-index: 1;

  height: 100rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  border-top: 1rpx solid #ededed;
  background-color: #fff;

  .text {
    margin-right: 8rpx;
    margin-left: 32rpx;
    color: #444;
    font-size: 14px;
  }

  .amount {
    font-size: 40rpx;
    color: $cx-price;

    .decimal {
      font-size: 24rpx;
    }

    &::before {
      content: '￥';
      font-size: 24rpx;
    }
  }

  .button-group {
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    text-align: center;
    line-height: 72rpx;
    font-size: 24rpx;
    color: #fff;

    .button {
      width: 240rpx;
      margin: 0 10rpx;
      border-radius: 72rpx;
    }

    .payment-button {
      background-color: $cx-brandColor;

      &.disabled {
        opacity: 0.6;
      }
    }
  }
}

// 底部占位空盒子
.toolbar-height {
  height: 100rpx;
}
</style>
