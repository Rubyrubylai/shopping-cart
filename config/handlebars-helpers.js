module.exports = {
  Date: (a) => {
    return a.toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei'})
  }
}