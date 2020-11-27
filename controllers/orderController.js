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


// function genDataChain(TradeInfo) {
//   let results = [];
//   for (let kv of Object.entries(TradeInfo)) {
//       results.push(`${kv[0]}=${kv[1]}`);
//   }
//   return results.join("&");
// }

// function create_mpg_aes_encrypt(TradeInfo) {
//   let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV);
//   let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
//   return enc + encrypt.final("hex");
// }

// function create_mpg_aes_decrypt(TradeInfo) {
//   let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV);
//   decrypt.setAutoPadding(false);
//   let text = decrypt.update(TradeInfo, "hex", "utf8");
//   let plainText = text + decrypt.final("utf8");
//   let result = plainText.replace(/[\x00-\x20]+/g, "");
//   return result;
// }

// function create_mpg_sha_encrypt(TradeInfo) {
//   let sha = crypto.createHash("sha256");
//   let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`
//   return sha.update(plainText).digest("hex").toUpperCase();
// }

// function getTradeInfo(Amt, Desc, email){
//   data = {
//     'MerchantID': MerchantID, // 商店代號
//     'RespondType': 'JSON', // 回傳格式
//     'TimeStamp': Date.now(), // 時間戳記
//     'Version': 1.5, // 串接程式版本
//     'MerchantOrderNo': Date.now(), // 商店訂單編號
//     'LoginType': 0, // 智付通會員
//     'OrderComment': 'OrderComment', // 商店備註
//     'Amt': Amt, // 訂單金額
//     'ItemDesc': Desc, // 產品名稱
//     'Email': email, // 付款人電子信箱
//     'ReturnURL': ReturnURL, // 支付完成返回商店網址
//     'NotifyURL': NotifyURL, // 支付通知網址/每期授權結果通知
//     'ClientBackURL': ClientBackURL, // 支付取消返回商店網址
//   }

//   mpg_aes_encrypt = create_mpg_aes_encrypt(data)
//   mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

//   tradeInfo = {
//     'MerchantID': MerchantID, // 商店代號
//     'TradeInfo': mpg_aes_encrypt, // 加密後參數
//     'TradeSha': mpg_sha_encrypt,
//     'Version': 1.5, // 串接程式版本
//     'PayGateWay': PayGateWay,
//     'MerchantOrderNo': data.MerchantOrderNo,
//   }

//   return tradeInfo
// }


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
          cart.dataValues.items.forEach(items => {
            OrderItem.create({
              price: items.dataValues.price,
              quantity: items.dataValues.CartItem.quantity,
              ProductId: items.dataValues.id,
              OrderId: order.id
            })
            .then(orderItem => {
              cart.destroy().then(cart => {
                return res.redirect(`/order/${order.id}`)
              })
              
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