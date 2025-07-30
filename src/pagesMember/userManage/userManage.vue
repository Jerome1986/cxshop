<script setup lang="ts">
import { ref } from 'vue'
import { formatGender, formatRole, formatTimestamp } from '@/utils/formatTimestamp'
import type { UserItem } from '@/types/UserItem'
import { adminUserGetApi, userUpdateStatusApi } from '@/api/user'
import { useUserStore } from '@/store'
import { onLoad } from '@dcloudio/uni-app'
import EditUserPop from '@/pagesMember/userManage/components/EditUserPop.vue'

// 定义store
const userStore = useUserStore()
const popup = ref<any>(null)

// 获取所有用户
const userList = ref<UserItem[]>()
const userListGet = async (role: string) => {
  const res = await adminUserGetApi(role)
  userList.value = res.data.list
}

// 切换用户状态
const toggleStatus = async (userId: string, status: string) => {
  console.log(userId, status)
  if (userId === userStore.profile._id) {
    return uni.showToast({ icon: 'none', title: '不可以修改自己' })
  }
  // 开始更新
  const res = await userUpdateStatusApi(userStore.profile.role, userId, status)
  // 更新列表
  await userListGet(userStore.profile.role)
  await uni.showToast({
    icon: 'success',
    title: res.data.userStatus === 'active' ? '激活' : '禁用',
    mask: true,
  })
}

// 编辑用户信息

const editUser = (user: UserItem) => {
  console.log('编辑', user)
  if (user._id === userStore.profile._id) {
    return uni.showToast({ icon: 'none', title: '不可以修改自己' })
  }
  popup.value.onOpen(user)
}

onLoad(() => {
  userListGet(userStore.profile.role)
})
</script>

<template>
  <view class="page-container">
    <view class="page-title">用户管理</view>

    <view class="user-list">
      <view class="user-card" v-for="user in userList" :key="user._id">
        <image class="avatar" :src="user.avatarUrl" mode="aspectFill" />
        <view class="user-content">
          <view class="top-line">
            <view class="nickname-status">
              <text class="nickname">{{ user.nickname || '未命名用户' }}</text>
              <view class="status-switch">
                <text class="switch-label">状态：</text>
                <view
                  class="switch"
                  @tap="toggleStatus(user._id, user.status)"
                  :class="{ active: user.status === 'active' }"
                ></view>
              </view>
            </view>

            <view class="action-buttons">
              <text class="btn edit" @click="editUser(user)">编辑</text>
            </view>
          </view>

          <view class="info">手机号：{{ user.mobile }}</view>
          <view class="info"
            >性别：{{ formatGender(user.gender) }} ｜ 角色：{{ formatRole(user.role) }}</view
          >
          <view class="info">注册时间：{{ formatTimestamp(user.registerTime) }}</view>
        </view>
      </view>
    </view>
  </view>
  <!-- 弹窗 -->
  <EditUserPop ref="popup"></EditUserPop>
</template>

<style lang="scss" scoped>
.page-container {
  padding: 40rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: $cx-brandColor;
  margin-bottom: 30rpx;
  text-align: center;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.user-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #eee;
  flex-shrink: 0;
}

.user-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;

  .top-line {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .nickname-status {
      display: flex;
      flex-direction: column;
      gap: 10rpx;

      .nickname {
        font-size: 32rpx;
        font-weight: bold;
        color: $cx-font-color;
      }

      .status-switch {
        display: flex;
        align-items: center;
        gap: 10rpx;

        .switch-label {
          font-size: 24rpx;
          color: #888;
        }

        .switch {
          width: 72rpx;
          height: 36rpx;
          border-radius: 36rpx;
          background-color: #ccc;
          position: relative;
          transition: background-color 0.2s ease;

          &::after {
            content: '';
            position: absolute;
            top: 4rpx;
            left: 4rpx;
            width: 28rpx;
            height: 28rpx;
            background-color: #fff;
            border-radius: 50%;
            transition: left 0.2s ease;
          }

          &.active {
            background-color: $cx-brandColor;

            &::after {
              left: 40rpx;
            }
          }
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 20rpx;

      .btn {
        font-size: 24rpx;
        padding: 6rpx 16rpx;
        border-radius: 8rpx;
      }

      .edit {
        background-color: #f0f9f8;
        color: $cx-brandColor;
      }

      .delete {
        background-color: #ffecec;
        color: #ff4d4f;
      }
    }
  }

  .info {
    font-size: 26rpx;
    color: #666;
  }
}
</style>
