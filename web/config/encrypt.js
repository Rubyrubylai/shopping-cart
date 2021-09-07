const crypto = require('crypto')
const HashKey = process.env.HashKey
const HashIV = process.env.HashIV
const genDataChain = require('./getDataChain')

module.exports = {
  create_mpg_aes_encrypt: (TradeInfo) => {
    let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV)
    let enc = encrypt.update(genDataChain.genDataChain(TradeInfo), "utf8", "hex")
    return enc + encrypt.final("hex")
  },
  
  create_mpg_aes_decrypt: (TradeInfo) => {
    let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV)
    decrypt.setAutoPadding(false)
    let text = decrypt.update(TradeInfo, "hex", "utf8")
    let plainText = text + decrypt.final("utf8")
    let result = plainText.replace(/[\x00-\x20]+/g, "")
    return result
  },
  
  create_mpg_sha_encrypt: (TradeInfo) => {
    let sha = crypto.createHash("sha256")
    let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`
    return sha.update(plainText).digest("hex").toUpperCase()
  }
}