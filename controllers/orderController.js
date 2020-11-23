const db = require('../models')
const Order = db.Order
const Payment = db.Payment
const Product = db.Product
const Cart = db.Cart
const OrderItem = db.OrderItem

const URL = process.env.URL
const MerchantID = process.env.MerchantID
const HashKey = process.env.HashKey
const HashIV = process.env.HashIV
const PayGateWay = "https://ccore.newebpay.com/MPG/mpg_gateway"
const ReturnURL = URL+"/newebpay/callback?from=ReturnURL"
const NotifyURL = URL+"/newebpay/callback?from=NotifyURL"
const ClientBackURL = URL+"/orders"

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({ include: [ Payment ]})
    .then(orders => {
      return res.render('orders', { orders })
    })
  },

  getOrder: (req, res) => {
    Order.findByPk(
      req.params.id, 
      { include: [{ model: Product, as: 'items' }, Payment]}
    )
    .then(order => {
      items = order.dataValues.items.map(item => ({
        ...item.dataValues,
        quantity: item.dataValues.OrderItem.dataValues.quantity
      }))
      let totalPrice = 0
      let totalQty = 0
      if (items) {
        items.forEach(item => {
          totalPrice += item.price * item.quantity
        })
        items.forEach(item => {
          totalQty += item.quantity
        })
      }

      return res.render('order', { order: order.toJSON(), items, totalPrice, totalQty })
    })
  },

  postOrderAndPayment: (req, res) => {
    return Cart.findByPk(req.body.cartId, {
      include: [{ model: Product, as: 'items' }]
    })
    .then(cart => {
      const { name, phone, email, address, amount, MerchantOrderNo, TradeInfo } = req.body
      if (!name || !phone || !email || !address) {
        req.flash('warning_msg', 'All fields are required!')
        return res.redirect('back')
      }
      else {

        const data = JSON.parse(create_mpg_aes_decrypt(TradeInfo))
        console.log(data)

        Order.create({
          name,
          phone,
          address,
          amount,
          sn: MerchantOrderNo
        })
        .then(order => {
          cart.dataValues.items.forEach(items => {
            OrderItem.create({
              price: items.dataValues.price,
              quantity: items.dataValues.CartItem.quantity,
              ProductId: items.dataValues.id,
              OrderId: order.id
            })
            .then(orderItem => {
              return res.redirect(`/order/${order.id}`)
            })
          })
        })
      } 
    })
  },

  cancelOrder: (req, res) => {
    Order.findByPk(req.params.id)
    .then(order => {
      order.update({
        payment_status: '-1',
        shipping_status: '-1'
      })
      .then(order => {
        req.flash('success_msg', 'The order has been successfully cancelled!')
        return res.redirect('/orders')
      })  
    })
  }
}

function create_mpg_aes_decrypt(TradeInfo) {
  let decrypt = crypt.createDecipheriv('ase256', HashKey, HashIV)
  decrypt.setAutoPadding(false)
  let text = decrypt.update(TradeInfo, 'hex', 'utf8')
  let plainText = text + decrypt.final('utf8')
  let result = plainText.replace(/[\x00-\x20]+/g, '')
  return result
}

module.exports = orderController