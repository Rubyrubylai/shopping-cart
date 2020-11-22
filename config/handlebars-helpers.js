module.exports = {
  Date: (a) => {
    return a.toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei'})
  },

  ifEquals: (a, b, options) => {
    if (a === b) {
      return options.fn(this)
    }
    else {
      return options.inverse(this)
    }
  }
}