import { request } from '@/utils/http'
import type { File } from '@/types/Global'
interface avatarUrl {
  url: string
}

/**
 * 上传头像
 * /upload/images
 */

export const updateAvatar = (file: File) => {
  return request<avatarUrl>({
    method: 'POST',
    url: '/upload/images',
    data: { file },
  })
}
