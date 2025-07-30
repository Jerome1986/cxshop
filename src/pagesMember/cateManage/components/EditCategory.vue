<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '@/store'
import type { CateItem } from '@/types/CateItem'
import { adminAddCateApi, adminUpdateCateApi } from '@/api/category'

// 定义store
const userStore = useUserStore()

// 定义数据
const form = ref<CateItem>({
  _id: '',
  cate_imageUrl: '',
  cate_name: '',
  createdAt: '',
  sort: 1,
})

// 控制开关
const visible = ref(false)

// 打开弹窗
const onOpen = (cateData: CateItem) => {
  visible.value = true
  // 如果有id则是编辑
  if (cateData._id) {
    console.log('编辑')
    form.value = { ...form.value, ...cateData }
  } else {
    console.log('新增')
    form.value = cateData
  }
}

// 关闭
const onClose = () => {
  visible.value = false
}

// 选择图片
const originalname = ref('')
const upImages = () => {
  uni.chooseImage({
    success: (res) => {
      console.log(res.tempFilePaths[0])
      form.value.cate_imageUrl = res.tempFilePaths[0]
      let url = res.tempFilePaths[0]
      originalname.value = (url.split('/').pop() ?? '').replace(/\.[^.]+$/, '')
    },
  })
}

// 上传图片
const updateImages = (): Promise<boolean> => {
  return new Promise((resolve) => {
    uni.uploadFile({
      url: 'https://c87iiko0rt.gzg.sealos.run/upload/images',
      filePath: form.value.cate_imageUrl,
      name: originalname.value,
      success: (res) => {
        form.value.cate_imageUrl = res.data
        resolve(true)
      },
      fail: () => {
        resolve(false)
      },
    })
  })
}

// 暴露组件内部的方法
defineExpose({
  onOpen,
  onClose,
})

// 提交事件
const emits = defineEmits(['update', 'add'])

// 提交
const onConfirm = async () => {
  visible.value = false
  const isEdit = !!form.value._id

  // 编辑逻辑
  if (isEdit) {
    console.log('提交', form.value.cate_name, form.value.cate_imageUrl)
    await updateImages()

    const res = await adminUpdateCateApi(
      userStore.profile.role,
      form.value._id,
      form.value.cate_name,
      form.value.cate_imageUrl,
    )
    if (res.code === 200) {
      await uni.showToast({ icon: 'none', title: '修改成功' })
      emits('update')
    }
  }
  // 新增逻辑
  else {
    console.log('新增')
    await updateImages()
    const res = await adminAddCateApi(form.value.cate_name, form.value.cate_imageUrl)
    if (res.code === 200) {
      await uni.showToast({ icon: 'none', title: '新增成功' })
      emits('add')
    }
  }
}
</script>

<template>
  <view v-if="visible" class="popup-mask" @click="visible = false">
    <view class="popup-container" @click.stop>
      <!-- 弹窗头部 -->
      <view class="popup-header">
        <text class="popup-title">{{ form._id ? '编辑分类' : '新增分类' }}</text>
        <text class="popup-close" @click="onClose">✕</text>
      </view>

      <!-- 表单区域 -->
      <view class="popup-body">
        <!-- 昵称 -->
        <view class="form-item">
          <text class="form-label">分类封面</text>
          <!-- 点击上传 -->
          <view class="cover">
            <view class="up-file" v-if="!form.cate_imageUrl" @tap="upImages">
              <uni-icons class="icon" color="#cccccc" type="plusempty" size="30"></uni-icons>
            </view>
            <image
              @tap="upImages"
              class="form-img"
              :src="form.cate_imageUrl"
              mode="aspectFill"
            ></image>
          </view>
        </view>

        <!-- 手机号 -->
        <view class="form-item">
          <text class="form-label">分类名称</text>
          <input v-model="form.cate_name" class="form-input" />
        </view>
      </view>

      <!-- 按钮区域 -->
      <view class="popup-footer">
        <button class="btn cancel" @click="onClose">取消</button>
        <button class="btn confirm" @click="onConfirm">确认</button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.popup-mask {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-container {
  width: 600rpx;
  padding: 40rpx 32rpx;
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.popup-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.popup-close {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 36rpx;
  color: #999;
  font-weight: bold;
}

.popup-body {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.cover {
  display: flex;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.form-label {
  font-size: 26rpx;
  color: #333;
}

/*自制上传*/
.up-file {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  border: 1px solid #ccc;
  .icon {
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(50%, 50%);
  }
}

.form-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
}

.form-input,
.form-picker {
  height: 80rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  background-color: #f7f8fa;
  border-radius: 12rpx;
  border: 1rpx solid #e5e5e5;
  line-height: 80rpx;
  color: #333;
}

.popup-footer {
  margin-top: 40rpx;
  display: flex;
  justify-content: flex-end;
  gap: 24rpx;
}

.btn {
  min-width: 160rpx;
  height: 80rpx;
  font-size: 28rpx;
  border-radius: 12rpx;
  text-align: center;
  line-height: 80rpx;
  border: none;
}

.cancel {
  background-color: #f5f5f5;
  color: #333;
}

.confirm {
  background-color: #27ba9b;
  color: #fff;
}
</style>
