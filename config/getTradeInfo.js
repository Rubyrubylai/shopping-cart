const URL = process.env.URL
const MerchantID = process.env.MerchantID
const PayGateWay = "https://ccore.newebpay.com/MPG/mpg_gateway"
const ReturnURL = URL+"/newebpay/callback?from=ReturnURL"
const NotifyURL = URL+"/newebpay/callback?from=NotifyURL"
const ClientBackURL = URL+"/orders"
const encrypt = require('./encrypt')

module.exports = {
  getTradeInfo: (Amt, Desc, email) => {
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
  
    mpg_aes_encrypt = encrypt.create_mpg_aes_encrypt(data)
    mpg_sha_encrypt = encrypt.create_mpg_sha_encrypt(mpg_aes_encrypt)
  
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
}