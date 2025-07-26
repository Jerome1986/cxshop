<script setup lang="ts">
//处理手机登录
import { wxMobileLoginApi } from '@/api/login'
import { useUserStore } from '@/store'

// 定义store
const userStore = useUserStore()

const handleMobileLogin = (e: any) => {
  console.log('handleMobileLogin', e)

  const params = {
    code: '',
    encryptedData: e.detail.encryptedData,
    iv: e.detail.iv,
  }

  uni.login({
    // 获取code成功
    success: async (res) => {
      if (!res.code) {
        await uni.showToast({
          icon: 'none',
          title: '获取code失败',
        })
        console.error('uni.login 获取code失败', res)
        return
      }

      params.code = res.code

      try {
        const wxRes = await wxMobileLoginApi(params.code, params.encryptedData, params.iv)
        console.log('wxMobileLoginApi 返回', wxRes)

        if (wxRes.code === 200 && wxRes.data) {
          userStore.setProfile(wxRes.data)

          await uni.showToast({
            icon: 'success',
            title: '登录成功',
          })

          setTimeout(() => {
            uni.switchTab({
              url: '/pages/home/home',
            })
          }, 800)
        } else {
          await uni.showToast({
            icon: 'none',
            title: wxRes.message || '登录失败，请稍后重试',
          })
          console.warn('登录接口响应失败', wxRes)
        }
      } catch (err) {
        await uni.showToast({
          icon: 'none',
          title: '请求异常，请检查网络',
        })
        console.error('调用登录接口异常', err)
      }
    },
    // 获取code失败
    fail: (err) => {
      uni.showToast({
        icon: 'none',
        title: '微信登录失败',
      })
      console.error('login 失败', err)
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
