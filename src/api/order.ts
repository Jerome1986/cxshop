import { request } from '@/utils/http'
import type { CartItem } from '@/types/cart'
import type { OrderItem } from '@/types/OrderItem'
// 新增后返回新增的id
interface orderAddResult {
  insertedId: string
}
/**
 * 新增订单
 * /order/add
 * @param {string} userId 当前用户id
 * @param {CartItem[]} prolist - 商品列表
 * @param {string} deliveryTime - 配送时间
 * @param {string} dec - 订单备注
 * @param {number} totalPrice - 订单总价
 * @param {number} totalNum - 订单总数
 * @param {string} status - 订单状态  待分拣  待收货  已完成
 */

export const orderAddApi = (
  userId: string,
  prolist: CartItem[],
  deliveryTime: string,
  dec: string,
  totalPrice: number,
  totalNum: number,
  status: string,
) => {
  return request<orderAddResult>({
    method: 'POST',
    url: '/order/add',
    data: { userId, prolist, deliveryTime, dec, totalPrice, totalNum, status },
  })
}

/**
 * 根据订单类型获取当前用户订单
 * /order/get
 * @param {string} userId - 当前用户id
 * @param {string} orderStatus - 订单类型
 */

export const orderGetApi = (userId: string, orderStatus: string) => {
  return request<OrderItem[]>({
    method: 'GET',
    url: '/order/get',
    data: { userId, orderStatus },
  })
}

/**
 * 根据订单id删除当前用户的订单
 * /order/remove
 * @param {string} userId - 当前用户id
 * @param {string} orderId - 当前订单id
 */

export const orderDelApi = (userId: string, orderId: string) => {
  return request<any>({
    method: 'POST',
    url: '/order/remove',
    data: { userId, orderId },
  })
}
