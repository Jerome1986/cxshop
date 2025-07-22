export type ProductItem = {
  /** 唯一标识 */
  _id: string
  /** 产品名称 */
  name: string
  /** 产品描述 */
  dec: string
  /** 价格 */
  price: number
  /** 出售数量 */
  sell: number
  /** 封面图 */
  cover: string
  /** 所属分类id */
  categoryId: string
  /** 详情图库 */
  images: Array<string>
  /** 创建时间 */
  createdAt: string
}
