export type BannerItem = {
  /** 唯一标识 */
  _id: string
  /** 图片连接 */
  imageUrl: string
  /** 跳转地址 */
  linkUrl?: string
  /** 图片描述 */
  altText?: string
  /** 排序 */
  order: number
  /** 显示状态 -- active显示  inactive不显示 */
  status: string
  /** 创建时间 */
  createdAt: string
}
