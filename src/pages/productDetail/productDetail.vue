<script setup lang="ts">
import { ref } from 'vue'
import { getProductByIdApi } from '@/api/product'
import { onLoad } from '@dcloudio/uni-app'
import type { ProductItem } from '@/types/ProductItem'
import Products from '@/components/Products.vue'
import { useCartStore, useProductStore, useUserStore } from '@/store'
import type { CartItem } from '@/types/cart'
import { userLoveApi, userLoveCheckApi } from '@/api/user'

//获取安全距离
const { safeAreaInsets } = uni.getSystemInfoSync()
//根据商品id获取商品详情
const productData = ref<ProductItem | null>(null)
const getProductData = async (productId: string) => {
  const res = await getProductByIdApi(productId)
  productData.value = res.data
}

// 定义store
const cartStore = useCartStore()
const userStore = useUserStore()
// 获取商品store -- 直接用于热门商品数据
const productStore = useProductStore()
// 当前轮播图
const current = ref(0)
// 轮播图改变时
const onchange = (e: any) => {
  console.log('current', e)
}

// 加入购物车
const addCart = () => {
  console.log('addCart')

  // 构建参数
  const proParams: CartItem = {
    userId: userStore.profile._id,
    productId: productData.value?._id || '',
    productName: productData.value?.name || '',
    dec: productData.value?.dec || '',
    price: productData.value?.price || 0,
    quantity: 1,
    cover: productData.value?.cover || '',
    isSelected: true,
  }

  cartStore.addCartShop(proParams)
  uni.showToast({
    icon: 'success',
    title: '添加成功',
    mask: true,
  })
}

// 处理点击立即购买
const buyNow = () => {
  console.log('buyNow')
  // 构建参数
  const proParams: CartItem = {
    userId: userStore.profile._id,
    productId: productData.value?._id || '',
    productName: productData.value?.name || '',
    dec: productData.value?.dec || '',
    price: productData.value?.price || 0,
    quantity: 1,
    cover: productData.value?.cover || '',
    isSelected: true,
  }
  // 1.将当前商品加入购物车
  cartStore.addCartShop(proParams)
  // 2.跳转到购物车页面
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/cart/cart',
    })
  }, 800)
}

const islove = ref(false)

// 检查用户是否点赞
const checkUserLove = async (userId: string, productId: string) => {
  const res = await userLoveCheckApi(userId, productId)
  console.log('检查点赞', res)
  if (!res.data) {
    islove.value = false
  } else {
    islove.value = res.data.islove
  }
}

// 处理收藏点赞
const handleLove = async () => {
  const res = await userLoveApi(userStore.profile._id, productData.value._id, islove.value)
  console.log('点赞结果', res)
  if (res.code === 200) {
    islove.value = res.data.islove
    await uni.showToast({
      icon: 'success',
      title: res.message,
      mask: true,
    })
  }
}

// 定义页面参数类型
interface ProductPageOptions {
  productId: string
}

// 获取页面参数
onLoad(async (query) => {
  const options = query as ProductPageOptions
  console.log(options, userStore.profile._id)
  await Promise.all([
    getProductData(options.productId),
    checkUserLove(userStore.profile._id, options.productId),
  ])
})
</script>

<template>
  <scroll-view :scroll-y="true" class="viewport" style="padding-bottom: 90px">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview" v-if="productData?.images?.length">
        <swiper
          :circular="true"
          :indicator-dots="true"
          indicator-active-color="#27ba9b"
          autoplay="true"
          @change="onchange"
        >
          <swiper-item v-for="(item, index) in productData?.images" :key="index">
            <image mode="aspectFill" :src="item" />
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">{{ current + 1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ productData?.images.length }}</text>
        </view>
      </view>
      <view class="preview" v-else>
        <image mode="aspectFill" :src="productData?.cover"></image>
      </view>

      <!-- 商品简介 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ productData?.price }}</text>
        </view>
        <view class="name ellipsis">{{ productData?.name }}</view>
        <view class="desc">{{ productData?.dec }}</view>
      </view>

      <!-- 操作面板 -->
      <view class="action">
        <!--        <view @tap="openPopup('address')" class="item arrow">-->
        <!--          <text class="label">送至</text>-->
        <!--          <text v-if="isShowAddress">请选择地址</text>-->
        <!--          <text v-if="isDefaultAddress" class="text ellipsis">-->
        <!--            {{ defaultAddress.fullLocation }}-->
        <!--            {{ defaultAddress.address }}-->
        <!--          </text>-->
        <!--          <text v-else class="text ellipsis">-->
        <!--            {{ selectedAddressChild.fullLocation }}-->
        <!--            {{ selectedAddressChild.address }}-->
        <!--          </text>-->
        <!--        </view>-->
        <view class="item arrow">
          <text class="label">服务</text>
          <text class="text ellipsis">无忧退 快速退款 免费包邮</text>
        </view>
      </view>
    </view>

    <!-- 热门推荐 -->
    <view class="similar panel">
      <view class="title">
        <text>热门推荐</text>
      </view>
      <Products :needType="1" :productData="productStore.productList"></Products>
    </view>
  </scroll-view>

  <!-- 用户操作 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="icons">
      <button class="icons-button" :class="{ activeLove: islove }" @tap="handleLove">
        <text class="icon-heart"></text>
        {{ islove ? '收藏' : '未收藏' }}
      </button>
      <button class="icons-button" open-type="contact">
        <text class="icon-handset"></text>
        客服
      </button>
      <navigator class="icons-button" url="/pages/cart/cart" open-type="switchTab">
        <text class="icon-cart"></text>
        <!-- 当前购物车数量 -->
        <text class="cratNum" v-if="cartStore.cartList.length">
          {{ cartStore.cartNum }}
        </text>
        购物车
      </navigator>
    </view>
    <view class="buttons">
      <view class="addcart" @tap="addCart">加入购物车</view>
      <view class="buynow" @tap="buyNow">立即购买</view>
    </view>
  </view>
  <!-- uni-ui 弹出层 -->
  <!--  <uni-popup ref="popup" type="bottom" background-color="#fff">-->
  <!--    <AddressPanel-->
  <!--      ref="popAdress"-->
  <!--      @update:selectAddress="handlerAddress"-->
  <!--      :address="addressData"-->
  <!--      v-if="popupName === 'address'"-->
  <!--      @close="popup?.close()"-->
  <!--    />-->
  <!--    <ServicePanel v-if="popupName === 'service'" @close="popup?.close()" />-->
  <!--  </uni-popup>-->
</template>

<style lang="scss" scoped>
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viewport {
  background-color: #f4f4f4;
}

.panel {
  margin-top: 20rpx;
  background-color: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    line-height: 1;
    padding: 30rpx 60rpx 30rpx 6rpx;
    position: relative;
    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      border-left: 4rpx solid #27ba9b;
    }
    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    content: '\e6c2';
    color: #ccc;
    font-family: 'erabbit', serif !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }
}

/* 商品信息 */
.goods {
  background-color: #fff;
  .preview {
    height: 750rpx;
    position: relative;
    image {
      width: 750rpx;
      height: 750rpx;
    }
    .indicator {
      height: 40rpx;
      padding: 0 24rpx;
      line-height: 40rpx;
      border-radius: 30rpx;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;
      .current {
        font-size: 26rpx;
      }
      .split {
        font-size: 24rpx;
        margin: 0 1rpx 0 2rpx;
      }
      .total {
        font-size: 24rpx;
      }
    }
  }
  .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;
    .price {
      height: 130rpx;
      padding: 25rpx 30rpx 0;
      color: #fff;
      font-size: 34rpx;
      box-sizing: border-box;
      background-color: #27ba9b;
    }
    .number {
      font-size: 56rpx;
    }
    .brand {
      width: 160rpx;
      height: 80rpx;
      overflow: hidden;
      position: absolute;
      top: 26rpx;
      right: 30rpx;
    }
    .name {
      max-height: 88rpx;
      line-height: 1.4;
      margin: 20rpx;
      font-size: 32rpx;
      color: #333;
    }
    .desc {
      line-height: 1;
      padding: 0 20rpx 30rpx;
      font-size: 24rpx;
      color: #cf4444;
    }
  }
  .action {
    padding-left: 20rpx;
    .item {
      height: 90rpx;
      padding-right: 60rpx;
      border-bottom: 1rpx solid #eaeaea;
      font-size: 26rpx;
      color: #333;
      position: relative;
      display: flex;
      align-items: center;
      &:last-child {
        border-bottom: 0 none;
      }
    }
    .label {
      width: 60rpx;
      color: #898b94;
      margin: 0 16rpx 0 10rpx;
    }
    .text {
      flex: 1;
      -webkit-line-clamp: 1;
    }
  }
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;
  .content {
    margin-left: -20rpx;
    .image {
      width: 100%;
    }
  }
  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;
    .item {
      display: flex;
      line-height: 2;
      padding: 10rpx;
      font-size: 26rpx;
      color: #333;
      border-bottom: 1rpx dashed #ccc;
    }
    .label {
      width: 200rpx;
    }
    .value {
      flex: 1;
    }
  }
}

/* 同类推荐 */
.similar {
  .content {
    padding: 0 20rpx 200rpx;
    background-color: #f4f4f4;
    display: flex;
    flex-wrap: wrap;
    .goods {
      width: 340rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 7rpx;
      border-radius: 10rpx;
      background-color: #fff;
    }
    .image {
      width: 300rpx;
      height: 260rpx;
    }
    .name {
      height: 80rpx;
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
    }
    .price {
      line-height: 1;
      font-size: 20rpx;
      color: #cf4444;
    }
    .number {
      font-size: 26rpx;
      margin-left: 2rpx;
    }
  }
  navigator {
    &:nth-child(even) {
      margin-right: 0;
    }
  }
}

/* 底部工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx var(--window-bottom);
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
  .buttons {
    display: flex;
    & > view {
      width: 220rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;
    }
    .addcart {
      background-color: #ffa868;
    }
    .buynow,
    .payment {
      background-color: #27ba9b;
      margin-left: 20rpx;
    }
  }
  .icons {
    padding-right: 10rpx;
    display: flex;
    align-items: center;
    flex: 1;
    .icons-button {
      position: relative;
      flex: 1;
      text-align: center;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      border-radius: 0;
      font-size: 20rpx;
      color: #333;
      background-color: #fff;
      &::after {
        border: none;
      }
      .cratNum {
        position: absolute;
        width: 30rpx;
        height: 30rpx;
        line-height: 30rpx;
        top: -10rpx;
        right: 10rpx;
        font-size: 24rpx;
        color: white;
        background-color: orangered;
        border-radius: 50%;
      }
    }
    /*收藏激活样式*/
    .activeLove {
      color: $cx-price;
    }

    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>
