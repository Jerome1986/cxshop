import { request } from '@/utils/http'
import type { ProductItem } from '@/types/ProductItem'
import type { PageResult } from '@/types/Global'

/**
 * 获取所有产品
 * /product/get
 * @desc  传了分类id就是根据分类id获取产品，没有传就是获取全部的商品
 * @param {string} cateId - 所属分类id
 * @param {number} pageNum - 当前页码
 * @param {number} pageSize - 当前页条数
 */

export const getProductApi = (cateId: string = '', pageNum: number = 1, pageSize: number = 4) => {
  return request<PageResult<ProductItem[]>>({
    method: 'GET',
    url: '/product/get',
    data: { cateId, pageNum, pageSize },
  })
}

/**
 * 根据商品id获取商品
 * /product/byId
 * @param {string} productId - 商品id
 */

export const getProductByIdApi = (productId: string) => {
  return request<ProductItem>({
    method: 'GET',
    url: '/product/byId',
    data: { productId },
  })
}

/**
 * 根据商品名字搜索商品
 * /product/search
 * @param {string} searchTxt - 搜索内容
 */

export const productSearchApi = (searchTxt: string) => {
  return request<ProductItem>({
    method: 'GET',
    url: '/product/search',
    data: { searchTxt },
  })
}
