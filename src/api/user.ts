import { request } from '@/utils/http'
import type { UserItem } from '@/types/UserItem'
import type { loveResult } from '@/types/Global'

/**
 * 更新当前用户信息
 * /user/update
 * @param {string} userId - 当前用户id
 * @param {string} mobile - 电话
 * @param {string} avatarUrl - 用户头像
 * @param {number} gender - 性别
 * @param {string} nickname - 昵称
 */

export const userInfoUpdateApi = (
  userId: string,
  mobile: string,
  avatarUrl: string,
  gender: number,
  nickname: string,
) => {
  return request<string>({
    method: 'POST',
    url: '/user/update',
    data: {
      userId,
      mobile,
      avatarUrl,
      gender,
      nickname,
    },
  })
}

/**
 * 根据用户id获取用户信息
 * /user/ById
 * @param {string} userId - 用户id
 */

export const userInfoGetApi = (userId: string) => {
  return request<UserItem>({
    method: 'GET',
    url: '/user/ById',
    data: { userId },
  })
}

/**
 * 用户操作点赞
 * /love/add
 * @param {string} userId - 用户标识
 * @param {string} productId - 商品标识
 * @param {boolean} islove - 是否点赞
 */

export const userLoveApi = (userId: string, productId: string, islove: boolean) => {
  return request<loveResult>({
    method: 'POST',
    url: '/love/add',
    data: { userId, productId, islove },
  })
}

/**
 * 查询用户对当前商品是否点赞
 * /love/get
 * @param {string} userId - 用户标识
 * @param {string} productId - 商品标识
 */

export const userLoveCheckApi = (userId: string, productId: string) => {
  return request<loveResult>({
    method: 'GET',
    url: '/love/get',
    data: { userId, productId },
  })
}
