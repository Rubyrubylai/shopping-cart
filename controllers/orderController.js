const db = require('../models')
const Order = db.Order
const Payment = db.Payment
const Product = db.Product
const Cart = db.Cart
const OrderItem = db.OrderItem
const Category = db.Category

const sort = require('../config/sort')
const encrypt = require('../config/encrypt')
const getTradeInfo = require('../config/getTradeInfo')

const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.Email,
    pass: process.env.Password,
  },
})

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({ 
      where: {
        UserId: req.user.id
      },
      order: [ ['createdAt', 'DESC'] ],
      include: [ Payment ]
    }).then(orders => {
      //取得payment
      orders = sort.payments(orders)
      //右側購物車
      Cart.findByPk(
        req.session.cartId,
        { include: [{ model: Product, as: 'items' }] }
      )
      .then(cart => {     
        let noItems
        let items
        let totalPrice = 0
        items = sort.rightCartItem(cart)
        if (!items || (items.length === 0)) {
          noItems = true
        }
        else {
          totalPrice = sort.rightCartPrice(items, totalPrice)
        }

        //上方導覽列的分類
        Category.findAll({
          raw: true,
          nest: true
        })
        .then(categories => {
          return res.render('orders', { orders, categories, noItems, items, totalPrice })
        })
      })
    })
  },

  getOrder: (req, res) => {
    Order.findByPk(
      req.params.id,
      { include: [{ model: Product, as: 'items' }, Payment]}
    )
    .then(order => {
      orderItems = order.dataValues.items.map(item => ({
        ...item.dataValues,
        quantity: item.dataValues.OrderItem.dataValues.quantity
      }))
      let orderTotalPrice = 0
      let orderTotalQty = 0
      if (orderItems) {
        orderItems.forEach(item => {
          orderTotalPrice += item.price * item.quantity
        })
        orderItems.forEach(item => {
          orderTotalQty += item.quantity
        })
      }

      //取得payment
      payment = sort.payment(order)

      //金流，產生交易參數
      const tradeInfo = getTradeInfo.getTradeInfo(orderTotalPrice, order.id, order.email)
      
      order.update({
        sn: tradeInfo.MerchantOrderNo
      })
      .then(order => {
        //右側購物車
        Cart.findByPk(
          req.session.cartId,
          { include: [{ model: Product, as: 'items' }] }
        )
        .then(cart => {     
          let noItems
          let items
          let totalPrice = 0
          items = sort.rightCartItem(cart)
          if (!items || (items.length === 0)) {
            noItems = true
          }
          else {
            totalPrice = sort.rightCartPrice(items, totalPrice)
          }
          let cartId
          if (req.session.cartId) {
            cartId = req.session.cartId
          }

          //上方導覽列的分類
          Category.findAll({
            raw: true,
            nest: true
          })
          .then(categories => {
            return res.render('order', { order: order.toJSON(), orderItems, orderTotalPrice, orderTotalQty, tradeInfo, payment: payment[0], categories, noItems, items, totalPrice, cartId })
          })
        })
      })
    })
  },

  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId, {
      include: [{ model: Product, as: 'items' }]
    })
    .then(cart => {
      const { name, phone, email, address, amount } = req.body
      if (!name || !phone || !email || !address) {
        req.flash('warning_msg', 'All fields are required!')
        return res.redirect('back')
      }
      else {
        Order.create({
          name,
          phone,
          address,
          amount,
          payment_status: 0,
          shipping_status: -1,
          UserId: req.user.id,
          email
        })
        .then(order => {
          
          //訂單通知信
          const items = cart.toJSON().items
          let text = `
            <p>Thank you for ordering.</p>
            <h3>Details:</h3>
          `
          items.forEach(i => {
            text += `
            <div style="margin-bottom: 2px;">
              <p><strong>${i.name}</strong></p>
              <img src="${i.image}" style="width:200px;">
              <p>$${i.price}</p>
            </div>
            `
          })
          text += `
            <p>We hope to see you again soon.</p>
            <br>
            <span>Best regards,</span>
            <span>SHOP</span>
          `

          var mailOptions = {
            from: process.env.Email,
            to: order.email,
            subject: `Order Confirmation: SHOP #${order.id}`,
            html: text
          }
          
          transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log('Email sent: ' + info.response)
            }
          })

          var results = []
          cart.dataValues.items.forEach(items => {
            results.push(
              OrderItem.create({
                price: items.dataValues.price,
                quantity: items.dataValues.CartItem.quantity,
                ProductId: items.dataValues.id,
                OrderId: order.id
              })
            )
          })

          return Promise.all(results).then(() => {
            //訂單成立後，清空購物車內的商品
            cart.destroy().then(cart => {
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
        payment_status: -1,
        shipping_status: -2
      })
      .then(order => {
        req.flash('success_msg', `The order has been cancelled!`)
        return res.redirect('back')
      })  
    })
  },

  newebpayCallback: (req, res) => {
    const data = JSON.parse(encrypt.create_mpg_aes_decrypt(req.body.TradeInfo))
    return Order.findAll({ where: { sn: data['Result']['MerchantOrderNo'] } })
    .then(orders => {
      const time = data['Result']['PayTime']
      const payTime = new Date(time.slice(0,10) + ' ' + time.slice(10))

      orders[0].update({
        payment_status: 1,
      }).then(order => {
        Payment.create({
          OrderId: order.id,
          sn: order.sn,
          amount: order.amount,
          payment_method: data['Result']['PaymentType'],
          paid_at: payTime,
          params: 'success'
        })
        .then(payment => {
          req.flash('success_msg', 'Thank you for your ordering. We will prepare the shipment ASAP!')
          return res.redirect(`/order/${order.id}`)
        })
      })
    })
  }
}

module.exports = orderController