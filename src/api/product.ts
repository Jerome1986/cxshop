import { request } from '@/utils/http'
import type { ProductItem } from '@/types/ProductItem'
import type { AddResult, DeleteResult, PageResult, UpdateResult } from '@/types/Global'

/**
 * 获取所有产品
 * /product/get
 * @desc  传了分类id就是根据分类id获取产品，没有传就是获取全部的商品
 * @param {string} cateId - 所属分类id
 * @param {number} pageNum - 当前页码
 * @param {number} pageSize - 当前页条数
 */

export const getProductApi = (cateId: string = '', pageNum: number = 1, pageSize: number = 10) => {
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

/**
 * 管理员新增商品
 * /product/add
 * @param {ProductItem}  productItem - 产品对象
 */

export const adminAddProductApi = (productItem: ProductItem) => {
  return request<AddResult>({
    method: 'POST',
    url: '/product/add',
    data: { ...productItem },
  })
}

/**
 * 管理员删除商品
 * /product/del
 * @param {string} role - 操作人角色
 * @param {string} productId - 操作的商品id
 */

export const adminDeleteProductApi = (role: string, productId: string) => {
  return request<DeleteResult>({
    method: 'POST',
    url: '/product/del',
    data: { role, productId },
  })
}

/**
 * 管理员更新商品
 * /product/update
 */

export const adminUpdateProductApi = (role: string, productItem: ProductItem) => {
  return request<UpdateResult>({
    method: 'POST',
    url: '/product/update',
    data: { role, ...productItem },
  })
}
