<script setup lang="ts">
import { ref, computed } from 'vue'
import { adminDelCateApi, getCateApi } from '@/api/category'
import type { CateItem } from '@/types/CateItem'
import { onLoad } from '@dcloudio/uni-app'
import EditCategory from '@/pagesMember/cateManage/components/EditCategory.vue'
import { useUserStore } from '@/store'

// 定义store
const userStore = useUserStore()
// 获取组件
const popup = ref()
// 分类基础数据
const categoryList = ref<CateItem[]>([])
// 请求所有分类
const cateListGet = async () => {
  const res = await getCateApi()
  categoryList.value = res.data
  console.log(categoryList.value)
}

// 🔧 操作入口（打印）
const onAdd = () => {
  console.log('点击新增分类')
  popup.value.onOpen({})
}

// 编辑
const onEdit = (item: CateItem) => {
  console.log('点击编辑分类：', item)
  popup.value.onOpen(item)
}

// 删除
const onDelete = (cateId: string) => {
  console.log('点击删除分类 ID：', cateId)
  uni.showModal({
    title: '提示',
    content: '是否要删除该分类',
    confirmColor: '#27ba9b',
    success: async (res) => {
      if (res.confirm) {
        const res = await adminDelCateApi(userStore.profile.role, cateId)
        console.log('删除结果', res)
        if (res.code === 200) {
          await uni.showToast({ icon: 'none', title: '删除成功' })
        }
        await cateListGet()
      }
    },
  })
}

// 处理子组件新增和更新事件
const handleAdd = async () => await cateListGet()
const handleUpdate = async () => await cateListGet()

onLoad(() => {
  cateListGet()
})
</script>

<template>
  <view class="category-page">
    <view class="category-header">
      <text class="category-title">分类管理</text>
      <view class="btn-wrapper">
        <button class="add-btn" size="mini" @click="onAdd">新增</button>
      </view>
    </view>

    <view class="category-list">
      <view class="category-item" v-for="item in categoryList" :key="item._id">
        <image class="cate-image" :src="item.cate_imageUrl" mode="aspectFill" />
        <view class="cate-info">
          <text class="cate-name">{{ item.cate_name }}</text>
          <text class="cate-sort">排序：{{ item.sort }}</text>
        </view>
        <view class="btn-group">
          <button class="edit-btn" size="mini" @click="onEdit(item)">编辑</button>
          <button class="delete-btn" size="mini" @click="onDelete(item._id)">删除</button>
        </view>
      </view>
    </view>
    <!--  弹窗  -->
    <EditCategory ref="popup" @add="handleAdd" @update="handleUpdate"></EditCategory>
  </view>
</template>

<style scoped lang="scss">
.category-page {
  padding: 24rpx;
  background-color: $cx-pageBackGroundColor;
  min-height: 100vh;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.category-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $cx-brandColor;
}

.btn-wrapper {
  display: flex;
  align-items: center;
}

.add-btn {
  background-color: $cx-brandColor;
  color: #ffffff;
  font-size: 26rpx;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 24rpx;
  border-radius: 10rpx;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 80rpx;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border: 2rpx solid $cx-brandColor;
  border-radius: 16rpx;
  background-color: #f8fffd;
  position: relative;
}

.cate-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 24rpx;
}

.cate-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cate-name {
  font-size: 32rpx;
  font-weight: 500;
  color: $cx-font-color;
  margin-bottom: 12rpx;
}

.cate-sort {
  font-size: 26rpx;
  color: $cx-dec;
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
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
</style>
