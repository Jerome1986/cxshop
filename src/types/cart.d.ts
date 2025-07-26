export type CartItem = {
  /** 当前用户id */
  userId: string
  /** 商品ID */
  productId: string
  /** 商品名称 */
  productName: string
  /** 商品描述 */
  dec: string
  /** 单价 */
  price: number //
  /** 数量 */
  quantity: number
  /** 商品封面图 */
  cover: string
  /** 是否被选中 */
  isSelected: boolean
}
