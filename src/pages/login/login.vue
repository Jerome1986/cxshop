<script setup lang="ts">
//处理手机登录
import { wxMobileLoginApi } from '@/api/login'
import { useUserStore } from '@/store'

// 定义store
const userStore = useUserStore()

const handleMobileLogin = (e: any) => {
  console.log('handleMobileLogin', e)

  // 构建参数
  const params = {
    code: '',
    encryptedData: e.detail.encryptedData,
    iv: e.detail.iv,
  }

  // 获取微信接口调取凭证code
  uni.login({
    success: async (res) => {
      console.log(res)
      params.code = res.code
      //  微信登录
      const wxRes = await wxMobileLoginApi(params.code, params.encryptedData, params.iv)
      console.log(wxRes)
      if (wxRes.code == 200) {
        // 存入用户数据
        userStore.setProfile(wxRes.data)
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/my/my',
          })
        }, 800)
        await uni.showToast({
          icon: 'none',
          title: '登录成功',
        })
      }
    },
  })
}
</script>

<template>
  <view class="login">
    <view class="login-container">
      <!-- Logo area -->
      <view class="logo-area">
        <image class="logo" src="/static/logo.png" mode="aspectFit" />
      </view>

      <!-- Welcome text -->
      <view class="welcome-text">
        <text class="title">欢迎来到晨曦农副</text>
        <text class="subtitle">让购物更有趣</text>
      </view>

      <!-- Login button -->
      <view class="login-button-area">
        <button
          class="login-button"
          hover-class="button-hover"
          open-type="getPhoneNumber"
          @getphonenumber="handleMobileLogin"
        >
          一键登录
        </button>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.login {
  min-height: 100vh;
  background-color: #fff;
  padding: 0 40rpx;

  .login-container {
    padding-top: 200rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo-area {
    margin-bottom: 60rpx;

    .logo {
      width: 200rpx;
      height: 200rpx;
    }
  }

  .welcome-text {
    text-align: center;
    margin-bottom: 100rpx;

    .title {
      display: block;
      font-size: 40rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 16rpx;
    }

    .subtitle {
      display: block;
      font-size: 28rpx;
      color: #999;
    }
  }

  .login-button-area {
    width: 100%;
    padding: 0 40rpx;

    .login-button {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      background-color: $cx-brandColor;
      color: #fff;
      font-size: 32rpx;
      border-radius: 44rpx;
      border: none;

      &.button-hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
