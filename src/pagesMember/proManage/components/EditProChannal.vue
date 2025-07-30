<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ProductItem } from '@/types/ProductItem'
import type { CateItem } from '@/types/CateItem'
import { getCateApi } from '@/api/category'
import { adminAddProductApi, adminUpdateProductApi, getProductByIdApi } from '@/api/product'
import { useUserStore } from '@/store'
import { validateForm } from '@/utils/composables'

// 定义store
const userStore = useUserStore()

// 表单
const formDefault = ref<ProductItem>({
  _id: '',
  name: '',
  dec: '',
  price: 0,
  sell: 0,
  cover: '',
  categoryId: '',
  images: [],
})

const form = ref(formDefault.value)

// 获取分类列表
const cateList = ref<CateItem[]>([])
const cateListGet = async () => {
  const res = await getCateApi()
  cateList.value = res.data
  console.log('分类', cateList.value)
}

const cateNames = computed(() => {
  return cateList.value.map((item) => item.cate_name)
})

// 根据index查找id
const findCateId = (index: number): string | null => {
  if (index < 0 || index >= cateList.value.length) {
    return null // 防止越界
  }
  return cateList.value[index]._id
}

// 根据分类id查找分类名
const findCateName = (cateId: string): string | null => {
  const found = cateList.value.find((item) => item._id === cateId)
  return found ? found.cate_name : null
}

// 选择分类
const handleCate = (e: any) => {
  console.log('选择分类', e.detail.value)
  form.value.categoryId = findCateId(Number(e.detail.value))!
}

// 弹窗开关
const visible = ref(false)

// 选择封面图
const originalname = ref('')
const upImages = () => {
  console.log('上传封面')
  uni.chooseImage({
    success: (res) => {
      console.log(res.tempFilePaths[0])
      form.value.cover = res.tempFilePaths[0]
      let url = res.tempFilePaths[0]
      originalname.value = (url.split('/').pop() ?? '').replace(/\.[^.]+$/, '')
      // 上传服务器并返回服务器图片地址
      upCover()
    },
  })
}

// 上传封面函数
const upCover = () => {
  uni.uploadFile({
    url: 'https://c87iiko0rt.gzg.sealos.run/upload/images',
    filePath: form.value.cover,
    name: originalname.value,
    success: (res) => {
      form.value.cover = res.data
    },
    fail: (e) => {
      console.error(e)
    },
  })
}

const emits = defineEmits(['addProduct', 'updateProduct'])

// 提交表单
const onConfirm = async () => {
  form.value.price = Number(form.value.price)
  console.log('提交', form.value)
  // todo 验证函数
  if (!validateForm(form.value)) return
  // 处理逻辑
  if (form.value._id) {
    // 编辑
    // 重构字段，方便提交服务器
    const { _id, ...rest } = form.value
    const payload = {
      productId: _id,
      ...rest,
    }

    const res = await adminUpdateProductApi(userStore.profile.role, payload)
    console.log('编辑结果', res)
    await uni.showToast({ icon: 'none', title: res.message })
    emits('updateProduct')
    visible.value = false
  } else {
    //  新增
    const res = await adminAddProductApi(form.value)
    console.log('新增结果', res)
    await uni.showToast({ icon: 'none', title: res.message })
    emits('addProduct')
    visible.value = false
  }
}

// 打开弹窗
const open = async (productItem: ProductItem) => {
  visible.value = true
  await cateListGet()
  if (productItem._id) {
    const res = await getProductByIdApi(productItem._id)
    form.value = res.data
  } else {
    form.value = formDefault.value
  }
}

// 关闭弹窗
const onClose = () => {
  visible.value = false
}

defineExpose({
  open,
})
</script>

<template>
  <view v-if="visible" class="popup-mask" @click="visible = false">
    <view class="popup-container" @click.stop>
      <!-- 弹窗头部 -->
      <view class="popup-header">
        <text class="popup-title">{{ form._id ? '编辑商品' : '新增商品' }}</text>
        <text class="popup-close" @click="onClose">✕</text>
      </view>

      <!-- 表单区域 -->
      <view class="popup-body">
        <!-- 昵称 -->
        <view class="form-item">
          <text class="form-label">商品封面</text>
          <!-- 点击上传 -->
          <view class="cover">
            <view class="up-file" v-if="!form.cover" @tap="upImages">
              <uni-icons class="icon" color="#cccccc" type="plusempty" size="30"></uni-icons>
            </view>
            <image @tap="upImages" class="form-img" :src="form.cover" mode="aspectFill"></image>
          </view>
        </view>

        <!-- 商品名称 -->
        <view class="form-item">
          <text class="form-label">商品名称</text>
          <input v-model="form.name" class="form-input" />
        </view>

        <!-- 商品描述 -->
        <view class="form-item">
          <text class="form-label">商品描述</text>
          <input v-model="form.dec" class="form-input" />
        </view>

        <!-- 商品价格 -->
        <view class="form-item">
          <text class="form-label">商品价格</text>
          <input v-model="form.price" class="form-input" type="number" />
        </view>

        <!-- 所属分类 -->
        <view class="form-item">
          <text class="form-label">所属分类</text>
          <picker :range="cateNames" @change="handleCate">
            <view class="form-picker">{{ findCateName(form.categoryId) || '请选择分类' }}</view>
          </picker>
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
<script setup lang="ts"></script>
