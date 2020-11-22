const db = require('../models')
const CartItem = db.CartItem
const Cart = db.Cart
const Product = db.Product
const crypto = require('crypto')

const URL = process.env.URL
const MerchantID = process.env.MerchantID
const HashKey = process.env.HashKey
const HashIV = process.env.HashIV
const PayGateWay = "https://ccore.newebpay.com/MPG/mpg_gateway"
const ReturnURL = URL+"/newebpay/callback?from=ReturnURL"
const NotifyURL = URL+"/newebpay/callback?from=NotifyURL"
const ClientBackURL = URL+"/orders"



const cartController = {
  getCart: (req, res) => {
    Cart.findByPk(
      req.session.cartId,
      { include: [{ model: Product, as: 'items' }] }
      )
    .then(cart => { 
      let noItems
      let items
      let totalPrice = 0
      let totalQty = 0
      items = rightCartItem(cart)
      if (!items || (items.length === 0)) {
        noItems = true
      }
      else {
        totalPrice = rightCartPrice(items, totalPrice)
        items.forEach(item => {
          totalQty += item.quantity
        })
      }
    
      return res.render('cart', { cart, items, totalPrice, totalQty, noItems })
    })
  },

  postCart: (req, res) => {
    Cart.findOrCreate({
      where: { id: req.session.cartId || 0 }
    })
    .spread((cart, created) => {
      CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.params.id
        },
        default: {
          CartId: cart.id,
          ProductId: req.params.id
        }
      })
      .spread((cartItem, created) => {
        cartItem.update({
          quantity: Number(cartItem.quantity || 0)  + Number(req.body.num)
        })
        .then(cartItem => {
          req.session.cartId = cart.id
          return req.session.save(() => {
            req.flash('success_msg', 'The item has been successfully added!')
            return res.redirect('back')
          })
        })
        .catch(err => console.error(err))
      })  
    })
  },

  removeCartItem: (req, res) => {
    CartItem.findByPk(req.body.cartItemId)
    .then(cartItem => {
      cartItem.destroy().then(cartItem => {
        req.flash('success_msg', 'The item has been successfully removed!')
        return res.redirect('back')
      })
      
    })
  },

  addCartItem: (req, res) => {
    CartItem.findByPk(req.params.id)
    .then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity + 1
      })
      .then(cartItem => {
        return res.redirect('back')
      })
    })
  },

  minCartItem: (req, res) => {
    CartItem.findByPk(req.params.id)
    .then(cartItem => {
      cartItem.update({
        quantity: (cartItem.quantity = 1) ? 1 : cartItem.quantity
      })
      .then(cartItem => {
        return res.redirect('back')
      })
    })
  },

  checkCart: (req, res) => {
    //購物車
    Cart.findByPk(
      req.session.cartId,
      { include: [{ model: Product, as: 'items' }] }
      )
    .then(cart => { 
      let items
      let totalPrice = 0
      let totalQty = 0
      items = rightCartItem(cart)
      if (items) {
        totalPrice = rightCartPrice(items, totalPrice)
        items.forEach(item => {
          totalQty += item.quantity
        })
      }

      //金流，產生交易參數
      const tradeInfo = getTradeInfo(totalPrice, '產品名稱', 'r844312us@gmail.com')
      
      console.log(tradeInfo)
      return res.render('check', { cart, items, totalPrice, totalQty, tradeInfo })
    })
  }
}

//顯示在購物上的商品
function rightCartItem(cart) {
  return items = cart ? cart.dataValues.items.map(item => ({
    ...item.dataValues,
    cartItemId: item.CartItem.dataValues.id,
    quantity: item.CartItem.dataValues.quantity,
    subtotalPrice: item.CartItem.dataValues.quantity * item.dataValues.price, 
  })) : null
}

//總計
function rightCartPrice(items, totalPrice) {
  items.forEach(item => {
    totalPrice += item.price * item.quantity
  })
  return totalPrice
}

//金流
function genDataChain(TradeInfo) {
  let results = []
  for (let kv of Object.entries(TradeInfo)) {
    results.push(`${kv[0]}=${kv[1]}`)
  }
  return results.join("&")
}

function create_mpg_aes_encrypt(TradeInfo) {
  let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV)
  let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex")
  return enc + encrypt.final("hex")
}

function create_mpg_sha_encrypt(TradeInfo) { 
  let sha = crypto.createHash("sha256");
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`
  return sha.update(plainText).digest("hex").toUpperCase()
}

function getTradeInfo(Amt, Desc, email) {
  //TradeInfo
  data = {
    'MerchantID': MerchantID, // 商店代號
    'RespondType': 'JSON', // 回傳格式
    'TimeStamp': Date.now(), // 時間戳記
    'Version': 1.5, // 串接程式版本
    'MerchantOrderNo': Date.now(), // 商店訂單編號
    'LoginType': 0, // 智付通會員
    'OrderComment': 'OrderComment', // 商店備註
    'Amt': Amt, // 訂單金額
    'ItemDesc': Desc, // 產品名稱
    'Email': email, // 付款人電子信箱
    'ReturnURL': ReturnURL, // 支付完成返回商店網址
    'NotifyURL': NotifyURL, // 支付通知網址/每期授權結果通知
    'ClientBackURL': ClientBackURL, // 支付取消返回商店網址
  }

  //加密及雜湊TradeInfo
  mpg_aes_encrypt = create_mpg_aes_encrypt(data)
  mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

  tradeInfo = {
    'MerchantID': MerchantID, // 商店代號
    'TradeInfo': mpg_aes_encrypt, // 加密後參數
    'TradeSha': mpg_sha_encrypt,
    'Version': 1.5, // 串接程式版本
    'PayGateWay': PayGateWay,
    'MerchantOrderNo': data.MerchantOrderNo,
  }

  return tradeInfo
}

module.exports = cartController