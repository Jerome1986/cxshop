import { request } from '@/utils/http'
import type { CateItem } from '@/types/CateItem'

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
