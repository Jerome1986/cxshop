/**
 * 分类数据类型
 */

export type CateItem = {
  /** 唯一标识 */
  _id: string
  /** 分类名称 */
  cate_name: string
  /** 分类图片地址 */
  cate_imageUrl: string
  /** 分类排序 */
  sort: number
  /** 创建时间 */
  createdAt: string
}
