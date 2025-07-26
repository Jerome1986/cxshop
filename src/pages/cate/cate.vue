<script setup lang="ts">
import Products from '@/components/Products.vue'
import { ref } from 'vue'
import type { ProductItem } from '@/types/ProductItem'
import type { CateItem } from '@/types/CateItem'
import { getCateApi } from '@/api/category'
import { onLoad } from '@dcloudio/uni-app'
import { getProductApi } from '@/api/product'

// 分类列表
const cateList = ref<CateItem[]>([])
const currentCateId = ref('')
const currentCateName = ref('')
const getCateList = async () => {
  const res = await getCateApi()
  cateList.value = res.data
  currentCateId.value = res.data[0]._id
  currentCateName.value = res.data[0].cate_name
  if (currentCateId.value) {
    await getProductList(currentCateId.value)
  }
}

// 分类激活的下标
const activeIndex = ref(0)
// 处理分类点击
const handleCateItem = (index: number, cateItem: CateItem) => {
  activeIndex.value = index
  currentCateName.value = cateItem.cate_name
  getProductList(cateItem._id)
}

// 产品列表
const productsList = ref<ProductItem[]>([])
// 根据分类id来渲染商品
const getProductList = async (cateId: string) => {
  const res = await getProductApi(cateId)
  productsList.value = res.data.list
}

// 搜索值
const searchData = ref('')

// 点击搜索
const searchBtn = () => {
  console.log('searchBtn')
  if (!searchData.value) return uni.showToast({ icon: 'none', title: '请输入要搜索的内容' })
  uni.navigateTo({
    url: `/pages/search/search?text=${searchData.value}`,
  })
}
// 控制取消按钮
const cannal = ref('none')
const onfocus = () => {
  cannal.value = 'auto'
}
const onBlur = () => {
  cannal.value = 'none'
}

onLoad(async () => {
  await getCateList()
})
</script>

<template>
  <view class="main">
    <!-- 搜索 -->
    <view class="search" style="margin-bottom: 30rpx">
      <view class="searchIpt">
        <uni-search-bar
          v-model="searchData"
          placeholder="请输入商品名称"
          style="height: 60rpx"
          :cancel-button="cannal"
          @focus="onfocus"
          @blur="onBlur"
        />
      </view>
      <view @tap="searchBtn" class="searchBtn">搜索</view>
    </view>
    <!-- 主体区域 -->
    <view class="content">
      <view class="leftNav">
        <view
          ref="list"
          @tap="handleCateItem(index, item)"
          class="cate"
          :class="{ active: index === activeIndex }"
          v-for="(item, index) in cateList"
          :key="item._id"
        >
          {{ item.cate_name }}
        </view>
      </view>
      <view class="rightPro">
        <Products
          :cateName="currentCateName"
          :needType="2"
          :productData="productsList"
          v-if="productsList.length"
        ></Products>
        <view v-else style="text-align: center; margin-top: 50%">该分类暂时未上架商品</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  view {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
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
  .content {
    margin: 30rpx 0;
    display: flex;
    flex: 1;
    .leftNav {
      width: 240rpx;
      height: 100%;
      background-color: $cx-pageBackGroundColor;
      .cate {
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        border-bottom: 2rpx solid #e6e6e6;
        background-color: #fcfcfc;
      }
      .cate:nth-last-child(1) {
        border-bottom: 0;
      }
      .active {
        border-left: 5rpx solid $cx-brandColor;
        background-color: #ffffff;
        color: $cx-brandColor;
      }
    }
    .rightPro {
      padding: 30rpx;
      display: flex;
      flex-direction: column;
      width: 70%;
    }
  }
}
</style>
