/**
 * 用户数据类型
 */
export type UserItem = {
  /** 唯一标识 */
  _id: string
  /** 用户头像 */
  avatarUrl: string
  /** 用户手机号码 */
  mobile: string
  /** 注册时间 */
  registerTime: string
  /** 账号状态 - active激活 inactive未激活 */
  status: string
}
