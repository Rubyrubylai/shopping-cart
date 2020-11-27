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
    user: 'r844312@gmail.com',
    pass: '',
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

       //上方導覽列的分類
       Category.findAll({
        raw: true,
        nest: true
      })
      .then(categories => {
        return res.render('orders', { orders, categories })
      })
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

      //取得payment
      payment = sort.payment(order)
      console.log(payment.length)
      console.log([]='')

      //金流，產生交易參數
      const tradeInfo = getTradeInfo.getTradeInfo(totalPrice, '產品名稱', 'r844312@gmail.com')
      
      order.update({
        sn: tradeInfo.MerchantOrderNo
      })
      .then(order => {
         //上方導覽列的分類
         Category.findAll({
          raw: true,
          nest: true
        })
        .then(categories => {
          return res.render('order', { order: order.toJSON(), items, totalPrice, totalQty, tradeInfo, payment: payment[0], categories })
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
          UserId: req.user.id
        })
        .then(order => {
          console.log('--------------------Order')
          // const items = []
          // items.push(orderItems.dataValues)
          const items = cart.toJSON().items
          let text = ''
          items.forEach(i => {
            text += `
            ${i.name}
            <img src="${i.image}">
            $${i.price}
            `
          })
          console.log(text)
          var mailOptions = {
            from: 'r844312@gmail.com',
            to: 'r844312@gmail.com',
            subject: `Order Confirmation: SHOP #${order.id}`,
            text: 'Thank you for ordering.'
          }

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error)
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
        req.flash('success_msg', 'The order has been successfully cancelled!')
        return res.redirect('/orders')
      })  
    })
  },

  newebpayCallback: (req, res) => {
    const data = JSON.parse(encrypt.create_mpg_aes_decrypt(req.body.TradeInfo))
    console.log(data)

    return Order.findAll({ where: { sn: data['Result']['MerchantOrderNo'] } })
    .then(orders => {
      
      console.log(orders)
      console.log('====================================')
      const time = data['Result']['PayTime']
      const payTime = new Date(time.slice(0,10) + ' ' + time.slice(10))
      
      if (data['Result']['PaymentType'] === 'CREDIT' || 'WEBATM') {
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
            return res.redirect(`/order/${order.id}`)
          })
        })
      }
      else {
          Payment.create({
            OrderId: order.id,
            sn: order.sn,
            amount: order.amount,
            payment_method: 'Others',
            params: 'success'
          })
          .then(payment => {
            return res.redirect(`/order/${order.id}`)
          })
      }
    })
  }
}

module.exports = orderController