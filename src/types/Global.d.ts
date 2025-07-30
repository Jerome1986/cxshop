/** 通用分页结果类型 */
export type PageResult<T> = {
  /** 列表数据 */
  list: T
  /** 总条数 */
  total: number
  /** 当前页数 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 总页数 */
  page: number
}

/**
 * 微信手机号登录结果类型
 */

export type WxMobileLogin = {
  /** 用户手机号 */
  phoneNumber: string
}

/**
 * 文件类型
 */

export type File = {
  /** 用户手机号 */
  originalname: string
  path: string
  mimetype: string
}

/**
 * 点赞返回类型
 */

export type loveResult = {
  /** 用户唯一标识 */
  userId: string
  /** 商品唯一标识 */
  productId: string
  /** 点赞状态 */
  islove: boolean
}

/**
 * 用户状态更新类型
 */

export type UserStatusResult = {
  /** 更新操作状态 */
  acknowledged: boolean
  /** 实际被修改的条数 */
  modified: number
  /** 用户id */
  userId: string
  /** 用户账号状态 */
  userStatus: string
}

/**
 * 用户角色更新类型
 */

export type UserRoleResult = {
  /** 更新操作状态 */
  acknowledged: boolean
  /** 实际被修改的条数 */
  modified: number
  /** 用户id */
  userId: string
  /** 用户角色 */
  userRole: string
}

/**
 * 通用新增返回类型
 */

export type AddResult = {
  /** 新增id */
  insertedId: string
}

/**
 * 通用删除返回类型
 */

export type DeleteResult = {
  acknowledged: boolean
}

/**
 * 通用更新返回类型
 */

export type UpdateResult = {
  acknowledged: boolean
}
