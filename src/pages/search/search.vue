<script setup lang="ts">
import { productSearchApi } from '@/api/product'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { ProductItem } from '@/types/ProductItem'
import { useUserStore } from '@/store'

// 定义store
const userStore = useUserStore()

// 页面初始数据
const searchTxt = ref('')
const productData = ref<ProductItem[]>([])
// 获取搜索结果
const searchGet = async (value: string) => {
  const res = await productSearchApi(value)
  console.log(res)
  productData.value = res.data
}

// 点击搜索按钮
const searchBtn = () => {
  if (!searchTxt.value) return uni.showToast({ icon: 'none', title: '请填写搜索内容' })
  searchGet(searchTxt.value)
}

// 点击清除按钮
const handleClear = () => {
  searchTxt.value = ''
  searchGet(searchTxt.value)
}

// 点击登录
const login = () => {
  uni.navigateTo({ url: '/pages/login/login' })
}

// 跳转商品详情
const goDetail = (productId: number) => {
  uni.navigateTo({ url: `/pages/productDetail/productDetail?productId=${productId}` })
}

onLoad((query: any) => {
  console.log(query)
  searchTxt.value = query.text
  searchGet(query.text)
})
</script>
<template>
  <view class="container">
    <view class="search">
      <view class="search" style="margin-bottom: 30rpx">
        <view class="searchIpt">
          <uni-search-bar
            v-model="searchTxt"
            placeholder="请输入商品名称"
            style="height: 60rpx"
            cancel-button="none"
            @clear="handleClear"
          />
        </view>
        <view @tap="searchBtn" class="searchBtn">搜索</view>
      </view>
    </view>
    <!-- 每日精选 -->
    <view class="productList">
      <view class="title">搜索结果</view>
      <!-- 商品卡片区域 -->
      <view class="proList">
        <view @tap="goDetail(item._id)" class="proCard" v-for="item in productData" :key="item._id">
          <image class="proPic" :src="item.cover" mode="aspectFill"></image>
          <!-- 内容文本区域 -->
          <view class="proText">
            <view class="proName">{{ item.name }}</view>
            <view class="dec">{{ item.dec }}</view>
            <view class="price" v-if="userStore.profile._id">￥{{ item.price }}</view>
            <view class="price" v-else @tap="login">登录获取报价</view>
            <view class="addPro">+</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background-color: #fff;
  .title {
    margin-top: 30rpx;
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background-color: #fff;
    font-size: 32rpx;
    color: $cx-brandColor;
    border-radius: 20rpx;
  }
  .search {
    padding-right: 20rpx;
    margin-top: 40rpx;
    height: 60rpx;
    width: 100%;
    display: flex;
    align-items: center;
    .searchIpt {
      flex: 1;
    }
    .searchBtn {
      text-align: center;
      line-height: 60rpx;
      height: 60rpx;
      width: 120rpx;
      color: #ffffff;
      background-color: $cx-brandColor;
      border-radius: 10rpx;
    }
  }
  .productList {
    .proList {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .proCard {
        position: relative;
        margin-top: 30rpx;
        width: 330rpx;
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
            display: -webkit-box;
            -webkit-line-clamp: 1; /* 控制显示的行数 */
            -webkit-box-orient: vertical;
            overflow: hidden; /* 隐藏超出部分 */
            text-overflow: ellipsis; /* 超出部分用省略号显示 */
            white-space: normal; /* 文本换行方式 */
            font-size: 28rpx;
            font-weight: 700;
          }
          .dec {
            display: -webkit-box;
            -webkit-line-clamp: 1; /* 控制显示的行数 */
            -webkit-box-orient: vertical;
            overflow: hidden; /* 隐藏超出部分 */
            text-overflow: ellipsis; /* 超出部分用省略号显示 */
            white-space: normal; /* 文本换行方式 */
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
}
</style>
