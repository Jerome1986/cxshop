<script setup lang="ts">
import { ref } from 'vue'
import { formatTimestamp } from '@/utils/formatTimestamp'
import { adminOrderGetApi, adminOrderUpdateApi, orderGetApi } from '@/api/order'
import { useUserStore } from '@/store'
import type { OrderItem } from '@/types/OrderItem'
import { onLoad } from '@dcloudio/uni-app'

// 定义store
const userStore = useUserStore()

// 订单列表
const orderList = ref<OrderItem[]>([])
const orderListGet = async (status: string) => {
  const res = await adminOrderGetApi(userStore.profile.role, status)
  orderList.value = res.data
}

// 分拣按钮状态
const isDisabled = ref(false)
console.log(isDisabled.value)
const onOrderClick = async (order: OrderItem) => {
  console.log('点击订单:', order)
  const res = await adminOrderUpdateApi(userStore.profile.role, order.status, order._id)
  if (res.code === 200) {
    await orderListGet('待分拣')
    isDisabled.value = true
    await uni.showToast({ icon: 'success', title: '更新成功' })
  }
}

onLoad(() => {
  orderListGet('待分拣')
})
</script>
<template>
  <view class="order-page" v-if="orderList.length">
    <view class="order-item" v-for="order in orderList" :key="order._id">
      <view class="order-header">
        <text class="order-status">{{ order.status }}</text>
        <text class="order-time">{{ formatTimestamp(order.createdAt) }}</text>
      </view>

      <view class="order-products">
        <view class="order-product" v-for="product in order.prolist" :key="product.productId">
          <image :src="product.cover" class="product-img" mode="aspectFill"></image>
          <view class="product-info">
            <view class="product-name">{{ product.productName }}</view>
            <view class="product-dec">{{ product.dec }}</view>
            <view class="product-meta">
              <text class="product-price">￥{{ product.price }}</text>
              <text class="product-qty">x{{ product.quantity }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="order-footer">
        <view class="left">
          <view class="order-total">
            共{{ order.totalNum }}件商品 合计：
            <text class="total-price">￥{{ order.totalPrice }}</text>
          </view>
          <view class="order-delivery">配送时间：{{ order.deliveryTime }}</view>
          <view class="order-mobile">联系方式：{{ order.userMobile }}</view>
        </view>
        <view class="right">
          <button :disabled="isDisabled" class="btn edit-btn" @tap="onOrderClick(order)">
            分拣
          </button>
        </view>
      </view>
    </view>
  </view>
  <view class="order-page order-noView">当前没有订单</view>
</template>

<style lang="scss" scoped>
$order-radius: 16rpx;
$order-padding: 24rpx;

.order-page {
  background-color: $cx-pageBackGroundColor;
  padding: $order-padding;
  min-height: 100vh;
}

.order-noView {
  padding-top: 160rpx;
  text-align: center;
  color: $cx-dec;
}

.order-item {
  background-color: #fff;
  border-radius: $order-radius;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.order-header {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: $cx-dec;
  margin-bottom: 16rpx;

  .order-status {
    color: $cx-brandColor;
    font-weight: bold;
  }
}

.order-products {
  border-top: 1rpx solid #eee;
  border-bottom: 1rpx solid #eee;
}

.order-product {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f1f1f1;

  &:last-child {
    border-bottom: none;
  }

  .product-img {
    width: 120rpx;
    height: 120rpx;
    border-radius: 12rpx;
    flex-shrink: 0;
  }

  .product-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .product-name {
    font-size: 30rpx;
    color: $cx-font-color;
    font-weight: 500;
  }

  .product-dec {
    font-size: 26rpx;
    color: $cx-dec;
    margin-top: 6rpx;
  }

  .product-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 10rpx;

    .product-price {
      color: $cx-price;
      font-size: 28rpx;
      font-weight: bold;
    }

    .product-qty {
      font-size: 26rpx;
      color: $cx-dec;
    }
  }
}

.order-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 16rpx;

  .left {
    .order-total {
      font-size: 28rpx;
      color: $cx-font-color;

      .total-price {
        color: $cx-price;
        font-weight: bold;
      }
    }

    .order-delivery {
      font-size: 24rpx;
      color: $cx-dec;
      margin-top: 8rpx;
    }
    .order-mobile {
      font-size: 24rpx;
      color: $cx-dec;
      margin-top: 8rpx;
    }
  }

  .right {
    .btn {
      font-size: 24rpx;
      border-radius: 8rpx;
    }

    .edit-btn {
      background-color: $cx-brandColor;
      color: #fff;
      font-size: 24rpx;
      padding: 8rpx 16rpx;
      border-radius: 8rpx;
    }
  }
}
</style>
