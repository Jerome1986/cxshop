import { request } from '@/utils/http'
import type { BannerItem } from '@/types/BannerItem'

/**
 * 获取banner
 * /banner/get
 */
export const getBannerApi = () => {
  return request<BannerItem[]>({
    method: 'GET',
    url: '/banner/get',
  })
}
