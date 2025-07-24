import { request } from '@/utils/http'
import type { WxMobileLogin } from '@/types/Global'

/**
 * 微信手机号登录
 * /wx/login
 * @param {string}  code
 * @param {string} encryptedData
 * @param {string} iv
 */
export const wxMobileLoginApi = (code: string, encryptedData: string, iv: string) => {
  return request<WxMobileLogin>({
    method: 'POST',
    url: '/wx/login',
    data: { code, encryptedData, iv },
  })
}
