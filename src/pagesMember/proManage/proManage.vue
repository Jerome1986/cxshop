<script lang="ts" setup>
import { ref } from 'vue'
import type { ProductItem } from '@/types/ProductItem'
import { adminDeleteProductApi, getProductApi } from '@/api/product'
import { onLoad } from '@dcloudio/uni-app'
import EditProChannal from '@/pagesMember/proManage/components/EditProChannal.vue'
import { useProductStore, useUserStore } from '@/store'

// 定义store
const userStore = useUserStore()
const productStore = useProductStore()
// 获取弹窗组件
const popup = ref()
// 产品列表
const productList = ref<ProductItem[]>([])
const productListGet = async () => {
  const res = await getProductApi()
  productList.value = res.data.list
}

// 添加
const handleAdd = () => {
  console.log('新增商品')
  popup.value.open({})
}

// 编辑
const handleEdit = (item: ProductItem) => {
  console.log('编辑商品', item)
  popup.value.open(item)
}

// 处理子组件成功事件
const handleAddEvent = () => productListGet()
const handleUpdateEvent = () => productListGet()

// 删除
const handleDelete = (productId: string) => {
  console.log('删除商品', productId)
  uni.showModal({
    title: '提示',
    content: '确定要删除该商品吗？',
    confirmColor: '#27ba9b',
    success: async (res) => {
      if (res.confirm) {
        const res = await adminDeleteProductApi(userStore.profile.role, productId)
        console.log('删除结果', res)
        await uni.showToast({ icon: 'none', title: res.message })
        //  重新获取商品列表
        await productListGet()
      }
    },
  })
}

onLoad(() => {
  productListGet()
})
</script>

<template>
  <view class="product-manager">
    <view class="header">
      <view class="title">商品管理</view>
      <view>
        <button class="btn btn-add" @click="handleAdd">新增商品</button>
      </view>
    </view>

    <view v-if="productList.length === 0" class="empty"> 暂无商品 </view>

    <view class="product-list">
      <view v-for="item in productList" :key="item._id" class="product-card">
        <image :src="item.cover" class="product-cover" mode="aspectFill" />
        <view class="product-info">
          <view class="product-name">{{ item.name }}</view>
          <view class="product-desc">{{ item.dec }}</view>
          <view class="product-meta">
            <text class="price">¥{{ item.price.toFixed(2) }}</text>
            <text class="sell">销量：{{ item.sell }}</text>
          </view>
        </view>
        <view class="actions">
          <button class="btn edit-btn" @click="handleEdit(item)">编辑</button>
          <button class="btn delete-btn" @click="handleDelete(item._id!)">删除</button>
        </view>
      </view>
    </view>
    <!--  操作弹窗  -->
    <EditProChannal
      ref="popup"
      @addProduct="handleAddEvent"
      @updateProduct="handleUpdateEvent"
    ></EditProChannal>
  </view>
</template>

<style lang="scss" scoped>
.product-manager {
  padding: 24rpx;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    width: 100%;

    .title {
      font-size: 36rpx;
      font-weight: 600;
      color: $cx-font-color;
    }

    .btn-add {
      background-color: $cx-brandColor;
      color: #ffffff;
      font-size: 26rpx;
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 24rpx;
      border-radius: 10rpx;
    }
  }

  .empty {
    text-align: center;
    color: $cx-dec;
    font-size: 28rpx;
    padding: 100rpx 0;
  }

  .product-list {
    padding-bottom: 80rpx;
    display: flex;
    flex-direction: column;
    gap: 24rpx;
  }

  .product-card {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: row;

    .product-cover {
      width: 160rpx;
      height: 160rpx;
      border-radius: 12rpx;
      margin-right: 24rpx;
    }

    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .product-name {
        font-size: 32rpx;
        font-weight: 600;
        color: $cx-font-color;
      }

      .product-desc {
        font-size: 28rpx;
        color: $cx-dec;
        margin: 8rpx 0;
      }

      .product-meta {
        font-size: 26rpx;
        color: $cx-dec;
        display: flex;
        justify-content: space-between;

        .price {
          color: $cx-price;
          font-weight: 600;
        }
      }
    }

    .actions {
      margin-left: 16rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      gap: 16rpx;

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

      .delete-btn {
        background-color: $cx-price;
        color: #fff;
        font-size: 24rpx;
        padding: 8rpx 16rpx;
        border-radius: 8rpx;
      }
    }
  }
}
</style>
