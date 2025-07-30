import { request } from '@/utils/http'
import type { CateItem } from '@/types/CateItem'

interface insertedResult {
  insertedId: string
}

interface delResult {
  acknowledged: boolean
}

interface updateResult {
  acknowledged: boolean
}

/**
 * 获取分类
 * /cate/get
 */
export const getCateApi = () => {
  return request<CateItem[]>({
    method: 'GET',
    url: '/cate/get',
  })
}

/**
 * 管理员新增分类
 * /cate/add
 * @param {string} cate_name - 分类名称
 * @param {string} cate_imageUrl - 封面图URL
 */

export const adminAddCateApi = (cate_name: string, cate_imageUrl: string) => {
  return request<insertedResult>({
    method: 'POST',
    url: '/cate/add',
    data: { cate_name, cate_imageUrl },
  })
}

/**
 * 根据当前分类id 删除分类
 * /cate/delId
 * @param {string} role - 当前操作者的角色
 * @param {string} cateId - 当前要删除的分类id
 */

export const adminDelCateApi = (role: string, cateId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/cate/delId',
    data: { role, cateId },
  })
}

/**
 * 根据当前id更新分类
 * /cate/update
 */

export const adminUpdateCateApi = (
  role: string,
  cateId: string,
  cate_name: string,
  cate_imageUrl: string,
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/cate/update',
    data: { role, cateId, cate_name, cate_imageUrl },
  })
}
