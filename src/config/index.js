export const noMenu = ['/login']

export const pathMap = {
  login: '登录',
  introduce: '系统介绍',
  dashboard: '大盘数据',
  add: '添加商品',
  swiper: '轮播图配置',
  hot: '热销商品配置',
  new: '新品上线配置',
  recommend: '为你推荐配置',
  category: '分类管理',
  level2: "分类二级管理",
  level3: "分类三级管理",
  good: "商品管理",
  order: "订单管理",
  order_detail: "订单详情",
  guest: "会员管理",
}

export const configTypeMap = {
  hot: 3,
  new: 4,
  recommend: 5
}

export const options = [{
  value: '',
  label: '全部'
}, {
  value: 0,
  label: '待支付'
}, {
  value: 1,
  label: '已支付'
}, {
  value: 2,
  label: '配货完成'
}, {
  value: 3,
  label: '出库成功'
}, {
  value: 4,
  label: '交易成功'
}, {
  value: -1,
  label: '手动关闭'
}, {
  value: -2,
  label: '超时关闭'
}, {
  value: -3,
  label: '商家关闭'
}]

export const orderStatus = {
  0: '待支付',
  1: '已支付',
  2: '配货完成',
  3: '出库成功',
  4: '交易成功',
  '-1': '手动关闭',
  '-2': '超时关闭',
  '-3': '商家关闭'
}