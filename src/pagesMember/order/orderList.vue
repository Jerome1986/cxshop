<script setup lang="ts">
import { ref } from 'vue'
import { orderDelApi, orderGetApi } from '@/api/order'
import { useUserStore } from '@/store'
import type { OrderItem } from '@/types/OrderItem'
import { formatTimestamp } from '@/utils/formatTimestamp'
import { onLoad } from '@dcloudio/uni-app'

const query = defineProps({
  orderStatus: String,
})

// 定义store
const userStore = useUserStore()

// 获取安全距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// tabs 数据
const orderTabs = ref([
  { orderState: 0, title: '全部' },
  { orderState: 1, title: '待分拣' },
  { orderState: 2, title: '待收货' },
  { orderState: 3, title: '已完成' },
])
// 高亮下标
const activeIndex = ref(orderTabs.value.findIndex((v) => v.title === query.orderStatus))
// 所有订单
const orderList = ref<OrderItem[]>([])
// 获取订单
const orderListGet = async (userId: string, orderStatus: string) => {
  const res = await orderGetApi(userId, orderStatus)
  orderList.value = res.data
}
// 切换分类
const onChange = (index: number) => {
  console.log('onChange', index, orderTabs.value[index].title)
  activeIndex.value = index
  orderListGet(userStore.profile._id, orderTabs.value[index].title)
}
// 滑动获取下标 赋值并渲染
const changeSwiper = (e: any) => {
  activeIndex.value = e.detail.current
  // todo 滑动时渲染列表
  orderListGet(userStore.profile._id, orderTabs.value[activeIndex.value].title)
}

// 删除订单
const onDel = (orderId: string) => {
  console.log('onDel', orderId)
  uni.showModal({
    title: '提示',
    content: '确定要删除当前订单吗？',
    confirmColor: '#27ba9b',
    success: async (result) => {
      if (result.confirm) {
        const res = await orderDelApi(userStore.profile._id, orderId)
        console.log(res)
        if (res.code === 200) {
          await orderListGet(userStore.profile._id, orderTabs.value[activeIndex.value].title)
          await uni.showToast({
            icon: 'success',
            title: '删除成功',
          })
        }
      }
    },
  })
}

// 签收
const qianshou = (orderId: string) => {
  // 签收后订单改为已完成
  console.log('qianshou', orderId)
}

onLoad(() => {
  orderListGet(userStore.profile._id, query.orderStatus)
})
</script>
<template>
  <view class="viewport">
    <!-- tabs -->
    <view class="tabs">
      <text
        v-for="(item, index) in orderTabs"
        @tap="onChange(index)"
        class="item"
        :key="item.orderState"
      >
        {{ item.title }}
      </text>
      <!-- 游标 -->
      <view class="cursor" :style="{ left: activeIndex * 25 + '%' }"></view>
    </view>
    <!-- 滑动容器 -->
    <swiper class="swiper" :current="activeIndex" @change="changeSwiper">
      <!-- 滑动项 -->
      <swiper-item v-for="item in orderTabs" :key="item.orderState">
        <!-- 订单列表 -->
        <scroll-view scroll-y="true" class="orders">
          <view class="card" v-for="k in orderList" :key="k._id">
            <!-- 订单信息 -->
            <view class="status">
              <text class="date">{{ formatTimestamp(k.createdAt) }}</text>
              <!-- 订单状态文字 -->
              <text>{{ k.status }}</text>
              <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
              <text class="icon-delete" @tap="onDel(k._id)"></text>
            </view>
            <!-- 商品信息，点击商品跳转到订单详情，不是商品详情 -->
            <navigator
              v-for="sku in k.prolist"
              :key="sku.productId"
              class="goods"
              :url="`/pagesOrder/detail/detail?id=${sku.productId}`"
              hover-class="none"
            >
              <view class="cover">
                <image mode="aspectFill" :src="sku.cover"></image>
              </view>
              <view class="meta">
                <view class="name ellipsis">{{ sku.productName }}</view>
                <view class="type">{{ sku.dec }}</view>
              </view>
              <text style="color: #999; font-size: 28rpx; margin: 40rpx">x{{ sku.quantity }}</text>
            </navigator>
            <!-- 支付信息 -->
            <view class="payment">
              <text class="quantity">共{{ k.totalNum }}件商品</text>
              <text>合计</text>
              <text class="amount">
                <text class="symbol">¥</text>
                {{ k.totalPrice.toFixed(2) }}
              </text>
            </view>
            <view class="qianshou" v-if="activeIndex === 2 && orderList.length > 0">
              <button @tap="qianshou(k._id)" size="mini">签收</button>
            </view>
          </view>

          <!-- 底部提示文字 -->
          <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
            {{ '没有更多数据~' }}
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

// tabs
.tabs {
  display: flex;
  justify-content: space-around;
  line-height: 60rpx;
  margin: 0 10rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;

  .item {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    font-size: 28rpx;
    color: #262626;
  }

  .cursor {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 25%;
    height: 6rpx;
    padding: 0 50rpx;
    background-color: #27ba9b;
    /* 过渡效果 */
    transition: all 0.4s;
  }
}

// swiper
.swiper {
  background-color: #f7f7f8;
}

// 订单列表
.orders {
  .card {
    min-height: 100rpx;
    padding: 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;

    &:last-child {
      padding-bottom: 40rpx;
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 15rpx;

    .date {
      color: #666;
      flex: 1;
    }

    .primary {
      color: #ff9240;
    }

    .icon-delete {
      line-height: 1;
      margin-left: 10rpx;
      padding-left: 10rpx;
      border-left: 1rpx solid #e3e3e3;
    }
  }

  .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      position: relative;
      image {
        width: 100%;
        height: 100%;
      }
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      line-height: 1;
      padding: 6rpx 4rpx 6rpx 8rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 10rpx 0 0 0;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .more {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #333;
    }
  }

  .payment {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1;
    padding: 20rpx 0;
    text-align: right;
    color: #999;
    font-size: 28rpx;
    border-bottom: 1rpx solid #eee;

    .quantity {
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .amount {
      color: #444;
      margin-left: 6rpx;
    }

    .symbol {
      font-size: 20rpx;
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20rpx;

    .button {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }

    .secondary {
      color: #27ba9b;
      border-color: #27ba9b;
    }

    .primary {
      color: #fff;
      background-color: #27ba9b;
    }
  }
  .qianshou {
    padding: 40rpx;
    text-align: end;
  }
  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
