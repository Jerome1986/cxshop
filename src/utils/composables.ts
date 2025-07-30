import type { ProductItem } from '@/types/ProductItem'

export const validateForm = (form: ProductItem): boolean => {
  if (!form.name.trim()) {
    uni.showToast({ icon: 'none', title: '请输入商品名称' })
    return false
  }

  if (!form.dec.trim()) {
    uni.showToast({ icon: 'none', title: '请输入商品描述' })
    return false
  }

  if (form.price <= 0) {
    uni.showToast({ icon: 'none', title: '请输入有效的商品价格' })
    return false
  }

  if (!form.cover.trim()) {
    uni.showToast({ icon: 'none', title: '请上传商品封面' })
    return false
  }

  if (!form.categoryId.trim() || form.categoryId === '请选择分类') {
    uni.showToast({ icon: 'none', title: '请选择商品分类' })
    return false
  }

  return true
}
