<!-- banner-->
<script setup lang="ts">
import type { BannerItem } from '@/types/BannerItem'

defineProps<{
  bannerData: BannerItem[]
}>()
</script>

<template>
  <view>
    <swiper
      class="banner"
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="1000"
      :circular="true"
      :indicator-active-color="'#ffffff'"
    >
      <swiper-item v-for="item in bannerData" :key="item._id">
        <image :src="item.imageUrl" mode="scaleToFill"></image>
      </swiper-item>
    </swiper>
  </view>
</template>
<style lang="scss">
.banner {
  width: 100%;
  height: 300rpx;
}
</style>
