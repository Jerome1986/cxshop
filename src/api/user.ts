import { request } from '@/utils/http'
import type { UserItem } from '@/types/UserItem'
import type { loveResult, PageResult, UserRoleResult, UserStatusResult } from '@/types/Global'

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
 * 管理员获取所有用户
 * /user/admin/all
 * @param {string} role - 当前用户身份
 */

export const adminUserGetApi = (role: string) => {
  return request<PageResult<UserItem[]>>({
    method: 'GET',
    url: '/user/admin/all',
    data: { role },
  })
}

/**
 * 管理员更新用户登录状态
 * /user/admin/userStatus
 * @param {string}  role - 用户角色
 * @param {string} userId - 当前用户id
 * @param {string} userStatus - 当前用户账号状态
 */

export const userUpdateStatusApi = (role: string, userId: string, userStatus: string) => {
  return request<UserStatusResult>({
    method: 'POST',
    url: '/user/admin/userStatus',
    data: {
      role,
      userId,
      userStatus,
    },
  })
}

/**
 * 管理员设置用户角色
 * /user/admin/userRole
 * @param {string} role - 当前执行角色
 * @param {string} userId - 操作用户id
 * @param {string} userRole 操作对象角色
 */

export const userUpdateUserRoleApi = (role: string, userId: string, userRole: string) => {
  return request<UserRoleResult>({
    method: 'POST',
    url: '/user/admin/userRole',
    data: { role, userId, userRole },
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
