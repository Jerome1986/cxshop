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
