<script setup lang="ts">
import Banner from '@/components/Banner.vue'
import Navigation from '@/pages/home/components/Navigation.vue'
import Products from '@/components/Products.vue'
import PageSkeleton from '@/pages/home/components/PageSkeleton.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { BannerItem } from '@/types/BannerItem'
import { getBannerApi } from '@/api/banner'
import type { CateItem } from '@/types/CateItem'
import { getCateApi } from '@/api/category'
import { useProductStore } from '@/store/modules/product'

// 定义store
const productStore = useProductStore()

//获取首页banner
const bannerList = ref<BannerItem[]>([])
const getBannerList = async () => {
  const res = await getBannerApi()
  bannerList.value = res.data
  console.log('bannerList', bannerList.value)
}

// 获取分类
const cateList = ref<CateItem[]>([])
const getCateList = async () => {
  const res = await getCateApi()
  cateList.value = res.data
}

// 滑动触底
const onScroll = async () => {
  console.log('触底')
  await productStore.getProductList(productStore.page.pageNum, productStore.page.pageSize)
}

// 是否加载中标记
const isLoading = ref(false)
onLoad(async () => {
  console.log('获取数据')
  isLoading.value = true
  await Promise.all([
    getBannerList(),
    getCateList(),
    productStore.getProductList(productStore.page.pageNum, productStore.page.pageSize),
  ])
  isLoading.value = false
})
</script>

<template>
  <view class="container">
    <scroll-view :scroll-y="true" @scrolltolower="onScroll" style="height: 100vh">
      <PageSkeleton v-if="isLoading"></PageSkeleton>
      <template v-else>
        <!-- banner区域 -->
        <banner :banner-data="bannerList"></banner>
        <!-- 主体内容 -->
        <view class="content">
          <!-- 金刚区一级导航 -->
          <Navigation :cate-data="cateList"></Navigation>
          <!-- 每日精选 -->
          <Products :needType="1" :product-data="productStore.productList">
            <view class="title">每日精选</view>
          </Products>
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  background-color: $cx-pageBackGroundColor;
  .content {
    padding: 24rpx;
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
  }
}
</style>
