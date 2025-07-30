<script setup lang="ts">
import { computed, ref } from 'vue'
import type { UserItem } from '@/types/UserItem'
import { formatRole } from '@/utils/formatTimestamp'
import { userUpdateUserRoleApi } from '@/api/user'
import { useUserStore } from '@/store'

// 定义store
const userStore = useUserStore()

// 定义数据
const form = ref<UserItem>({
  _id: '',
  nickname: '',
  avatarUrl: '',
  mobile: '',
  gender: 1,
  role: 'user',
  registerTime: '',
  status: 'active',
})

// 控制开关
const visible = ref(false)

// 打开弹窗
const onOpen = (userData: UserItem) => {
  visible.value = true
  form.value = userData
}

// 关闭
const onClose = () => {
  visible.value = false
}

// 映射性别
const genderMap = ['未知', '男', '女']
const genderText = computed(() => {
  const index = form.value.gender
  return genderMap[index] ?? '未知'
})

// 设置用户角色
const onRoleChange = (e: any) => {
  console.log('角色', e)
  const index = Number(e.target.value)
  const roles = ['user', 'vip', 'admin']
  form.value.role = roles[index]
}

// 暴露组件内部的方法
defineExpose({
  onOpen,
  onClose,
})

const onConfirm = async () => {
  // 当前提交只设置用户角色属性
  const res = await userUpdateUserRoleApi(userStore.profile.role, form.value._id, form.value.role)
  console.log('结果', res)
  if (res.code === 200) {
    await uni.showToast({
      icon: 'success',
      title: res.message,
      mask: true,
    })
  }
  visible.value = false
}
</script>

<template>
  <view v-if="visible" class="popup-mask" @click="visible = false">
    <view class="popup-container" @click.stop>
      <!-- 弹窗头部 -->
      <view class="popup-header">
        <text class="popup-title">编辑用户信息</text>
        <text class="popup-close" @click="onClose">✕</text>
      </view>

      <!-- 表单区域 -->
      <view class="popup-body">
        <!-- 昵称 -->
        <view class="form-item">
          <text class="form-label">昵称</text>
          <input :value="form.nickname" class="form-input" disabled="true" />
        </view>

        <!-- 手机号 -->
        <view class="form-item">
          <text class="form-label">手机号</text>
          <input :value="form.mobile" class="form-input" disabled="true" />
        </view>

        <!-- 性别 -->
        <view class="form-item">
          <text class="form-label">性别</text>
          <input :value="genderText" class="form-input" disabled="true" />
        </view>

        <!-- 角色 -->
        <view class="form-item">
          <text class="form-label">角色</text>
          <picker :range="['用户', '会员', '管理员']" @change="onRoleChange">
            <view class="form-picker">{{ formatRole(form.role) || '请选择角色' }}</view>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.popup-close {
  font-size: 36rpx;
  color: #999;
  font-weight: bold;
}

.popup-body {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
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
