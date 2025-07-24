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
