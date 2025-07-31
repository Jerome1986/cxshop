import type { CartItem } from '@/types/cart'

/**
 * 订单数据类型
 */

export type OrderItem = {
  /** 唯一标识 */
  _id: string
  /** 归属用户id */
  userId: string
  /** 用户电话 */
  userMobile: string
  /** 商品列表 */
  prolist: CartItem[]
  /** 配送时间 */
  deliveryTime: string
  /** 订单备注 */
  dec: string
  /** 订单总价 */
  totalPrice: number
  /** 订单总数 */
  totalNum: number
  /** 创建时间 */
  createdAt: string
  /** 订单状态 - 待分拣  待收货  已完成 */
  status: string
}
