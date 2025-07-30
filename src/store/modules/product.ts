import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProductApi } from '@/api/product'
import type { ProductItem } from '@/types/ProductItem'

export const useProductStore = defineStore('product', () => {
  // 分页
  const page = ref({
    pageNum: 1,
    pageSize: 8,
  })

  // 设置页码
  const setPage = (val?: Partial<typeof page.value>) => {
    if (val) {
      page.value = { ...page.value, ...val }
    }
  }

  // 初始商品数据
  const productList = ref<ProductItem[]>([])

  // 已结束标记
  const finish = ref(false)
  // 获取首页产品数据
  const getProductList = async (pageNum?: number, pageSize?: number) => {
    console.log('请求产品', finish.value)
    // 退出分页判断
    if (finish.value) {
      return
    }
    const res = await getProductApi('', pageNum, pageSize)
    productList.value.push(...res.data.list)
    console.log('getProductList', res.data, page.value.pageNum, finish.value)
    if (page.value.pageNum < res.data.page) {
      page.value.pageNum++
    } else {
      finish.value = true
    }
  }

  // 重置
  const reset = () => {
    page.value.pageNum = 1
    page.value.pageSize = 8
    finish.value = false
    productList.value = []
  }

  return {
    page,
    setPage,
    productList,
    getProductList,
    finish,
    reset,
  }
})
