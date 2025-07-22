import { request } from '@/utils/http'
import type { ProductItem } from '@/types/ProductItem'
import type { PageResult } from '@/types/Global'

/**
 * 获取所有产品
 * /product/get
 * @param {number} pageNum - 当前页码
 * @param {number} pageSize - 当前页条数
 */

export const getProductApi = (pageNum: number = 1, pageSize: number = 4) => {
  return request<PageResult<ProductItem[]>>({
    method: 'GET',
    url: '/product/get',
    data: { pageNum, pageSize },
  })
}
