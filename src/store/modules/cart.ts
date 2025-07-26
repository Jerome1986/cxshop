import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CartItem } from '@/types/cart'

export const useCartStore = defineStore(
  'cart',
  () => {
    // 购物车基础数据列表
    const cartList = ref<CartItem[]>([])

    // 往购物车添加商品
    const addCartShop = (val: CartItem) => {
      // 查找当前商品是否存在购物车
      const item = cartList.value.find((i) => i.productId === val.productId)
      console.log('item', item)
      if (item) {
        item.quantity++
      } else {
        cartList.value.push(val)
      }
    }

    // 清空购物车
    const clearCart = () => {
      cartList.value = []
    }

    // 设置是否选中
    const isSelected = (id: string) => {
      const item = cartList.value.find((i) => i.productId === id)
      if (item) item.isSelected = !item.isSelected
    }

    // 增加商品数量
    const increaseQuantity = (id: string) => {
      const item = cartList.value.find((i) => i.productId === id)
      if (!item) return
      if (item.quantity >= 99) return uni.showToast({ icon: 'none', title: '已到最大购买数量' })

      item.quantity++ // Vue 3 响应式系统会追踪这个改动
    }

    // 减少商品数量
    const decreaseQuantity = (id: string) => {
      const index = cartList.value.findIndex((i) => i.productId === id)
      if (index === -1) return

      const item = cartList.value[index]

      if (item.quantity > 1) {
        cartList.value[index] = { ...item, quantity: item.quantity - 1 }
      } else {
        cartList.value.splice(index, 1)
      }
    }

    // 购物车总价
    const cartTotal = computed(() => {
      // 过滤出已勾选的商品
      const selectedItems = cartList.value.filter((i) => i.isSelected)

      // 计算选中商品的总金额（单价 * 数量求和）
      return selectedItems.reduce((sum, item) => {
        return sum + item.price * item.quantity
      }, 0)
    })

    // 购物车总数量
    const cartNum = computed(() => {
      const selectedItems = cartList.value.filter((i) => i.isSelected)
      return selectedItems.reduce((sum, item) => sum + item.quantity, 0)
    })

    // 所有已选择的商品
    const cartSelectedPro = computed(() => {
      return cartList.value.filter((i) => i.isSelected)
    })

    return {
      cartList,
      addCartShop,
      clearCart,
      increaseQuantity,
      decreaseQuantity,
      isSelected,
      cartTotal,
      cartNum,
      cartSelectedPro,
    }
  },
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)
